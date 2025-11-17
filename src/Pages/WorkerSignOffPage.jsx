import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const WorkerSignOffPage = () => {
  const { swmsId } = useParams();
  
  const [swms, setSwms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showSignOffForm, setShowSignOffForm] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState({});
  
  const [formData, setFormData] = useState({
    workerName: '',
    workerCompany: '',
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

      // Parse the full SWMS data including job steps
      setSwms({
        id: data.id,
        projectName: data.project_name,
        location: data.project_location || data.location,
        activity: data.activity,
        date: data.date,
        supervisor: data.supervisor,
        jobSteps: data.job_steps || [],
        company: {
          orgName: data.company_org_name,
          acnAbn: data.company_acn_abn,
        },
        emergencyContacts: data.emergency_contacts || {},
      });
    } catch (err) {
      console.error('Error loading SWMS:', err);
      setError('Failed to load SWMS document');
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = (index) => {
    setExpandedSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.workerName.trim() || !formData.workerCompany.trim() || !formData.workerPosition.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('swms_signoffs')
        .insert([
          {
            swms_id: swmsId,
            worker_name: formData.workerName.trim(),
            worker_company: formData.workerCompany.trim(),
            worker_position: formData.workerPosition.trim(),
          },
        ]);

      if (insertError) throw insertError;

      setSuccess(true);
      
    } catch (err) {
      console.error('Error saving sign-off:', err);
      setError('Failed to save sign-off. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom, #eff6ff, #dbeafe)', padding: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading SWMS Document...</div>
        </div>
      </div>
    );
  }

  if (error && !swms) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom, #eff6ff, #dbeafe)', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '40px', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <AlertCircle size={64} style={{ color: '#ef4444', margin: '0 auto 24px' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Document Not Found</h1>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom, #eff6ff, #dbeafe)', padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '40px', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <CheckCircle size={64} style={{ color: '#10b981', margin: '0 auto 24px' }} />
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Sign-Off Complete! ✓</h1>
          <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '12px' }}>Thank you, <strong>{formData.workerName}</strong></p>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Your sign-off has been recorded for:</p>
          <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px', marginTop: '20px', border: '2px solid #3b82f6' }}>
            <div style={{ fontWeight: 'bold', color: '#1e40af', marginBottom: '8px' }}>{swms.projectName}</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>{swms.location}</div>
          </div>
          <button onClick={() => { setSuccess(false); setShowSignOffForm(false); setFormData({ workerName: '', workerCompany: '', workerPosition: '' }); }} style={{ marginTop: '24px', background: '#3b82f6', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '16px' }}>
            Sign Off Another Worker
          </button>
          <p style={{ color: '#9ca3af', fontSize: '13px', marginTop: '24px' }}>You can now return to work safely</p>
        </div>
      </div>
    );
  }

  // Main SWMS Display
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #eff6ff, #dbeafe)', padding: '24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ background: '#1e40af', color: 'white', padding: '16px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>⚠️ Safe Work Method Statement</h1>
            <p style={{ fontSize: '14px', margin: 0, opacity: 0.9 }}>Read carefully before signing off</p>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Company</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>{swms.company?.orgName || 'A&L Builders PTY LTD'}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Project</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{swms.projectName}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Activity</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{swms.activity || 'Construction Work'}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Location</div>
              <div style={{ fontSize: '14px', color: '#1f2937' }}>{swms.location}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Supervisor</div>
              <div style={{ fontSize: '14px', color: '#1f2937' }}>{swms.supervisor}</div>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        {swms.emergencyContacts && (swms.emergencyContacts.nearestPolice || swms.emergencyContacts.nearestMedical) && (
          <div style={{ background: '#fee2e2', border: '3px solid #dc2626', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#991b1b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🚨 Emergency Contacts
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {swms.emergencyContacts.nearestPolice && (
                <div style={{ background: 'white', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#991b1b', marginBottom: '4px' }}>Police</div>
                  <div style={{ fontSize: '14px', color: '#1f2937', marginBottom: '4px' }}>{swms.emergencyContacts.nearestPolice}</div>
                  {swms.emergencyContacts.policePhone && (
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e40af' }}>{swms.emergencyContacts.policePhone}</div>
                  )}
                </div>
              )}
              {swms.emergencyContacts.nearestMedical && (
                <div style={{ background: 'white', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#991b1b', marginBottom: '4px' }}>Medical</div>
                  <div style={{ fontSize: '14px', color: '#1f2937', marginBottom: '4px' }}>{swms.emergencyContacts.nearestMedical}</div>
                  {swms.emergencyContacts.medicalPhone && (
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e40af' }}>{swms.emergencyContacts.medicalPhone}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Job Steps - Hazards and Controls */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚠️ Hazards & Control Measures
          </h2>
          
          {swms.jobSteps && swms.jobSteps.length > 0 ? (
            swms.jobSteps.map((step, index) => (
              <div key={index} style={{ background: 'white', borderRadius: '12px', marginBottom: '12px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                <button
                  onClick={() => toggleStep(index)}
                  style={{ width: '100%', padding: '16px', background: expandedSteps[index] ? '#dbeafe' : 'white', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>
                      {index + 1}. {step.name || step.task || 'Work Step'}
                    </div>
                    <div style={{ fontSize: '14px', color: '#dc2626', fontWeight: '600' }}>
                      ⚠️ Hazard: {step.hazard}
                    </div>
                  </div>
                  {expandedSteps[index] ? <ChevronUp size={24} color="#1e40af" /> : <ChevronDown size={24} color="#6b7280" />}
                </button>
                
                {expandedSteps[index] && (
                  <div style={{ padding: '16px', borderTop: '2px solid #e5e7eb', background: '#f9fafb' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#dc2626', marginBottom: '8px' }}>HAZARD:</div>
                      <div style={{ fontSize: '14px', color: '#1f2937', background: '#fee2e2', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #dc2626' }}>
                        {step.hazard}
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#059669', marginBottom: '8px' }}>CONTROL MEASURES:</div>
                      <div style={{ fontSize: '14px', color: '#1f2937', background: '#d1fae5', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #059669', whiteSpace: 'pre-wrap' }}>
                        {step.control}
                      </div>
                    </div>

                    {step.ppe && (
                      <div style={{ marginTop: '12px', background: '#fef3c7', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#92400e', marginBottom: '4px' }}>REQUIRED PPE:</div>
                        <div style={{ fontSize: '14px', color: '#78350f' }}>{step.ppe}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', textAlign: 'center', color: '#6b7280' }}>
              No hazards or control measures specified
            </div>
          )}
        </div>

        {/* Sign-Off Section */}
        {!showSignOffForm ? (
          <div style={{ background: 'white', borderRadius: '12px', padding: '32px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ background: '#dbeafe', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e40af', marginBottom: '12px' }}>
                ✓ I have read and understood this SWMS
              </h3>
              <p style={{ fontSize: '14px', color: '#1e40af', margin: 0 }}>
                By clicking below, you confirm you have read all hazards and control measures
              </p>
            </div>
            <button
              onClick={() => setShowSignOffForm(true)}
              style={{ background: '#10b981', color: 'white', padding: '16px 48px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}
            >
              Proceed to Sign Off →
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px', textAlign: 'center' }}>
              Worker Sign-Off
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#1f2937' }}>
                Your Full Name *
              </label>
              <input
                type="text"
                value={formData.workerName}
                onChange={(e) => setFormData({ ...formData, workerName: e.target.value })}
                required
                style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }}
                placeholder="Enter your full name"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#1f2937' }}>
                Your Company *
              </label>
              <input
                type="text"
                value={formData.workerCompany}
                onChange={(e) => setFormData({ ...formData, workerCompany: e.target.value })}
                required
                style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }}
                placeholder="Enter your company name"
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#1f2937' }}>
                Your Position/Role *
              </label>
              <input
                type="text"
                value={formData.workerPosition}
                onChange={(e) => setFormData({ ...formData, workerPosition: e.target.value })}
                required
                style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }}
                placeholder="e.g., Carpenter, Labourer, etc."
              />
            </div>

            {error && (
              <div style={{ background: '#fee2e2', border: '2px solid #ef4444', borderRadius: '8px', padding: '12px', marginBottom: '20px', color: '#dc2626', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setShowSignOffForm(false)}
                style={{ flex: 1, background: '#e5e7eb', color: '#1f2937', padding: '14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{ flex: 2, background: submitting ? '#9ca3af' : '#10b981', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px' }}
              >
                {submitting ? 'Signing Off...' : '✓ Sign Off on SWMS'}
              </button>
            </div>

            <p style={{ marginTop: '16px', fontSize: '13px', color: '#6b7280', textAlign: 'center' }}>
              By signing off, you confirm you have read and understood all safety requirements for this work
            </p>
          </form>
        )}
      </div>
    </div>
  );
};