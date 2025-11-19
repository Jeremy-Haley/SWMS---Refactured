import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, QrCode } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { useCompany } from '../../contexts/CompanyContext';
import { downloadSWMSPDF } from '../../utils/pdfGenerator.js';

export const SWMSViewer = ({ swms, onBack, onEdit, onGenerateQRCode }) => {
  const [signOffs, setSignOffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { company } = useCompany();

  useEffect(() => {
    loadSignOffs();
  }, [swms.id]);

  const loadSignOffs = async () => {
    try {
      const { data, error } = await supabase
        .from('swms_signoffs')
        .select('*')
        .eq('swms_id', swms.id)
        .order('signed_at', { ascending: false });

      if (error) throw error;
      setSignOffs(data || []);
    } catch (error) {
      console.error('Error loading sign-offs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      await downloadSWMSPDF(swms, company, signOffs);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case '1':
        return '#dc2626'; // Red - Extreme
      case '2':
        return '#f97316'; // Orange - High
      case '3':
        return '#eab308'; // Yellow - Medium
      case '4':
        return '#10b981'; // Green - Low
      default:
        return '#6b7280';
    }
  };

  const getRiskLabel = (risk) => {
    switch (risk) {
      case '1':
        return 'Extreme';
      case '2':
        return 'High';
      case '3':
        return 'Medium';
      case '4':
        return 'Low';
      default:
        return 'Unknown';
    }
  };

  return (
    <div>
      {/* Action Bar - Hidden when printing */}
      <div
        className="no-print"
        style={{
          background: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: '#6b7280',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <ArrowLeft size={20} />
          Back to List
        </button>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleDownloadPDF}
            style={{
              background: '#10b981',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Download size={20} />
            Download PDF
          </button>

          <button
            onClick={() => onGenerateQRCode && onGenerateQRCode()}
            style={{
              background: '#8b5cf6',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <QrCode size={20} />
            QR Code
          </button>

          <button
            onClick={onEdit}
            style={{
              background: '#3b82f6',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            Edit
          </button>
        </div>
      </div>

      {/* SWMS Document - Print friendly */}
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: '#1e40af',
            color: 'white',
            padding: '32px',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: '8px',
            }}
          >
            Safe Work Method Statement
          </h1>
          <div style={{ fontSize: '18px', opacity: 0.9 }}>
            {swms.company?.orgName || 'Company Name'}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          {/* Project Details */}
          <section style={{ marginBottom: '32px' }}>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '16px',
                borderBottom: '3px solid #3b82f6',
                paddingBottom: '8px',
              }}
            >
              Project Details
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                background: '#f9fafb',
                padding: '20px',
                borderRadius: '8px',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    marginBottom: '4px',
                    fontWeight: '600',
                  }}
                >
                  Project Name
                </div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  {swms.projectName}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    marginBottom: '4px',
                    fontWeight: '600',
                  }}
                >
                  Location
                </div>
                <div style={{ fontSize: '16px' }}>{swms.location}</div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    marginBottom: '4px',
                    fontWeight: '600',
                  }}
                >
                  Date
                </div>
                <div style={{ fontSize: '16px' }}>{swms.date}</div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      fontWeight: '600',
                    }}
                  >
                    Supervisor
                  </div>
                  {swms.supervisorPhone && (
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        fontWeight: '600',
                      }}
                    >
                      Contact
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '16px' }}>{swms.supervisor}</div>
                  {swms.supervisorPhone && (
                    <div style={{ fontSize: '16px', color: '#000000' }}>
                      {swms.supervisorPhone}
                    </div>
                  )}
                </div>
              </div>            </div>
          </section>

          {/* Company Details */}
          <section style={{ marginBottom: '32px' }}>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '16px',
                borderBottom: '3px solid #3b82f6',
                paddingBottom: '8px',
              }}
            >
              Company Details
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                background: '#f9fafb',
                padding: '20px',
                borderRadius: '8px',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    marginBottom: '4px',
                    fontWeight: '600',
                  }}
                >
                  Organization
                </div>
                <div style={{ fontSize: '16px' }}>
                  {swms.company?.orgName || '—'}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    marginBottom: '4px',
                    fontWeight: '600',
                  }}
                >
                  ACN/ABN
                </div>
                <div style={{ fontSize: '16px' }}>
                  {swms.company?.acnAbn || '—'}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    marginBottom: '4px',
                    fontWeight: '600',
                  }}
                >
                  Contact Name
                </div>
                <div style={{ fontSize: '16px' }}>
                  {swms.company?.contactName || '—'}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    marginBottom: '4px',
                    fontWeight: '600',
                  }}
                >
                  Contact Number
                </div>
                <div style={{ fontSize: '16px' }}>
                  {swms.company?.contactNumber || '—'}
                </div>
              </div>
              {swms.company?.preparedBy && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      marginBottom: '4px',
                      fontWeight: '600',
                    }}
                  >
                    Document Prepared By
                  </div>
                  <div style={{ fontSize: '16px' }}>
                    {swms.company.preparedBy}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Emergency Contacts */}
          {swms.emergencyContacts && (
            <section style={{ marginBottom: '32px' }}>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#dc2626',
                  marginBottom: '16px',
                  borderBottom: '3px solid #dc2626',
                  paddingBottom: '8px',
                }}
              >
                🚨 Emergency Contacts
              </h2>

              {/* Emergency 000 */}
              <div
                style={{
                  background: '#dc2626',
                  color: 'white',
                  padding: '20px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  marginBottom: '16px',
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: '600' }}>
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

              {/* Location-based services in red box - exactly like form */}
              <div
                style={{
                  background: '#fee2e2',
                  border: '2px solid #dc2626',
                  borderRadius: '8px',
                  padding: '16px',
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
                    <div
                      style={{
                        fontSize: '14px',
                        color: '#dc2626',
                        marginBottom: '6px',
                        fontWeight: '600',
                      }}
                    >
                      Nearest Police Station
                    </div>
                    <div
                      style={{
                        padding: '10px',
                        background: 'white',
                        border: '2px solid #dc2626',
                        borderRadius: '6px',
                        fontSize: '14px',
                        minHeight: '44px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {swms.emergencyContacts.nearestPolice || '—'}
                    </div>
                  </div>

                  {/* Police Contact Number */}
                  <div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: '#dc2626',
                        marginBottom: '6px',
                        fontWeight: '600',
                      }}
                    >
                      Police Contact Number
                    </div>
                    <div
                      style={{
                        padding: '10px',
                        background: 'white',
                        border: '2px solid #dc2626',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        minHeight: '44px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {swms.emergencyContacts.policePhone || '—'}
                    </div>
                  </div>

                  {/* Nearest Medical Centre/Hospital */}
                  <div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: '#dc2626',
                        marginBottom: '6px',
                        fontWeight: '600',
                      }}
                    >
                      Nearest Medical Centre/Hospital
                    </div>
                    <div
                      style={{
                        padding: '10px',
                        background: 'white',
                        border: '2px solid #dc2626',
                        borderRadius: '6px',
                        fontSize: '14px',
                        minHeight: '44px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {swms.emergencyContacts.nearestMedical || '—'}
                    </div>
                  </div>

                  {/* Medical Centre Contact */}
                  <div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: '#dc2626',
                        marginBottom: '6px',
                        fontWeight: '600',
                      }}
                    >
                      Medical Centre Contact
                    </div>
                    <div
                      style={{
                        padding: '10px',
                        background: 'white',
                        border: '2px solid #dc2626',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        minHeight: '44px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {swms.emergencyContacts.medicalPhone || '—'}
                    </div>
                  </div>

                  {/* Dial Before You Dig */}
                  <div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: '#dc2626',
                        marginBottom: '6px',
                        fontWeight: '600',
                      }}
                    >
                      Dial Before You Dig
                    </div>
                    <div
                      style={{
                        padding: '10px',
                        background: '#fef2f2',
                        border: '2px solid #dc2626',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        minHeight: '44px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      1100
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Job Steps */}
          <section style={{ marginBottom: '32px' }}>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '16px',
                borderBottom: '3px solid #3b82f6',
                paddingBottom: '8px',
              }}
            >
              Job Steps & Risk Assessment
            </h2>

            {swms.jobSteps && swms.jobSteps.length > 0 ? (
              <div style={{ display: 'grid', gap: '20px' }}>
                {swms.jobSteps.map((step, index) => (
                  <div
                    key={step.id}
                    style={{
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '20px',
                      pageBreakInside: 'avoid',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '16px',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            marginBottom: '4px',
                          }}
                        >
                          Step {index + 1}
                        </div>
                        <h3
                          style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: '#1f2937',
                          }}
                        >
                          {step.name}
                        </h3>
                      </div>

                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '11px',
                              color: '#6b7280',
                              marginBottom: '4px',
                            }}
                          >
                            Initial Risk
                          </div>
                          <div
                            style={{
                              background: getRiskColor(step.initialRisk),
                              color: 'white',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontWeight: 'bold',
                              fontSize: '12px',
                            }}
                          >
                            {getRiskLabel(step.initialRisk)}
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '11px',
                              color: '#6b7280',
                              marginBottom: '4px',
                            }}
                          >
                            Residual Risk
                          </div>
                          <div
                            style={{
                              background: getRiskColor(step.residualRisk),
                              color: 'white',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontWeight: 'bold',
                              fontSize: '12px',
                            }}
                          >
                            {getRiskLabel(step.residualRisk)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gap: '12px' }}>
                      {step.preparation && (
                        <div>
                          <div
                            style={{
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#6b7280',
                              marginBottom: '4px',
                            }}
                          >
                            Preparation
                          </div>
                          <div
                            style={{
                              fontSize: '14px',
                              lineHeight: '1.6',
                              whiteSpace: 'pre-wrap',
                            }}
                          >
                            {step.preparation}
                          </div>
                        </div>
                      )}

                      <div>
                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#6b7280',
                            marginBottom: '4px',
                          }}
                        >
                          Hazards
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            lineHeight: '1.6',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {step.hazards || '—'}
                        </div>
                      </div>

                      <div>
                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#6b7280',
                            marginBottom: '4px',
                          }}
                        >
                          Control Measures
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            lineHeight: '1.6',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {step.controls || '—'}
                        </div>
                      </div>

                      {step.responsible && (
                        <div>
                          <div
                            style={{
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#6b7280',
                              marginBottom: '4px',
                            }}
                          >
                            Responsible Person(s)
                          </div>
                          <div style={{ fontSize: '14px' }}>
                            {step.responsible}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#6b7280',
                }}
              >
                No job steps defined
              </div>
            )}
          </section>

          {/* Worker Sign-Offs */}
          <section style={{ marginBottom: '32px' }}>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '16px',
                borderBottom: '3px solid #3b82f6',
                paddingBottom: '8px',
              }}
            >
              Worker Sign-Offs
            </h2>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                Loading sign-offs...
              </div>
            ) : signOffs.length > 0 ? (
              <div
                style={{
                  background: '#f9fafb',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#3b82f6', color: 'white' }}>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: '600',
                        }}
                      >
                        Name
                      </th>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: '600',
                        }}
                      >
                        Company
                      </th>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: '600',
                        }}
                      >
                        Position
                      </th>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: '600',
                        }}
                      >
                        Signed At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {signOffs.map((signOff, index) => (
                      <tr
                        key={signOff.id}
                        style={{
                          borderBottom: '1px solid #e5e7eb',
                          background: index % 2 === 0 ? 'white' : '#f9fafb',
                        }}
                      >
                        <td style={{ padding: '12px', fontWeight: '600' }}>
                          {signOff.worker_name}
                        </td>
                        <td style={{ padding: '12px' }}>
                          {signOff.worker_company || '—'}
                        </td>
                        <td style={{ padding: '12px' }}>
                          {signOff.worker_position || '—'}
                        </td>
                        <td style={{ padding: '12px' }}>
                          {new Date(signOff.signed_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  border: '2px dashed #e5e7eb',
                }}
              >
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  No workers have signed off yet
                </p>
              </div>
            )}
          </section>

          {/* Footer */}
          <div
            style={{
              marginTop: '40px',
              paddingTop: '20px',
              borderTop: '2px solid #e5e7eb',
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '12px',
            }}
          >
            <p>
              This SWMS was generated on {new Date().toLocaleDateString()} at{' '}
              {new Date().toLocaleTimeString()}
            </p>
            <p style={{ marginTop: '8px' }}>Document ID: {swms.id}</p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
};
