import jsPDF from 'jspdf';

/**
 * Generate a professional A4 QR code poster for printing
 * Includes company branding, instructions, and large QR code
 */
export const generateQRPoster = (qrCodeDataURL, swms, company) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  
  // Company color or default blue
  const primaryColor = company?.color || '#1e40af';
  const rgb = hexToRgb(primaryColor);

  // ==========================================
  // HEADER - Company Branding
  // ==========================================
  
  // Header background
  doc.setFillColor(rgb.r, rgb.g, rgb.b);
  doc.rect(0, 0, pageWidth, 60, 'F');

  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  const companyName = company?.name || 'SWMS Manager';
  doc.text(companyName, pageWidth / 2, 25, { align: 'center' });

  // Subtitle
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('Safe Work Method Statement', pageWidth / 2, 40, { align: 'center' });
  doc.text('Worker Sign-Off', pageWidth / 2, 52, { align: 'center' });

  // ==========================================
  // PROJECT INFO
  // ==========================================
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Project:', 20, 80);
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text(swms.projectName || 'Unnamed Project', 20, 90);

  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text(`Location: ${swms.location || 'N/A'}`, 20, 100);
  doc.text(`Date: ${swms.date || 'N/A'}`, 20, 108);

  // ==========================================
  // INSTRUCTIONS
  // ==========================================
  
  doc.setFillColor(240, 249, 255); // Light blue background
  doc.rect(20, 120, pageWidth - 40, 50, 'F');
  
  doc.setDrawColor(rgb.r, rgb.g, rgb.b);
  doc.setLineWidth(1);
  doc.rect(20, 120, pageWidth - 40, 50, 'S');

  doc.setTextColor(rgb.r, rgb.g, rgb.b);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('📱 How to Sign Off:', 30, 132);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  const instructions = [
    '1. Open your phone camera',
    '2. Point it at the QR code below',
    '3. Tap the notification that appears',
    '4. Fill in your details and submit'
  ];

  instructions.forEach((instruction, index) => {
    doc.text(instruction, 30, 145 + (index * 8));
  });

  // ==========================================
  // QR CODE - Large and centered
  // ==========================================
  
  const qrSize = 120; // Large QR code - 120mm x 120mm
  const qrX = (pageWidth - qrSize) / 2;
  const qrY = 185;

  // QR code background (white)
  doc.setFillColor(255, 255, 255);
  doc.rect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10, 'F');

  // QR code border
  doc.setDrawColor(rgb.r, rgb.g, rgb.b);
  doc.setLineWidth(2);
  doc.rect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10, 'S');

  // Add QR code image
  doc.addImage(qrCodeDataURL, 'PNG', qrX, qrY, qrSize, qrSize);

  // "Scan Here" text
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(rgb.r, rgb.g, rgb.b);
  doc.text('👆 SCAN HERE', pageWidth / 2, qrY + qrSize + 15, { align: 'center' });

  // ==========================================
  // FOOTER
  // ==========================================
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  
  // Document ID
  const docId = swms.id ? swms.id.substring(0, 8) : 'N/A';
  doc.text(`Document ID: ${docId}`, pageWidth / 2, pageHeight - 15, { align: 'center' });
  
  // Safety message
  doc.setFontSize(9);
  doc.setTextColor(200, 50, 50);
  doc.text('⚠️ All workers must sign off before starting work', pageWidth / 2, pageHeight - 10, { align: 'center' });

  return doc;
};

/**
 * Download QR poster as PDF
 */
export const downloadQRPoster = (qrCodeDataURL, swms, company) => {
  const doc = generateQRPoster(qrCodeDataURL, swms, company);
  const fileName = `QR_SignOff_${swms.projectName?.replace(/[^a-z0-9]/gi, '_') || 'SWMS'}.pdf`;
  doc.save(fileName);
};

/**
 * Generate QR poster as PNG image
 */
export const generateQRPosterPNG = async (qrCodeDataURL, swms, company) => {
  // Create a canvas for the poster
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // A4 dimensions at 300 DPI (high quality)
  const width = 2480; // 210mm * 300dpi / 25.4
  const height = 3508; // 297mm * 300dpi / 25.4
  
  canvas.width = width;
  canvas.height = height;

  const primaryColor = company?.color || '#1e40af';
  
  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Header background
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, width, 700);

  // Company name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 120px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(company?.name || 'SWMS Manager', width / 2, 280);

  // Subtitle
  ctx.font = '60px Arial';
  ctx.fillText('Safe Work Method Statement', width / 2, 450);
  ctx.fillText('Worker Sign-Off', width / 2, 600);

  // Project info
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 70px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Project:', 200, 950);
  
  ctx.font = '60px Arial';
  ctx.fillText(swms.projectName || 'Unnamed Project', 200, 1050);
  
  ctx.font = '50px Arial';
  ctx.fillStyle = '#666666';
  ctx.fillText(`Location: ${swms.location || 'N/A'}`, 200, 1150);
  ctx.fillText(`Date: ${swms.date || 'N/A'}`, 200, 1220);

  // Instructions background
  ctx.fillStyle = '#f0f9ff';
  ctx.fillRect(200, 1350, width - 400, 550);
  
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 10;
  ctx.strokeRect(200, 1350, width - 400, 550);

  // Instructions
  ctx.fillStyle = primaryColor;
  ctx.font = 'bold 60px Arial';
  ctx.fillText('📱 How to Sign Off:', 280, 1450);

  ctx.fillStyle = '#000000';
  ctx.font = '48px Arial';
  const instructions = [
    '1. Open your phone camera',
    '2. Point it at the QR code below',
    '3. Tap the notification that appears',
    '4. Fill in your details and submit'
  ];

  instructions.forEach((instruction, index) => {
    ctx.fillText(instruction, 280, 1580 + (index * 100));
  });

  // QR code
  const qrImg = new Image();
  qrImg.src = qrCodeDataURL;
  
  await new Promise((resolve) => {
    qrImg.onload = () => {
      const qrSize = 1400;
      const qrX = (width - qrSize) / 2;
      const qrY = 2100;
      
      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX - 50, qrY - 50, qrSize + 100, qrSize + 100);
      
      // Border
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 20;
      ctx.strokeRect(qrX - 50, qrY - 50, qrSize + 100, qrSize + 100);
      
      // QR code
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      
      // "Scan Here" text
      ctx.fillStyle = primaryColor;
      ctx.font = 'bold 70px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('👆 SCAN HERE', width / 2, qrY + qrSize + 150);
      
      resolve();
    };
  });

  // Footer
  ctx.fillStyle = '#666666';
  ctx.font = '40px Arial';
  ctx.textAlign = 'center';
  const docId = swms.id ? swms.id.substring(0, 8) : 'N/A';
  ctx.fillText(`Document ID: ${docId}`, width / 2, height - 150);
  
  ctx.fillStyle = '#cc0000';
  ctx.font = '36px Arial';
  ctx.fillText('⚠️ All workers must sign off before starting work', width / 2, height - 80);

  return canvas.toDataURL('image/png');
};

/**
 * Download QR poster as PNG
 */
export const downloadQRPosterPNG = async (qrCodeDataURL, swms, company) => {
  const pngDataURL = await generateQRPosterPNG(qrCodeDataURL, swms, company);
  
  // Create download link
  const link = document.createElement('a');
  link.href = pngDataURL;
  link.download = `QR_SignOff_${swms.projectName?.replace(/[^a-z0-9]/gi, '_') || 'SWMS'}.png`;
  link.click();
};

/**
 * Helper function to convert hex color to RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 30, g: 64, b: 175 }; // Default blue
}
