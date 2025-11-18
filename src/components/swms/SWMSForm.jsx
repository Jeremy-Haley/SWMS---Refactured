import React from 'react';
import { Save, X, Plus, Trash2, AlertTriangle, Phone } from 'lucide-react';

export const SWMSForm = ({
  formData,
  editingSWMS,
  onSave,
  onCancel,
  updateFormField,
  updateCompanyField,
  onOpenTemplateModal,
  onUpdateJobStep,
  onRemoveJobStep,
  onAddCustomJobStep,
  onAddSignOff,
  onUpdateSignOff,
  onRemoveSignOff,
  onSearchEmergencyServices,
  onGenerateQRCode,
}) => {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <h2
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1e40af',
          marginBottom: '24px',
        }}
      >
        {editingSWMS ? 'Edit SWMS' : 'Create New SWMS'}
      </h2>

      {/* Project Details */}
      <div style={{ marginBottom: '24px' }}>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#1f2937',
          }}
        >
          Project Details
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
              }}
            >
              Project Name *
            </label>
            <input
              type="text"
              value={formData.projectName}
              onChange={(e) => updateFormField('projectName', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
              placeholder="Enter project name"
            />
          </div>
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
              }}
            >
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => updateFormField('location', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
              }}
              placeholder="Site address"
            />
          </div>
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
              }}
            >
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => updateFormField('date', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit',
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
              }}
            >
              Supervisor *
            </label>
            <input
              type="text"
              value={formData.supervisor}
              onChange={(e) => updateFormField('supervisor', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
              }}
              placeholder="Supervisor name"
            />
          </div>
        </div>
      </div>

      {/* Company Details */}
      <div style={{ marginBottom: '24px' }}>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#1f2937',
          }}
        >
          Company Details
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
              }}
            >
              Organization Name
            </label>
            <input
              type="text"
              value={formData.company.orgName}
              onChange={(e) => updateCompanyField('orgName', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
              }}
            >
              ACN/ABN
            </label>
            <input
              type="text"
              value={formData.company.acnAbn}
              onChange={(e) => updateCompanyField('acnAbn', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
              }}
            >
              Contact Name
            </label>
            <input
              type="text"
              value={formData.company.contactName || ''}
              onChange={(e) => updateCompanyField('contactName', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
              }}
              placeholder="Primary contact person"
            />
          </div>
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
              }}
            >
              Contact Number
            </label>
            <input
              type="tel"
              value={formData.company.contactNumber || ''}
              onChange={(e) => updateCompanyField('contactNumber', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
              }}
              placeholder="e.g., (07) 1234 5678"
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
              }}
            >
              Document Prepared By
            </label>
            <input
              type="text"
              value={formData.company.preparedBy || ''}
              onChange={(e) => updateCompanyField('preparedBy', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
              }}
              placeholder="Name of person who prepared this document"
            />
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div style={{ marginBottom: '24px' }}>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#1f2937',
          }}
        >
          <Phone
            size={20}
            style={{
              display: 'inline',
              marginRight: '8px',
              verticalAlign: 'middle',
              color: '#dc2626',
            }}
          />
          Emergency Contacts
        </h3>
        
{/* Claude Helper Tip */}
<div
  style={{
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '16px 20px',
    borderRadius: '8px',
    marginBottom: '16px',
    border: '2px solid #5a67d8',
    boxShadow: '0 4px 6px rgba(102, 126, 234, 0.2)',
  }}
>
  <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
    <div style={{ fontSize: '24px', flexShrink: 0 }}>💡</div>
    <div>
      <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '8px' }}>
        Need help finding emergency contacts?
      </div>
      <div style={{ fontSize: '14px', lineHeight: '1.6', opacity: 0.95 }}>
        Ask Claude to search for you! Just say:<br />
        <span style={{ 
          background: 'rgba(255,255,255,0.2)', 
          padding: '4px 8px', 
          borderRadius: '4px',
          display: 'inline-block',
          marginTop: '6px',
          fontFamily: 'monospace',
          fontSize: '13px'
        }}>
          "Claude, find emergency services near {formData.location || '[your location]'}"
        </span>
      </div>
    </div>
  </div>
</div>

        {/* Prominent Emergency Number */}
        <div
          style={{
            background: '#dc2626',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          <div
            style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}
          >
            IN EMERGENCY DIAL
          </div>
          <div
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              letterSpacing: '4px',
            }}
          >
            000
          </div>
        </div>

        {/* Find Emergency Services Button */}
        {formData.location && (
          <div style={{ marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => {
                if (onSearchEmergencyServices) {
                  onSearchEmergencyServices(formData.location);
                }
              }}
              style={{
                width: '100%',
                background: '#1e40af',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              🔍 Find Emergency Services Near "{formData.location}"
            </button>
          </div>
        )}

        {/* Location-based services */}
        <div
          style={{
            background: '#fee2e2',
            border: '2px solid #dc2626',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
            }}
          >
            {/* Nearest Police Station */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: '#dc2626',
                }}
              >
                Nearest Police Station
              </label>
              <input
                type="text"
                value={formData.emergencyContacts?.nearestPolice || ''}
                onChange={(e) =>
                  updateFormField('emergencyContacts', {
                    ...formData.emergencyContacts,
                    nearestPolice: e.target.value,
                  })
                }
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #dc2626',
                  borderRadius: '6px',
                  fontSize: '14px',
                  background: 'white',
                }}
                placeholder="e.g., Brisbane City Police, 67 Adelaide St, Brisbane"
              />
            </div>

            {/* Police Contact */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: '#dc2626',
                }}
              >
                Police Contact Number
              </label>
              <input
                type="text"
                value={formData.emergencyContacts?.policePhone || ''}
                onChange={(e) =>
                  updateFormField('emergencyContacts', {
                    ...formData.emergencyContacts,
                    policePhone: e.target.value,
                  })
                }
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #dc2626',
                  borderRadius: '6px',
                  fontSize: '14px',
                  background: 'white',
                  fontWeight: 'bold',
                }}
                placeholder="e.g., (07) 3364 6464"
              />
            </div>

            {/* Nearest Medical Centre */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: '#dc2626',
                }}
              >
                Nearest Medical Centre/Hospital
              </label>
              <input
                type="text"
                value={formData.emergencyContacts?.nearestMedical || ''}
                onChange={(e) =>
                  updateFormField('emergencyContacts', {
                    ...formData.emergencyContacts,
                    nearestMedical: e.target.value,
                  })
                }
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #dc2626',
                  borderRadius: '6px',
                  fontSize: '14px',
                  background: 'white',
                }}
                placeholder="e.g., Royal Brisbane Hospital, Butterfield St, Herston"
              />
            </div>

            {/* Medical Contact */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: '#dc2626',
                }}
              >
                Medical Centre Contact
              </label>
              <input
                type="text"
                value={formData.emergencyContacts?.medicalPhone || ''}
                onChange={(e) =>
                  updateFormField('emergencyContacts', {
                    ...formData.emergencyContacts,
                    medicalPhone: e.target.value,
                  })
                }
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #dc2626',
                  borderRadius: '6px',
                  fontSize: '14px',
                  background: 'white',
                  fontWeight: 'bold',
                }}
                placeholder="e.g., (07) 3646 8111"
              />
            </div>

            {/* Dial Before You Dig */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: '#dc2626',
                }}
              >
                Dial Before You Dig
              </label>
              <input
                type="text"
                value="1100"
                readOnly
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #dc2626',
                  borderRadius: '6px',
                  fontSize: '14px',
                  background: '#fef2f2',
                  fontWeight: 'bold',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Job Steps Section */}
      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: 0,
            }}
          >
            <AlertTriangle
              size={20}
              style={{
                display: 'inline',
                marginRight: '8px',
                verticalAlign: 'middle',
                color: '#f59e0b',
              }}
            />
            Job Steps & Risk Assessment
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onOpenTemplateModal}
              style={{
                background: '#3b82f6',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Plus size={16} />
              Add from Template
            </button>
            <button
              onClick={onAddCustomJobStep}
              style={{
                background: '#10b981',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Plus size={16} />
              Add Custom Step
            </button>
          </div>
        </div>

        {formData.jobSteps.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              background: '#f9fafb',
              borderRadius: '8px',
              border: '2px dashed #e5e7eb',
            }}
          >
            <p style={{ color: '#6b7280', marginBottom: '8px' }}>
              No job steps added yet
            </p>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>
              Click "Add from Template" to select pre-built steps or "Add Custom
              Step" to create your own
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {formData.jobSteps.map((step, index) => (
              <div
                key={step.id}
                style={{
                  border: '2px solid #3b82f6',
                  borderRadius: '8px',
                  padding: '16px',
                  background: 'white',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '12px',
                  }}
                >
                  <h5
                    style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      margin: 0,
                    }}
                  >
                    {index + 1}. {step.name}
                  </h5>
                  <button
                    onClick={() => onRemoveJobStep(step.id)}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>

                <div style={{ display: 'grid', gap: '12px' }}>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontWeight: '600',
                        fontSize: '13px',
                        color: '#6b7280',
                      }}
                    >
                      Activity Name
                    </label>
                    <input
                      type="text"
                      value={step.name}
                      onChange={(e) =>
                        onUpdateJobStep(step.id, 'name', e.target.value)
                      }
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '15px',
                        fontWeight: 'bold',
                        color: '#1f2937',
                      }}
                      placeholder="E.g., Excavation Works"
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontWeight: '600',
                        fontSize: '13px',
                        color: '#6b7280',
                      }}
                    >
                      Preparation Required
                    </label>
                    <textarea
                      value={step.preparation}
                      onChange={(e) =>
                        onUpdateJobStep(step.id, 'preparation', e.target.value)
                      }
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '13px',
                        minHeight: '60px',
                        fontFamily: 'inherit',
                        lineHeight: '1.5',
                      }}
                      placeholder="What preparation is needed?"
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontWeight: '600',
                        fontSize: '13px',
                        color: '#6b7280',
                      }}
                    >
                      Identified Hazards
                    </label>
                    <textarea
                      value={step.hazards}
                      onChange={(e) =>
                        onUpdateJobStep(step.id, 'hazards', e.target.value)
                      }
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '13px',
                        minHeight: '60px',
                        fontFamily: 'inherit',
                        lineHeight: '1.5',
                      }}
                      placeholder="List potential hazards"
                    />
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '6px',
                          fontWeight: '600',
                          fontSize: '12px',
                          color: '#6b7280',
                        }}
                      >
                        Initial Risk
                      </label>
                      <select
                        value={step.initialRisk}
                        onChange={(e) =>
                          onUpdateJobStep(
                            step.id,
                            'initialRisk',
                            e.target.value
                          )
                        }
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          color: 'white',
                          background:
                            step.initialRisk === '1'
                              ? '#dc2626'
                              : step.initialRisk === '2'
                              ? '#f97316'
                              : step.initialRisk === '3'
                              ? '#eab308'
                              : '#10b981',
                        }}
                      >
                        <option value="1">1 - Extreme</option>
                        <option value="2">2 - High</option>
                        <option value="3">3 - Medium</option>
                        <option value="4">4 - Low</option>
                      </select>
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '6px',
                          fontWeight: '600',
                          fontSize: '12px',
                          color: '#6b7280',
                        }}
                      >
                        Residual Risk
                      </label>
                      <select
                        value={step.residualRisk}
                        onChange={(e) =>
                          onUpdateJobStep(
                            step.id,
                            'residualRisk',
                            e.target.value
                          )
                        }
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          color: 'white',
                          background:
                            step.residualRisk === '1'
                              ? '#dc2626'
                              : step.residualRisk === '2'
                              ? '#f97316'
                              : step.residualRisk === '3'
                              ? '#eab308'
                              : '#10b981',
                        }}
                      >
                        <option value="1">1 - Extreme</option>
                        <option value="2">2 - High</option>
                        <option value="3">3 - Medium</option>
                        <option value="4">4 - Low</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontWeight: '600',
                        fontSize: '13px',
                        color: '#6b7280',
                      }}
                    >
                      Control Measures
                    </label>
                    <textarea
                      value={step.controls}
                      onChange={(e) =>
                        onUpdateJobStep(step.id, 'controls', e.target.value)
                      }
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '13px',
                        minHeight: '70px',
                        fontFamily: 'inherit',
                        lineHeight: '1.5',
                      }}
                      placeholder="List control measures to mitigate risks"
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontWeight: '600',
                        fontSize: '13px',
                        color: '#6b7280',
                      }}
                    >
                      Responsible Person(s)
                    </label>
                    <input
                      type="text"
                      value={step.responsible}
                      onChange={(e) =>
                        onUpdateJobStep(step.id, 'responsible', e.target.value)
                      }
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '13px',
                      }}
                      placeholder="E.g., Site Supervisor, All Workers"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Worker Sign-Off Section */}
      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: 0,
            }}
          >
            Worker Sign-Off
          </h3>
          <button
            type="button"
            onClick={() => {
              if (formData.id) {
                if (onGenerateQRCode) {
                  onGenerateQRCode();
                }
              } else {
                alert(
                  'Please save the SWMS first before generating a QR code.'
                );
              }
            }}
            style={{
              background: '#8b5cf6',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            📱 Generate QR Code
          </button>
        </div>

        {/* Manual Sign-Off Form */}
        <div
          style={{
            background: '#eff6ff',
            border: '2px solid #3b82f6',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <h4
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#1e40af',
                margin: 0,
              }}
            >
              ✍️ Add Worker Sign-Off (Manual Entry)
            </h4>
            <span
              style={{
                fontSize: '12px',
                color: '#6b7280',
                fontStyle: 'italic',
              }}
            >
              For workers without mobile devices
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '600',
                  fontSize: '13px',
                  color: '#1f2937',
                }}
              >
                Worker Name *
              </label>
              <input
                type="text"
                value={formData.newSignOff?.name || ''}
                onChange={(e) =>
                  updateFormField('newSignOff', {
                    ...formData.newSignOff,
                    name: e.target.value,
                  })
                }
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #3b82f6',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
                placeholder="E.g., John Smith"
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '600',
                  fontSize: '13px',
                  color: '#1f2937',
                }}
              >
                Company
              </label>
              <input
                type="text"
                value={formData.newSignOff?.company || ''}
                onChange={(e) =>
                  updateFormField('newSignOff', {
                    ...formData.newSignOff,
                    company: e.target.value,
                  })
                }
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #3b82f6',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
                placeholder="E.g., ABC Contractors"
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '600',
                  fontSize: '13px',
                  color: '#1f2937',
                }}
              >
                Position *
              </label>
              <input
                type="text"
                value={formData.newSignOff?.position || ''}
                onChange={(e) =>
                  updateFormField('newSignOff', {
                    ...formData.newSignOff,
                    position: e.target.value,
                  })
                }
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #3b82f6',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
                placeholder="E.g., Carpenter"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const newSignOff = formData.newSignOff || {};

              if (!newSignOff.name || !newSignOff.position) {
                alert('Please enter worker name and position');
                return;
              }

              onAddSignOff({
                id: Date.now().toString(),
                name: newSignOff.name,
                company: newSignOff.company || '—',
                position: newSignOff.position,
                date: new Date().toLocaleDateString(),
                method: 'manual',
              });

              // Clear form
              updateFormField('newSignOff', {
                name: '',
                company: '',
                position: '',
              });
            }}
            style={{
              background: '#10b981',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            ✅ Add Worker
          </button>
        </div>

        {/* Existing Sign-Offs Display */}
        {formData.signOffs && formData.signOffs.length > 0 ? (
          <div style={{ display: 'grid', gap: '12px' }}>
            {formData.signOffs.map((signOff, index) => (
              <div
                key={signOff.id}
                style={{
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  background: '#f9fafb',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr auto',
                  gap: '12px',
                  alignItems: 'center',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#6b7280',
                      marginBottom: '4px',
                    }}
                  >
                    Name
                  </label>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>
                    {signOff.name || '—'}
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#6b7280',
                      marginBottom: '4px',
                    }}
                  >
                    Position
                  </label>
                  <div style={{ fontSize: '14px' }}>
                    {signOff.position || '—'}
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#6b7280',
                      marginBottom: '4px',
                    }}
                  >
                    Date Signed
                  </label>
                  <div style={{ fontSize: '14px' }}>{signOff.date || '—'}</div>
                </div>
                <button
                  onClick={() => onRemoveSignOff(signOff.id)}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '32px',
              background: '#f9fafb',
              borderRadius: '8px',
              border: '2px dashed #e5e7eb',
            }}
          >
            <p
              style={{
                color: '#6b7280',
                marginBottom: '8px',
                fontSize: '14px',
              }}
            >
              No workers have signed off yet
            </p>
            <p style={{ color: '#9ca3af', fontSize: '13px' }}>
              Workers can scan the QR code to sign digitally
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '2px solid #e5e7eb',
        }}
      >
        <button
          onClick={onCancel}
          style={{
            background: '#6b7280',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <X size={20} />
          Cancel
        </button>
        <button
          onClick={onSave}
          style={{
            background: '#10b981',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Save size={20} />
          {editingSWMS ? 'Update SWMS' : 'Save SWMS'}
        </button>
      </div>
    </div>
  );
};
