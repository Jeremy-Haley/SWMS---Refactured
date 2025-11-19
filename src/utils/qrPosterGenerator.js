import jsPDF from 'jspdf';

/**
 * Generate a professional A4 QR code poster for printing
 * Final version with all improvements
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
  // HEADER - Compact (reduced from 45mm to 35mm)
  // ==========================================
  
  doc.setFillColor(rgb.r, rgb.g, rgb.b);
  doc.rect(0, 0, pageWidth, 35, 'F');

  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  const companyName = company?.name || 'SWMS Manager';
  doc.text(companyName, pageWidth / 2, 15, { align: 'center' });

  // Subtitle - single line
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Safe Work Method Statement - Worker Sign-Off', pageWidth / 2, 26, { align: 'center' });

  // ==========================================
  // SUPERVISOR CONTACT - Compact box
  // ==========================================
  
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(rgb.r, rgb.g, rgb.b);
  doc.setLineWidth(0.5);
  doc.rect(15, 42, pageWidth - 30, 18, 'FD');

  doc.setTextColor(rgb.r, rgb.g, rgb.b);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Site Supervisor:', 20, 49);

  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const supervisorName = swms.supervisor || 'Not specified';
  const supervisorPhone = swms.supervisorPhone || swms.company?.contactNumber || 'Contact via site';
  
  doc.text(supervisorName, 20, 54);
  
  doc.setTextColor(rgb.r, rgb.g, rgb.b);
  doc.setFont('helvetica', 'bold');
  doc.text('Contact:', pageWidth - 70, 49);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text(supervisorPhone, pageWidth - 70, 54);

  // ==========================================
  // PROJECT INFO - Very compact
  // ==========================================
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Project:', 20, 73);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(swms.projectName || 'Unnamed Project', 20, 80);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`Location: ${swms.location || 'N/A'}`, 20, 86);
  doc.text(`Date: ${swms.date || 'N/A'}`, 20, 91);

  // ==========================================
  // INSTRUCTIONS - Smaller box (reduced from 48mm to 38mm)
  // ==========================================
  
  doc.setFillColor(240, 249, 255);
  doc.rect(15, 98, pageWidth - 30, 38, 'F');
  
  doc.setDrawColor(rgb.r, rgb.g, rgb.b);
  doc.setLineWidth(1);
  doc.rect(15, 98, pageWidth - 30, 38, 'S');

  doc.setTextColor(rgb.r, rgb.g, rgb.b);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('How to Sign Off:', 22, 107);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const instructions = [
    '1. Open your phone camera',
    '2. Point it at the QR code below',
    '3. Tap the notification that appears',
    '4. Fill in your details and submit'
  ];

  instructions.forEach((instruction, index) => {
    doc.text(instruction, 22, 116 + (index * 6));
  });

  // ==========================================
  // QR CODE - Centered with space at bottom
  // ==========================================
  
  const qrSize = 115; // Slightly smaller QR code
  const qrX = (pageWidth - qrSize) / 2;
  const qrY = 148; // Positioned to leave space at bottom

  // QR code background (white)
  doc.setFillColor(255, 255, 255);
  doc.rect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10, 'F');

  // QR code border
  doc.setDrawColor(rgb.r, rgb.g, rgb.b);
  doc.setLineWidth(2.5);
  doc.rect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10, 'S');

  // Add QR code image
  doc.addImage(qrCodeDataURL, 'PNG', qrX, qrY, qrSize, qrSize);

  // "Scan Here" text
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(rgb.r, rgb.g, rgb.b);
  doc.text('SCAN WITH PHONE CAMERA', pageWidth / 2, qrY + qrSize + 10, { align: 'center' });

  // ==========================================
  // FOOTER - Larger, more readable
  // ==========================================
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  
  // Document ID
  const docId = swms.id ? swms.id.substring(0, 8) : 'N/A';
  doc.text(`Document ID: ${docId}`, pageWidth / 2, pageHeight - 18, { align: 'center' });
  
  // Safety message - LARGER and more prominent
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38);
  doc.text('All workers must sign off before starting work', pageWidth / 2, pageHeight - 10, { align: 'center' });

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
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // A4 dimensions at 300 DPI
  const width = 2480;
  const height = 3508;
  
  canvas.width = width;
  canvas.height = height;

  const primaryColor = company?.color || '#1e40af';
  
  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Header background (compact - 410px instead of 530px)
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, width, 410);

  // Company name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 90px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(company?.name || 'SWMS Manager', width / 2, 180);

  // Subtitle
  ctx.font = '45px Arial';
  ctx.fillText('Safe Work Method Statement - Worker Sign-Off', width / 2, 300);

  // ==========================================
  // SUPERVISOR CONTACT BOX - Compact
  // ==========================================
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(180, 490, width - 360, 210);
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 6;
  ctx.strokeRect(180, 490, width - 360, 210);

  ctx.fillStyle = primaryColor;
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Site Supervisor:', 240, 560);

  ctx.fillStyle = '#000000';
  ctx.font = '42px Arial';
  const supervisorName = swms.supervisor || 'Not specified';
  ctx.fillText(supervisorName, 240, 630);

  ctx.fillStyle = primaryColor;
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'right';
  ctx.fillText('Contact:', width - 240, 560);
  
  ctx.fillStyle = '#000000';
  ctx.font = '42px Arial';
  const supervisorPhone = swms.supervisorPhone || swms.company?.contactNumber || 'Contact via site';
  ctx.fillText(supervisorPhone, width - 240, 630);

  // ==========================================
  // PROJECT INFO - Compact
  // ==========================================
  
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 56px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Project:', 240, 860);
  
  ctx.font = 'bold 52px Arial';
  ctx.fillText(swms.projectName || 'Unnamed Project', 240, 940);
  
  ctx.font = '42px Arial';
  ctx.fillStyle = '#505050';
  ctx.fillText(`Location: ${swms.location || 'N/A'}`, 240, 1000);
  ctx.fillText(`Date: ${swms.date || 'N/A'}`, 240, 1060);

  // ==========================================
  // INSTRUCTIONS - Smaller box
  // ==========================================
  
  ctx.fillStyle = '#f0f9ff';
  ctx.fillRect(180, 1150, width - 360, 445);
  
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 12;
  ctx.strokeRect(180, 1150, width - 360, 445);

  ctx.fillStyle = primaryColor;
  ctx.font = 'bold 56px Arial';
  ctx.fillText('How to Sign Off:', 260, 1250);

  ctx.fillStyle = '#000000';
  ctx.font = '48px Arial';
  const instructions = [
    '1. Open your phone camera',
    '2. Point it at the QR code below',
    '3. Tap the notification that appears',
    '4. Fill in your details and submit'
  ];

  instructions.forEach((instruction, index) => {
    ctx.fillText(instruction, 260, 1350 + (index * 70));
  });

  // ==========================================
  // QR CODE - Centered with bottom space
  // ==========================================
  
  const qrImg = new Image();
  qrImg.src = qrCodeDataURL;
  
  await new Promise((resolve) => {
    qrImg.onload = () => {
      const qrSize = 1340; // Slightly smaller
      const qrX = (width - qrSize) / 2;
      const qrY = 1730; // Positioned to leave space at bottom
      
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
      ctx.font = 'bold 65px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('SCAN WITH PHONE CAMERA', width / 2, qrY + qrSize + 120);
      
      resolve();
    };
  });

  // ==========================================
  // FOOTER - Larger and more prominent
  // ==========================================
  
  ctx.fillStyle = '#787878';
  ctx.font = '38px Arial';
  ctx.textAlign = 'center';
  const docId = swms.id ? swms.id.substring(0, 8) : 'N/A';
  ctx.fillText(`Document ID: ${docId}`, width / 2, height - 210);
  
  // Safety message - MUCH LARGER
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 52px Arial';
  ctx.fillText('All workers must sign off before starting work', width / 2, height - 120);

  return canvas.toDataURL('image/png');
};

/**
 * Download QR poster as PNG
 */
export const downloadQRPosterPNG = async (qrCodeDataURL, swms, company) => {
  const pngDataURL = await generateQRPosterPNG(qrCodeDataURL, swms, company);
  
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
  } : { r: 30, g: 64, b: 175 };
}