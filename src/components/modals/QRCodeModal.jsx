import React, { useEffect, useRef, useState } from 'react';
import { X, Download, Printer, FileText } from 'lucide-react';
import { useCompany } from '../../contexts/CompanyContext';
import {
  downloadQRPoster,
  downloadQRPosterPNG,
} from '../../utils/qrPosterGenerator';

export const QRCodeModal = ({ show, onClose, swmsId, projectName, swms }) => {
  const qrCodeRef = useRef(null);
  const { company } = useCompany();
  const [qrDataURL, setQrDataURL] = useState(null);

  useEffect(() => {
    if (show && qrCodeRef.current) {
      // Generate QR Code using a library
      const signOffUrl = `${window.location.origin}/sign-off/${swmsId}`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(
        signOffUrl
      )}`;

      qrCodeRef.current.src = qrCodeUrl;
      setQrDataURL(qrCodeUrl);
    }
  }, [show, swmsId]);

  if (!show) return null;

  const signOffUrl = `${window.location.origin}/sign-off/${swmsId}`;

  const handleDownload = () => {
    if (qrCodeRef.current) {
      const link = document.createElement('a');
      link.download = `SWMS_QR_${projectName.replace(/[^a-z0-9]/gi, '_')}.png`;
      link.href = qrCodeRef.current.src;
      link.click();
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>SWMS Sign-Off QR Code</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 40px;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 10px;
              color: #1f2937;
            }
            h2 {
              font-size: 18px;
              margin-bottom: 30px;
              color: #6b7280;
              font-weight: normal;
            }
            img {
              border: 4px solid #3b82f6;
              border-radius: 12px;
              padding: 20px;
              background: white;
            }
            .instructions {
              margin-top: 30px;
              text-align: center;
              max-width: 400px;
            }
            .instructions p {
              margin: 10px 0;
              color: #4b5563;
            }
            .url {
              margin-top: 20px;
              padding: 10px;
              background: #f3f4f6;
              border-radius: 6px;
              font-size: 12px;
              word-break: break-all;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <h1>SWMS Worker Sign-Off</h1>
          <h2>${projectName}</h2>
          <img src="${qrCodeRef.current?.src}" alt="QR Code" />
          <div class="instructions">
            <p><strong>Scan this QR code to sign off on this SWMS document</strong></p>
            <p>Workers can use their mobile phone camera to scan the code</p>
            <div class="url">
              Sign-off URL:<br>
              ${signOffUrl}
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
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
            📱 Scan to Sign Off
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

          <div
            style={{
              background: '#f3f4f6',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#6b7280',
              marginBottom: '24px',
              wordBreak: 'break-all',
            }}
          >
            <strong>Sign-off URL:</strong>
            <br />
            {signOffUrl}
          </div>

          {/* Action Buttons */}
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
              onClick={handlePrint}
              style={{
                background: '#3b82f6',
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
              <Printer size={18} />
              Print
            </button>
          </div>

          {/* Poster Download Section */}
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
              📄 Printable Posters
            </h4>
            <p
              style={{
                color: '#6b7280',
                fontSize: '13px',
                marginBottom: '16px',
              }}
            >
              Professional A4 posters with company branding and instructions
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
              }}
            >
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
                Poster PDF
              </button>
              <button
                onClick={async () => {
                  if (qrDataURL && swms) {
                    await downloadQRPosterPNG(qrDataURL, swms, company);
                  }
                }}
                style={{
                  background: '#f59e0b',
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
                Poster PNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
