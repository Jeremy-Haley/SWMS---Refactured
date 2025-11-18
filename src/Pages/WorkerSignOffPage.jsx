import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { CheckCircle, AlertCircle } from 'lucide-react';

export const WorkerSignOffPage = () => {
  const { swmsId } = useParams();
  const navigate = useNavigate();

  const [swms, setSwms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    workerName: '',
    workerPosition: '',
  });

  useEffect(() => {
    loadSWMS();
  }, [swmsId]);

  const loadSWMS = async () => {
    try {
      const { data, error } = await supabase
        .from('swms_documents')
        .select('*')
        .eq('id', swmsId)
        .single();

      if (error) throw error;

      if (!data) {
        setError('SWMS document not found');
        return;
      }

      setSwms({
        id: data.id,
        projectName: data.project_name,
        location: data.project_location || data.location,
        date: data.date,
        supervisor: data.supervisor,
        supervisorPhone: data.supervisor_phone,
      });
    } catch (err) {
      console.error('Error loading SWMS:', err);
      setError('Failed to load SWMS document');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.workerName.trim() || !formData.workerPosition.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Insert into the CORRECT table name: swms_signoffs
      const { error: insertError } = await supabase
        .from('swms_signoffs') // ✅ FIXED: Correct table name
        .insert([
          {
            swms_id: swmsId,
            worker_name: formData.workerName,
            worker_position: formData.workerPosition,
            // Removed worker_company field as it's not in the database schema
          },
        ]);

      if (insertError) throw insertError;

      setSuccess(true);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({ workerName: '', workerPosition: '' });
        // Can optionally redirect or allow multiple sign-offs
      }, 3000);
    } catch (err) {
      console.error('Error saving sign-off:', err);
      setError('Failed to save sign-off. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom, #eff6ff, #dbeafe)',
          padding: '24px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '48px',
              marginBottom: '16px',
            }}
          >
            📋
          </div>
          <div style={{ fontSize: '18px', color: '#6b7280' }}>
            Loading SWMS Document...
          </div>
        </div>
      </div>
    );
  }

  if (error && !swms) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom, #eff6ff, #dbeafe)',
          padding: '24px',
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '40px',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <AlertCircle
            size={64}
            style={{ color: '#ef4444', margin: '0 auto 24px' }}
          />
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '16px',
            }}
          >
            Document Not Found
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>{error}</p>
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom, #eff6ff, #dbeafe)',
          padding: '24px',
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '40px',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <CheckCircle
            size={64}
            style={{ color: '#10b981', margin: '0 auto 24px' }}
          />
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '16px',
            }}
          >
            Sign-Off Complete! ✓
          </h1>
          <p
            style={{ color: '#6b7280', fontSize: '16px', marginBottom: '12px' }}
          >
            Thank you, <strong>{formData.workerName}</strong>
          </p>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Your sign-off has been recorded for:
          </p>
          <div
            style={{
              background: '#f0f9ff',
              padding: '16px',
              borderRadius: '8px',
              marginTop: '20px',
              border: '2px solid #3b82f6',
            }}
          >
            <div
              style={{
                fontWeight: 'bold',
                color: '#1e40af',
                marginBottom: '8px',
              }}
            >
              {swms.projectName}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              {swms.location}
            </div>
          </div>
          <button
            onClick={() => setSuccess(false)}
            style={{
              marginTop: '24px',
              background: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px',
            }}
          >
            Sign Off Another Worker
          </button>
          <p style={{ color: '#9ca3af', fontSize: '13px', marginTop: '24px' }}>
            You can now return to work safely
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #eff6ff, #dbeafe)',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          maxWidth: '600px',
          width: '100%',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: '#1e40af',
            color: 'white',
            padding: '24px',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
          }}
        >
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '8px',
            }}
          >
            SWMS Worker Sign-Off
          </h1>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>
            Please confirm you have read and understood the safety requirements
          </p>
        </div>

        {/* SWMS Details */}
        <div
          style={{
            padding: '24px',
            borderBottom: '2px solid #e5e7eb',
            background: '#f9fafb',
          }}
        >
          <div style={{ marginBottom: '12px' }}>
            <div
              style={{
                fontSize: '12px',
                color: '#6b7280',
                marginBottom: '4px',
              }}
            >
              Project
            </div>
            <div
              style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}
            >
              {swms.projectName}
            </div>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}
          >
            <div style={{ marginBottom: '12px' }}>
  <div
    style={{
      fontSize: '12px',
      color: '#6b7280',
      marginBottom: '4px',
    }}
  >
    Location
  </div>
  <div style={{ fontSize: '14px', color: '#1f2937' }}>
    {swms.location}
  </div>
</div>

<div style={{ background: '#eff6ff', padding: '12px', borderRadius: '6px', border: '2px solid #3b82f6' }}>
  <div
    style={{
      fontSize: '12px',
      color: '#1e40af',
      marginBottom: '6px',
      fontWeight: '600',
    }}
  >
    Site Supervisor
  </div>
  <div style={{ fontSize: '15px', color: '#1f2937', fontWeight: 'bold', marginBottom: '4px' }}>
    {swms.supervisor}
  </div>
  {swms.supervisorPhone && (
    <div style={{ fontSize: '14px', color: '#3b82f6' }}>
      Contact: {swms.supervisorPhone}
    </div>
  )}
</div>
          </div>
        </div>

        {/* Sign-Off Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                fontSize: '14px',
                color: '#1f2937',
              }}
            >
              Your Full Name *
            </label>
            <input
              type="text"
              value={formData.workerName}
              onChange={(e) =>
                setFormData({ ...formData, workerName: e.target.value })
              }
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
              }}
              placeholder="Enter your full name"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
                fontSize: '14px',
                color: '#1f2937',
              }}
            >
              Your Position/Role *
            </label>
            <input
              type="text"
              value={formData.workerPosition}
              onChange={(e) =>
                setFormData({ ...formData, workerPosition: e.target.value })
              }
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
              }}
              placeholder="e.g., Carpenter, Labourer, etc."
            />
          </div>

          {error && (
            <div
              style={{
                background: '#fee2e2',
                border: '2px solid #ef4444',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '20px',
                color: '#dc2626',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              background: submitting ? '#9ca3af' : '#10b981',
              color: 'white',
              padding: '16px',
              borderRadius: '8px',
              border: 'none',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '18px',
            }}
          >
            {submitting ? 'Signing Off...' : '✓ Sign Off on SWMS'}
          </button>

          <p
            style={{
              marginTop: '16px',
              fontSize: '13px',
              color: '#6b7280',
              textAlign: 'center',
            }}
          >
            By signing off, you confirm you have read and understood all safety
            requirements for this work
          </p>
        </form>
      </div>
    </div>
  );
};
