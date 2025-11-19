// COMPLETE UPDATED QRCodeModal.jsx
// Replace your entire QRCodeModal.jsx with this

import React, { useEffect, useRef, useState } from 'react';
import { X, Download, FileText } from 'lucide-react';
import { useCompany } from '../../contexts/CompanyContext';
import { downloadQRPoster } from '../../utils/qrPosterGenerator';

export const QRCodeModal = ({ show, onClose, swmsId, projectName, swms }) => {
  const qrCodeRef = useRef(null);
  const { company } = useCompany();
  const [qrDataURL, setQrDataURL] = useState(null);

  useEffect(() => {
    if (show && qrCodeRef.current) {
      // Generate QR Code using a library
      const signOffUrl = `https://swms-refactured.vercel.app/sign-off/${swmsId}`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(
        signOffUrl
      )}`;

      qrCodeRef.current.src = qrCodeUrl;
      setQrDataURL(qrCodeUrl);
    }
  }, [show, swmsId]);

  if (!show) return null;

  const handleDownload = () => {
    if (qrCodeRef.current) {
      const link = document.createElement('a');
      link.download = `SWMS_QR_${projectName.replace(/[^a-z0-9]/gi, '_')}.png`;
      link.href = qrCodeRef.current.src;
      link.click();
    }
  };

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
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          maxWidth: '600px',
          width: '100%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '2px solid #e5e7eb',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
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
                Worker Sign-Off QR Code
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                {projectName}
              </p>
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
        </div>

        {/* Modal Content */}
        <div style={{ padding: '32px', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '24px',
              background: 'white',
              border: '4px solid #3b82f6',
              borderRadius: '12px',
              marginBottom: '24px',
            }}
          >
            <img
              ref={qrCodeRef}
              alt="QR Code for Sign-Off"
              style={{
                width: '300px',
                height: '300px',
                display: 'block',
              }}
            />
          </div>

          <h4
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '12px',
            }}
          >
            Scan to Sign Off
          </h4>
          <p
            style={{
              color: '#6b7280',
              fontSize: '14px',
              marginBottom: '8px',
            }}
          >
            Workers can scan this QR code with their phone camera
          </p>
          <p
            style={{
              color: '#6b7280',
              fontSize: '14px',
              marginBottom: '24px',
            }}
          >
            They'll be able to enter their name, position, and digitally sign
          </p>

          {/* Action Buttons - Symmetrical Layout */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            <button
              onClick={handleDownload}
              style={{
                background: '#10b981',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Download size={18} />
              QR Code Only
            </button>
            <button
              onClick={() => {
                if (qrDataURL && swms) {
                  downloadQRPoster(qrDataURL, swms, company);
                }
              }}
              style={{
                background: '#8b5cf6',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <FileText size={18} />
              PDF
            </button>
          </div>

          {/* Info Section */}
          <div
            style={{
              borderTop: '2px dashed #e5e7eb',
              paddingTop: '24px',
            }}
          >
            <h4
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '12px',
              }}
            >
              Print QR Code
            </h4>
            <p
              style={{
                color: '#6b7280',
                fontSize: '13px',
                marginBottom: '0',
              }}
            >
              Print QR code with instructions for easy site posting
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};