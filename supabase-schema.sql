-- SWMS Manager Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- SWMS Documents Table
CREATE TABLE swms_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_name TEXT NOT NULL,
  location TEXT NOT NULL,
  date DATE NOT NULL,
  supervisor TEXT NOT NULL,
  
  -- Company details
  company_org_name TEXT,
  company_acn_abn TEXT,
  company_contact_name TEXT,
  company_contact_number TEXT,
  company_prepared_by TEXT,
  
  -- Emergency contacts
  emergency_nearest_police TEXT,
  emergency_police_phone TEXT,
  emergency_nearest_medical TEXT,
  emergency_medical_phone TEXT,
  
  -- Job steps (stored as JSONB)
  job_steps JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Worker Sign-offs Table
CREATE TABLE swms_signoffs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swms_id UUID REFERENCES swms_documents(id) ON DELETE CASCADE,
  
  -- Worker details
  worker_name TEXT NOT NULL,
  worker_position TEXT NOT NULL,
  signature_data TEXT, -- Can store base64 signature image
  
  -- Sign-off metadata
  signed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_swms_documents_date ON swms_documents(date DESC);
CREATE INDEX idx_swms_documents_project ON swms_documents(project_name);
CREATE INDEX idx_swms_signoffs_swms_id ON swms_signoffs(swms_id);
CREATE INDEX idx_swms_signoffs_signed_at ON swms_signoffs(signed_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to swms_documents
CREATE TRIGGER update_swms_documents_updated_at 
  BEFORE UPDATE ON swms_documents 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE swms_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE swms_signoffs ENABLE ROW LEVEL SECURITY;

-- Public access policies (you can restrict these later)
-- Allow anyone to read SWMS documents
CREATE POLICY "Anyone can view SWMS documents" 
  ON swms_documents FOR SELECT 
  USING (true);

-- Allow anyone to create SWMS documents (you might want to restrict this)
CREATE POLICY "Anyone can create SWMS documents" 
  ON swms_documents FOR INSERT 
  WITH CHECK (true);

-- Allow anyone to update their own SWMS documents
CREATE POLICY "Anyone can update SWMS documents" 
  ON swms_documents FOR UPDATE 
  USING (true);

-- Allow anyone to delete SWMS documents (you might want to restrict this)
CREATE POLICY "Anyone can delete SWMS documents" 
  ON swms_documents FOR DELETE 
  USING (true);

-- Allow anyone to read sign-offs
CREATE POLICY "Anyone can view sign-offs" 
  ON swms_signoffs FOR SELECT 
  USING (true);

-- Allow anyone to create sign-offs (for QR code signing)
CREATE POLICY "Anyone can create sign-offs" 
  ON swms_signoffs FOR INSERT 
  WITH CHECK (true);

-- Allow deletion of sign-offs
CREATE POLICY "Anyone can delete sign-offs" 
  ON swms_signoffs FOR DELETE 
  USING (true);

-- Create a view for SWMS documents with sign-off counts
CREATE OR REPLACE VIEW swms_with_signoff_count AS
SELECT 
  d.*,
  COUNT(s.id) as signoff_count
FROM swms_documents d
LEFT JOIN swms_signoffs s ON d.id = s.swms_id
GROUP BY d.id;

-- Grant access to the view
GRANT SELECT ON swms_with_signoff_count TO anon, authenticated;

-- Create a function to get SWMS with sign-offs
CREATE OR REPLACE FUNCTION get_swms_with_signoffs(swms_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'document', row_to_json(d.*),
    'signoffs', COALESCE(
      (SELECT json_agg(row_to_json(s.*))
       FROM swms_signoffs s
       WHERE s.swms_id = swms_uuid
       ORDER BY s.signed_at DESC),
      '[]'::json
    )
  ) INTO result
  FROM swms_documents d
  WHERE d.id = swms_uuid;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
