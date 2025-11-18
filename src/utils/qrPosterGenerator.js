import jsPDF from 'jspdf';

/**
 * Generate a professional A4 QR code poster for printing
 * Includes company branding, supervisor contact, instructions, and large QR code
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
  // HEADER - Compact Company Branding
  // ==========================================
  
  // Header background (reduced from 60mm to 45mm)
  doc.setFillColor(rgb.r, rgb.g, rgb.b);
  doc.rect(0, 0, pageWidth, 45, 'F');

  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  const companyName = company?.name || 'SWMS Manager';
  doc.text(companyName, pageWidth / 2, 18, { align: 'center' });

  // Subtitle - combined on one line
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Safe Work Method Statement - Worker Sign-Off', pageWidth / 2, 32, { align: 'center' });

  // ==========================================
  // SUPERVISOR CONTACT INFO - New Section
  // ==========================================
  
  // Contact info box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(rgb.r, rgb.g, rgb.b);
  doc.setLineWidth(0.5);
  doc.rect(15, 52, pageWidth - 30, 20, 'FD');

  doc.setTextColor(rgb.r, rgb.g, rgb.b);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Site Supervisor:', 20, 60);

  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const supervisorName = swms.supervisor || 'Not specified';
  const supervisorPhone = swms.supervisorPhone || swms.company?.contactNumber || 'Contact via site';
  
  doc.text(supervisorName, 20, 66);
  
  // Phone icon and number
  doc.setTextColor(rgb.r, rgb.g, rgb.b);
  doc.setFont('helvetica', 'bold');
  doc.text('Contact:', pageWidth - 85, 60);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text(supervisorPhone, pageWidth - 85, 66);

  // ==========================================
  // PROJECT INFO - Compact
  // ==========================================
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Project:', 20, 85);
  
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(swms.projectName || 'Unnamed Project', 20, 93);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`Location: ${swms.location || 'N/A'}`, 20, 100);
  doc.text(`Date: ${swms.date || 'N/A'}`, 20, 106);

  // ==========================================
  // INSTRUCTIONS - Clean design
  // ==========================================
  
  doc.setFillColor(240, 249, 255); // Light blue background
  doc.rect(15, 115, pageWidth - 30, 48, 'F');
  
  doc.setDrawColor(rgb.r, rgb.g, rgb.b);
  doc.setLineWidth(1);
  doc.rect(15, 115, pageWidth - 30, 48, 'S');

  doc.setTextColor(rgb.r, rgb.g, rgb.b);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('How to Sign Off:', 22, 125);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const instructions = [
    '1. Open your phone camera',
    '2. Point it at the QR code below',
    '3. Tap the notification that appears',
    '4. Fill in your details and submit'
  ];

  instructions.forEach((instruction, index) => {
    doc.text(instruction, 22, 135 + (index * 7));
  });

  // ==========================================
  // QR CODE - Large and centered
  // ==========================================
  
  const qrSize = 125; // Large QR code - 125mm x 125mm
  const qrX = (pageWidth - qrSize) / 2;
  const qrY = 175;

  // QR code background (white)
  doc.setFillColor(255, 255, 255);
  doc.rect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10, 'F');

  // QR code border
  doc.setDrawColor(rgb.r, rgb.g, rgb.b);
  doc.setLineWidth(2.5);
  doc.rect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10, 'S');

  // Add QR code image
  doc.addImage(qrCodeDataURL, 'PNG', qrX, qrY, qrSize, qrSize);

  // "Scan Here" text below QR
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(rgb.r, rgb.g, rgb.b);
  doc.text('SCAN WITH PHONE CAMERA', pageWidth / 2, qrY + qrSize + 12, { align: 'center' });

  // ==========================================
  // FOOTER - Clean and minimal
  // ==========================================
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  
  // Document ID
  const docId = swms.id ? swms.id.substring(0, 8) : 'N/A';
  doc.text(`Document ID: ${docId}`, pageWidth / 2, pageHeight - 12, { align: 'center' });
  
  // Safety message
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38);
  doc.text('All workers must sign off before starting work', pageWidth / 2, pageHeight - 6, { align: 'center' });

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

  // Header background (compact)
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, width, 530);

  // Company name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 105px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(company?.name || 'SWMS Manager', width / 2, 210);

  // Subtitle
  ctx.font = '52px Arial';
  ctx.fillText('Safe Work Method Statement - Worker Sign-Off', width / 2, 380);

  // ==========================================
  // SUPERVISOR CONTACT BOX
  // ==========================================
  
  // Contact box background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(180, 600, width - 360, 240);
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 6;
  ctx.strokeRect(180, 600, width - 360, 240);

  ctx.fillStyle = primaryColor;
  ctx.font = 'bold 52px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Site Supervisor:', 240, 690);

  ctx.fillStyle = '#000000';
  ctx.font = '48px Arial';
  const supervisorName = swms.supervisor || 'Not specified';
  ctx.fillText(supervisorName, 240, 760);

  // Phone number on the right
  ctx.fillStyle = primaryColor;
  ctx.font = 'bold 52px Arial';
  ctx.textAlign = 'right';
  ctx.fillText('Contact:', width - 240, 690);
  
  ctx.fillStyle = '#000000';
  ctx.font = '48px Arial';
  const supervisorPhone = swms.supervisorPhone || swms.company?.contactNumber || 'Contact via site';
  ctx.fillText(supervisorPhone, width - 240, 760);

  // ==========================================
  // PROJECT INFO
  // ==========================================
  
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 65px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Project:', 240, 1000);
  
  ctx.font = 'bold 60px Arial';
  ctx.fillText(swms.projectName || 'Unnamed Project', 240, 1090);
  
  ctx.font = '48px Arial';
  ctx.fillStyle = '#505050';
  ctx.fillText(`Location: ${swms.location || 'N/A'}`, 240, 1160);
  ctx.fillText(`Date: ${swms.date || 'N/A'}`, 240, 1240);

  // ==========================================
  // INSTRUCTIONS
  // ==========================================
  
  ctx.fillStyle = '#f0f9ff';
  ctx.fillRect(180, 1350, width - 360, 560);
  
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 12;
  ctx.strokeRect(180, 1350, width - 360, 560);

  ctx.fillStyle = primaryColor;
  ctx.font = 'bold 65px Arial';
  ctx.fillText('How to Sign Off:', 260, 1470);

  ctx.fillStyle = '#000000';
  ctx.font = '52px Arial';
  const instructions = [
    '1. Open your phone camera',
    '2. Point it at the QR code below',
    '3. Tap the notification that appears',
    '4. Fill in your details and submit'
  ];

  instructions.forEach((instruction, index) => {
    ctx.fillText(instruction, 260, 1600 + (index * 100));
  });

  // ==========================================
  // QR CODE
  // ==========================================
  
  const qrImg = new Image();
  qrImg.src = qrCodeDataURL;
  
  await new Promise((resolve) => {
    qrImg.onload = () => {
      const qrSize = 1450;
      const qrX = (width - qrSize) / 2;
      const qrY = 2050;
      
      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX - 60, qrY - 60, qrSize + 120, qrSize + 120);
      
      // Border
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 30;
      ctx.strokeRect(qrX - 60, qrY - 60, qrSize + 120, qrSize + 120);
      
      // QR code
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      
      // "Scan Here" text
      ctx.fillStyle = primaryColor;
      ctx.font = 'bold 75px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('SCAN WITH PHONE CAMERA', width / 2, qrY + qrSize + 140);
      
      resolve();
    };
  });

  // ==========================================
  // FOOTER
  // ==========================================
  
  ctx.fillStyle = '#787878';
  ctx.font = '42px Arial';
  ctx.textAlign = 'center';
  const docId = swms.id ? swms.id.substring(0, 8) : 'N/A';
  ctx.fillText(`Document ID: ${docId}`, width / 2, height - 140);
  
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 48px Arial';
  ctx.fillText('All workers must sign off before starting work', width / 2, height - 70);

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