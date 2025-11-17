import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateSWMSPDF = (swms, company, signOffs = []) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace) => {
    if (yPos + requiredSpace > pageHeight - 20) {
      doc.addPage();
      yPos = 20;
      return true;
    }
    return false;
  };

  // ==========================================
  // HEADER - Company Branding
  // ==========================================

  // Blue header background
  doc.setFillColor(30, 64, 175); // #1e40af
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Company name in white
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(company?.name || 'SWMS Manager', pageWidth / 2, 15, {
    align: 'center',
  });

  // Subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Safe Work Method Statement', pageWidth / 2, 25, {
    align: 'center',
  });

  doc.setTextColor(0, 0, 0);
  yPos = 50;

  // ==========================================
  // PROJECT DETAILS
  // ==========================================

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('Project Details', 15, yPos);
  yPos += 8;

  // Reset to black for content
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  // Project details table
  doc.autoTable({
    startY: yPos,
    head: [['Field', 'Information']],
    body: [
      ['Project Name', swms.projectName || '—'],
      ['Location', swms.location || '—'],
      ['Date', swms.date || '—'],
      ['Supervisor', swms.supervisor || '—'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [30, 64, 175], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' },
    },
  });

  yPos = doc.lastAutoTable.finalY + 15;

  // ==========================================
  // COMPANY DETAILS
  // ==========================================

  checkPageBreak(40);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('Company Details', 15, yPos);
  yPos += 8;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  doc.autoTable({
    startY: yPos,
    head: [['Field', 'Information']],
    body: [
      ['Organization', swms.company?.orgName || company?.name || '—'],
      ['ACN/ABN', swms.company?.acnAbn || '—'],
      ['Contact Name', swms.company?.contactName || '—'],
      ['Contact Number', swms.company?.contactNumber || '—'],
      ['Prepared By', swms.company?.preparedBy || '—'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [30, 64, 175], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' },
    },
  });

  yPos = doc.lastAutoTable.finalY + 15;

  // ==========================================
  // EMERGENCY CONTACTS
  // ==========================================

  checkPageBreak(60);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38); // Red
  doc.text('Emergency Contacts', 15, yPos);
  yPos += 8;

  // Big red 000 box
  doc.setFillColor(220, 38, 38);
  doc.rect(15, yPos, pageWidth - 30, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('IN EMERGENCY DIAL', pageWidth / 2, yPos + 8, { align: 'center' });
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('000', pageWidth / 2, yPos + 20, { align: 'center' });

  yPos += 32;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  // Emergency contacts table
  doc.autoTable({
    startY: yPos,
    head: [['Service', 'Details', 'Contact']],
    body: [
      [
        'Police Station',
        swms.emergencyContacts?.nearestPolice || '—',
        swms.emergencyContacts?.policePhone || '—',
      ],
      [
        'Medical Centre',
        swms.emergencyContacts?.nearestMedical || '—',
        swms.emergencyContacts?.medicalPhone || '—',
      ],
      ['Dial Before You Dig', '—', '1100'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [220, 38, 38], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 45 },
      1: { cellWidth: 80 },
      2: { fontStyle: 'bold', cellWidth: 'auto' },
    },
  });

  yPos = doc.lastAutoTable.finalY + 15;

  // ==========================================
  // JOB STEPS & RISK ASSESSMENT
  // ==========================================

  if (swms.jobSteps && swms.jobSteps.length > 0) {
    checkPageBreak(30);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175);
    doc.text('Job Steps & Risk Assessment', 15, yPos);
    yPos += 8;

    doc.setTextColor(0, 0, 0);

    swms.jobSteps.forEach((step, index) => {
      checkPageBreak(50);

      // Step header
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`Step ${index + 1}: ${step.name}`, 15, yPos);
      yPos += 7;

      // Risk indicators
      const getRiskColor = (risk) => {
        switch (risk) {
          case '1':
            return [220, 38, 38]; // Red
          case '2':
            return [249, 115, 22]; // Orange
          case '3':
            return [234, 179, 8]; // Yellow
          case '4':
            return [16, 185, 129]; // Green
          default:
            return [107, 114, 128]; // Gray
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

      // Initial Risk
      const initialColor = getRiskColor(step.initialRisk);
      doc.setFillColor(initialColor[0], initialColor[1], initialColor[2]);
      doc.rect(15, yPos, 35, 6, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text(`Initial: ${getRiskLabel(step.initialRisk)}`, 17, yPos + 4);

      // Residual Risk
      const residualColor = getRiskColor(step.residualRisk);
      doc.setFillColor(residualColor[0], residualColor[1], residualColor[2]);
      doc.rect(52, yPos, 35, 6, 'F');
      doc.text(`Residual: ${getRiskLabel(step.residualRisk)}`, 54, yPos + 4);

      yPos += 10;
      doc.setTextColor(0, 0, 0);

      // Step details table
      const stepBody = [];

      if (step.preparation) {
        stepBody.push(['Preparation', step.preparation]);
      }
      if (step.hazards) {
        stepBody.push(['Hazards', step.hazards]);
      }
      if (step.controls) {
        stepBody.push(['Control Measures', step.controls]);
      }
      if (step.responsible) {
        stepBody.push(['Responsible Person(s)', step.responsible]);
      }

      doc.autoTable({
        startY: yPos,
        body: stepBody,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 40, fillColor: [249, 250, 251] },
          1: { cellWidth: 'auto' },
        },
      });

      yPos = doc.lastAutoTable.finalY + 8;
    });
  }

  // ==========================================
  // WORKER SIGN-OFFS
  // ==========================================

  if (signOffs && signOffs.length > 0) {
    checkPageBreak(40);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175);
    doc.text('Worker Sign-Offs', 15, yPos);
    yPos += 8;

    doc.setTextColor(0, 0, 0);

    const signOffBody = signOffs.map((signOff) => [
      signOff.worker_name || signOff.name,
      signOff.worker_company || signOff.company || '—',
      signOff.worker_position || signOff.position,
      new Date(signOff.signed_at || signOff.date).toLocaleDateString(),
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['Name', 'Company', 'Position', 'Date Signed']],
      body: signOffBody,
      theme: 'striped',
      headStyles: {
        fillColor: [30, 64, 175],
        textColor: 255,
        fontStyle: 'bold',
      },
      styles: { fontSize: 9 },
    });

    yPos = doc.lastAutoTable.finalY + 10;
  } else {
    checkPageBreak(20);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175);
    doc.text('Worker Sign-Offs', 15, yPos);
    yPos += 8;

    doc.setTextColor(107, 114, 128);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('No workers have signed off yet', 15, yPos);
    yPos += 10;
  }

  // ==========================================
  // FOOTER
  // ==========================================

  const totalPages = doc.internal.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Footer line
    doc.setDrawColor(200, 200, 200);
    doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);

    // Footer text
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);

    // Left: Company name
    doc.text(company?.name || 'SWMS Manager', 15, pageHeight - 10);

    // Center: Document ID
    doc.text(
      `Document ID: ${swms.id.substring(0, 8)}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );

    // Right: Page number
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 15, pageHeight - 10, {
      align: 'right',
    });
  }

  return doc;
};

// Function to download PDF
export const downloadSWMSPDF = async (swms, company, signOffs) => {
  const doc = generateSWMSPDF(swms, company, signOffs);
  const fileName = `SWMS_${swms.projectName.replace(/[^a-z0-9]/gi, '_')}_${
    swms.date
  }.pdf`;
  doc.save(fileName);
};

// Function to get PDF as blob (for email attachment, etc.)
export const getSWMSPDFBlob = async (swms, company, signOffs) => {
  const doc = generateSWMSPDF(swms, company, signOffs);
  return doc.output('blob');
};
