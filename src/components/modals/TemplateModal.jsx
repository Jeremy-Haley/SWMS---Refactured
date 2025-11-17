import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { jobStepTemplates } from '../../data/jobStepTemplates';
import { getRiskColor, getRiskLabel } from '../../utils/helpers';

export const TemplateModal = ({
  show,
  onClose,
  onAddTemplate,
  onAddMultipleTemplates,
  addedTemplateNames,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplates, setSelectedTemplates] = useState([]);

  const filteredTemplates = useMemo(() => {
    return Object.entries(jobStepTemplates).filter(([key, template]) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        template.name.toLowerCase().includes(searchLower) ||
        template.category.toLowerCase().includes(searchLower) ||
        template.hazards.toLowerCase().includes(searchLower)
      );
    });
  }, [searchTerm]);

  const templatesByCategory = useMemo(() => {
    return filteredTemplates.reduce((acc, [key, template]) => {
      if (!acc[template.category]) {
        acc[template.category] = [];
      }
      acc[template.category].push([key, template]);
      return acc;
    }, {});
  }, [filteredTemplates]);

  const isTemplateAdded = (templateName) => {
    return addedTemplateNames.includes(templateName);
  };

  const isTemplateSelected = (templateKey) => {
    return selectedTemplates.includes(templateKey);
  };

  const toggleTemplateSelection = (templateKey) => {
    const template = jobStepTemplates[templateKey];
    // Don't allow selecting already added templates
    if (isTemplateAdded(template.name)) return;

    if (selectedTemplates.includes(templateKey)) {
      setSelectedTemplates(selectedTemplates.filter((key) => key !== templateKey));
    } else {
      setSelectedTemplates([...selectedTemplates, templateKey]);
    }
  };

  const handleAddSelectedTemplates = () => {
    const templatesArray = selectedTemplates
      .map((templateKey) => ({
        templateKey,
        template: jobStepTemplates[templateKey],
      }))
      .filter((item) => !isTemplateAdded(item.template.name));

    if (templatesArray.length > 0) {
      onAddMultipleTemplates(templatesArray);
    }
    
    setSelectedTemplates([]);
    setSearchTerm('');
  };

  const handleClose = () => {
    setSearchTerm('');
    setSelectedTemplates([]);
    onClose();
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        zIndex: 1000,
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          maxWidth: '1200px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '2px solid #e5e7eb',
            flexShrink: 0,
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
            <div>
              <h3
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1e40af',
                  marginBottom: '8px',
                }}
              >
                Select Job Step Templates
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Click templates to select multiple, then add them all at once
                {selectedTemplates.length > 0 && (
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>
                    {' '}
                    • {selectedTemplates.length} selected
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={handleClose}
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

          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <Search
              size={20}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6b7280',
              }}
            />
            <input
              type="text"
              placeholder="Search templates by name, category, or hazard..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 44px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            />
          </div>
        </div>

        {/* Modal Content - Scrollable */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {Object.keys(templatesByCategory).length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px',
                color: '#6b7280',
              }}
            >
              <p>No templates found matching "{searchTerm}"</p>
            </div>
          ) : (
            Object.entries(templatesByCategory).map(([category, templates]) => (
              <div key={category} style={{ marginBottom: '32px' }}>
                <h4
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#1e40af',
                    marginBottom: '16px',
                  }}
                >
                  {category}
                </h4>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {templates.map(([key, template]) => {
                    const added = isTemplateAdded(template.name);
                    const selected = isTemplateSelected(key);
                    return (
                      <button
                        key={key}
                        onClick={() => !added && toggleTemplateSelection(key)}
                        disabled={added}
                        style={{
                          textAlign: 'left',
                          padding: '16px',
                          border: added
                            ? '2px solid #10b981'
                            : selected
                            ? '3px solid #3b82f6'
                            : '2px solid #3b82f6',
                          borderRadius: '8px',
                          background: added 
                            ? '#d1fae5' 
                            : selected
                            ? '#dbeafe'
                            : 'white',
                          cursor: added ? 'not-allowed' : 'pointer',
                          opacity: added ? 0.6 : 1,
                          transition: 'all 0.2s',
                          transform: selected ? 'scale(0.98)' : 'scale(1)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                            marginBottom: '8px',
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
                            {template.name}
                          </h5>
                          {added && (
                            <span
                              style={{
                                background: '#10b981',
                                color: 'white',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                              }}
                            >
                              Added ✓
                            </span>
                          )}
                          {!added && selected && (
                            <span
                              style={{
                                background: '#3b82f6',
                                color: 'white',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                              }}
                            >
                              Selected ✓
                            </span>
                          )}
                        </div>
                        <p
                          style={{
                            fontSize: '13px',
                            color: '#6b7280',
                            marginBottom: '8px',
                          }}
                        >
                          <strong>Prep:</strong> {template.preparation}
                        </p>
                        <p
                          style={{
                            fontSize: '13px',
                            color: '#6b7280',
                            marginBottom: '12px',
                          }}
                        >
                          <strong>Hazards:</strong>{' '}
                          {template.hazards.substring(0, 80)}...
                        </p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 'bold',
                              color: 'white',
                            }}
                            className={getRiskColor(template.initialRisk)}
                          >
                            Initial: {getRiskLabel(template.initialRisk)}
                          </span>
                          <span
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 'bold',
                              color: 'white',
                            }}
                            className={getRiskColor(template.residualRisk)}
                          >
                            Residual: {getRiskLabel(template.residualRisk)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '24px',
            borderTop: '2px solid #e5e7eb',
            background: '#f9fafb',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleClose}
              style={{
                flex: 1,
                background: '#6b7280',
                color: 'white',
                padding: '12px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleAddSelectedTemplates}
              disabled={selectedTemplates.length === 0}
              style={{
                flex: 2,
                background:
                  selectedTemplates.length === 0 ? '#9ca3af' : '#10b981',
                color: 'white',
                padding: '12px',
                borderRadius: '6px',
                border: 'none',
                cursor:
                  selectedTemplates.length === 0 ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                opacity: selectedTemplates.length === 0 ? 0.5 : 1,
              }}
            >
              Add {selectedTemplates.length > 0 ? selectedTemplates.length : ''}{' '}
              Selected Template{selectedTemplates.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
