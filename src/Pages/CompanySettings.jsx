import React, { useState, useEffect } from 'react';
import { Building2, Save, X } from 'lucide-react';
import { useCompany } from '../contexts/CompanyContext';
import { supabase } from '../utils/supabaseClient';

export const CompanySettings = ({ onClose }) => {
  const { company, user } = useCompany();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    orgName: '',
    acnAbn: '',
    contactName: '',
    contactNumber: '',
    preparedBy: '',
    primaryColor: '#1e40af',
  });

  useEffect(() => {
    loadCompanyDetails();
  }, [company]);

  const loadCompanyDetails = async () => {
    if (!company) return;

    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', company.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          orgName: data.name || '',
          acnAbn: data.abn || '',
          contactName: data.contact_name || '',
          contactNumber: data.contact_phone || '',
          preparedBy: data.prepared_by || '',
          primaryColor: data.primary_color || '#1e40af',
        });
      }
    } catch (error) {
      console.error('Error loading company details:', error);
    }
  };

  const handleSave = async () => {
    if (!company) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          name: formData.orgName,
          abn: formData.acnAbn,
          contact_name: formData.contactName,
          contact_phone: formData.contactNumber,
          prepared_by: formData.preparedBy,
          primary_color: formData.primaryColor,
        })
        .eq('id', company.id);

      if (error) throw error;

      alert('Company details updated successfully!');
      onClose();

      // Reload page to update header
      window.location.reload();
    } catch (error) {
      console.error('Error saving company details:', error);
      alert('Error saving company details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '2px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Building2 size={24} color="#1e40af" />
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1e40af',
                margin: 0,
              }}
            >
              Company Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#ef4444',
              color: 'white',
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: '24px' }}>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            These details will appear on all your SWMS documents and PDFs
          </p>

          {/* Organization Name */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '600',
                fontSize: '14px',
                color: '#1f2937',
              }}
            >
              Organization Name *
            </label>
            <input
              type="text"
              value={formData.orgName}
              onChange={(e) =>
                setFormData({ ...formData, orgName: e.target.value })
              }
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
              }}
              placeholder="E.g., ABC Builders PTY LTD"
            />
          </div>

          {/* ACN/ABN */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '600',
                fontSize: '14px',
                color: '#1f2937',
              }}
            >
              ACN/ABN
            </label>
            <input
              type="text"
              value={formData.acnAbn}
              onChange={(e) =>
                setFormData({ ...formData, acnAbn: e.target.value })
              }
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
              }}
              placeholder="E.g., 12 345 678 901"
            />
          </div>

          {/* Contact Name */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '600',
                fontSize: '14px',
                color: '#1f2937',
              }}
            >
              Contact Name
            </label>
            <input
              type="text"
              value={formData.contactName}
              onChange={(e) =>
                setFormData({ ...formData, contactName: e.target.value })
              }
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
              }}
              placeholder="E.g., John Smith"
            />
          </div>

          {/* Contact Number */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '600',
                fontSize: '14px',
                color: '#1f2937',
              }}
            >
              Contact Number
            </label>
            <input
              type="text"
              value={formData.contactNumber}
              onChange={(e) =>
                setFormData({ ...formData, contactNumber: e.target.value })
              }
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
              }}
              placeholder="E.g., 0412 345 678"
            />
          </div>

          {/* Prepared By */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '600',
                fontSize: '14px',
                color: '#1f2937',
              }}
            >
              Default Prepared By
            </label>
            <input
              type="text"
              value={formData.preparedBy}
              onChange={(e) =>
                setFormData({ ...formData, preparedBy: e.target.value })
              }
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
              }}
              placeholder="E.g., Safety Manager"
            />
          </div>

          {/* Primary Color */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: '600',
                fontSize: '14px',
                color: '#1f2937',
              }}
            >
              Brand Color (for PDFs)
            </label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) =>
                  setFormData({ ...formData, primaryColor: e.target.value })
                }
                style={{
                  width: '80px',
                  height: '48px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              />
              <input
                type="text"
                value={formData.primaryColor}
                onChange={(e) =>
                  setFormData({ ...formData, primaryColor: e.target.value })
                }
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                }}
                placeholder="#1e40af"
              />
            </div>
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
              This color will be used in PDF headers and QR posters
            </p>
          </div>

          {/* Action Buttons */}
          <div
            style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}
          >
            <button
              onClick={onClose}
              style={{
                background: '#6b7280',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !formData.orgName}
              style={{
                background: loading ? '#9ca3af' : '#10b981',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
