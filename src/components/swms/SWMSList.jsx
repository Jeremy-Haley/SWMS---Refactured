import React from 'react';
import { Plus, Eye, Trash2, FileText } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

export const SWMSList = ({
  swmsList,
  onCreateNew,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div>
      <div
        style={{
          background: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1e40af',
              margin: 0,
            }}
          >
            SWMS Documents
          </h2>
          <button
            onClick={onCreateNew}
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
            <Plus size={20} />
            Create New SWMS
          </button>
        </div>

        {swmsList.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              color: '#6b7280',
            }}
          >
            <FileText
              size={64}
              style={{ margin: '0 auto 16px', opacity: 0.3 }}
            />
            <p style={{ fontSize: '18px', marginBottom: '8px' }}>
              No SWMS documents yet
            </p>
            <p style={{ fontSize: '14px' }}>
              Click "Create New SWMS" to get started
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {swmsList.map((swms) => (
              <div
                key={swms.id}
                style={{
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '16px',
                  background: '#f9fafb',
                  transition: 'all 0.2s',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        marginBottom: '8px',
                      }}
                    >
                      {swms.projectName}
                    </h3>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '12px',
                        marginBottom: '12px',
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: '600', color: '#6b7280' }}>
                          Location:
                        </span>{' '}
                        {swms.location}
                      </div>
                      <div>
                        <span style={{ fontWeight: '600', color: '#6b7280' }}>
                          Date:
                        </span>{' '}
                        {formatDate(swms.date)}
                      </div>
                      <div>
                        <span style={{ fontWeight: '600', color: '#6b7280' }}>
                          Supervisor:
                        </span>{' '}
                        {swms.supervisor}
                      </div>
                      <div>
                        <span style={{ fontWeight: '600', color: '#6b7280' }}>
                          Job Steps:
                        </span>{' '}
                        {swms.jobSteps.length}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}
                  >
                    <button
                      onClick={() => onView(swms)}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      title="View SWMS"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button
                      onClick={() => onEdit(swms)}
                      style={{
                        background: '#f59e0b',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      title="Edit SWMS"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(swms.id)}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      title="Delete SWMS"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
