import { jsPDF } from 'jspdf';
import { format, isValid } from 'date-fns';
import { Medication } from '../types/medication';
import { MedicationAdministration } from '../types/mar';

interface GenerateReportParams {
  medications: Medication[];
  administrations: MedicationAdministration[];
  startDate: Date;
  endDate: Date;
}

export const generateMARReport = ({
  medications,
  administrations,
  startDate,
  endDate,
}: GenerateReportParams): jsPDF => {
  const doc = new jsPDF();
  let yPos = 20;
  const margin = 20;
  const pageWidth = doc.internal.pageSize.width;

  // Add header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Medication Administration Record (MAR)', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  // Add date range
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`,
    pageWidth / 2,
    yPos,
    { align: 'center' }
  );
  yPos += 20;

  // Add medications section
  doc.setFont('helvetica', 'bold');
  doc.text('Active Medications', margin, yPos);
  yPos += 10;

  medications.forEach(med => {
    if (yPos > doc.internal.pageSize.height - 20) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.text(med.name, margin, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(`${med.dosage} - ${med.frequency}`, margin + 80, yPos);
    yPos += 7;

    if (med.instructions) {
      doc.setFontSize(10);
      doc.text(`Instructions: ${med.instructions}`, margin + 10, yPos);
      yPos += 7;
    }
  });

  yPos += 10;

  // Add administration history
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Administration History', margin, yPos);
  yPos += 10;

  // Table headers
  const headers = ['Medication', 'Time', 'Status', 'Administrator', 'Notes'];
  const colWidths = [50, 40, 30, 40, 50];
  let xPos = margin;

  headers.forEach((header, i) => {
    doc.text(header, xPos, yPos);
    xPos += colWidths[i];
  });
  yPos += 7;

  // Table rows
  doc.setFont('helvetica', 'normal');
  const validAdministrations = administrations.filter(admin => 
    admin.administeredTime && isValid(new Date(admin.administeredTime))
  );

  validAdministrations
    .sort((a, b) => new Date(b.administeredTime).getTime() - new Date(a.administeredTime).getTime())
    .forEach(admin => {
      if (yPos > doc.internal.pageSize.height - 20) {
        doc.addPage();
        yPos = 20;
      }

      const med = medications.find(m => m.id === admin.medicationId);
      if (!med) return;

      xPos = margin;
      doc.text(med.name, xPos, yPos);
      xPos += colWidths[0];
      
      const adminTime = new Date(admin.administeredTime);
      if (isValid(adminTime)) {
        doc.text(format(adminTime, 'MMM d, h:mm a'), xPos, yPos);
      } else {
        doc.text('Invalid Date', xPos, yPos);
      }
      xPos += colWidths[1];
      
      doc.text(admin.status, xPos, yPos);
      xPos += colWidths[2];
      
      doc.text(admin.administeredBy || '-', xPos, yPos);
      xPos += colWidths[3];
      
      if (admin.notes) {
        const lines = doc.splitTextToSize(admin.notes, colWidths[4]);
        doc.text(lines, xPos, yPos);
        yPos += (lines.length - 1) * 7;
      } else {
        doc.text('-', xPos, yPos);
      }
      
      yPos += 10;
    });

  return doc;
};