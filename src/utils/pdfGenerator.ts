import { jsPDF } from 'jspdf';
import { ConsentForm } from '../types/consent';
import { Client } from '../types';
import { format } from 'date-fns';

export const generatePDF = (client: Client): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPos = 20;

  // Add header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Client Profile', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Add client information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  const addField = (label: string, value: string) => {
    doc.text(`${label}: ${value}`, margin, yPos);
    yPos += 10;
  };

  addField('Name', `${client.firstName} ${client.lastName}`);
  addField('Email', client.email);
  addField('Phone', client.phone);
  addField('Date of Birth', format(new Date(client.dateOfBirth), 'MMMM d, yyyy'));
  addField('Address', client.address);

  if (client.insuranceProvider) {
    yPos += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Insurance Information', margin, yPos);
    yPos += 10;
    doc.setFont('helvetica', 'normal');
    addField('Provider', client.insuranceProvider);
    addField('Insurance Number', client.insuranceNumber || '');
  }

  // Add documents section
  if (client.documents.length > 0) {
    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Documents', margin, yPos);
    yPos += 10;
    doc.setFont('helvetica', 'normal');

    client.documents.forEach(doc => {
      if (yPos > doc.internal.pageSize.height - margin) {
        doc.addPage();
        yPos = margin;
      }
      addField('Title', doc.title);
      addField('Type', doc.type);
      addField('Status', doc.status);
      addField('Created', format(new Date(doc.createdAt), 'MMMM d, yyyy'));
      yPos += 5;
    });
  }

  return doc;
};

export const generateConsentFormPDF = (form: ConsentForm): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPos = 20;

  // Add organization header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Organization Name', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Add form title
  doc.setFontSize(16);
  doc.text(form.title, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Add date and form ID
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${format(new Date(form.createdAt), 'MMMM d, yyyy')}`, margin, yPos);
  doc.text(`Form ID: ${form.id}`, pageWidth - margin, yPos, { align: 'right' });
  yPos += 10;

  // Add content with proper formatting
  doc.setFontSize(12);
  const contentLines = doc.splitTextToSize(form.content, pageWidth - 2 * margin);
  contentLines.forEach(line => {
    if (yPos > doc.internal.pageSize.height - margin) {
      doc.addPage();
      yPos = margin;
    }
    doc.text(line, margin, yPos);
    yPos += 7;
  });
  yPos += 20;

  // Add validity period
  doc.setFontSize(10);
  doc.text(`Valid From: ${format(new Date(form.validFrom), 'MMMM d, yyyy')}`, margin, yPos);
  if (form.validUntil) {
    doc.text(
      `Valid Until: ${format(new Date(form.validUntil), 'MMMM d, yyyy')}`,
      pageWidth - margin,
      yPos,
      { align: 'right' }
    );
  }
  yPos += 20;

  // Add signature section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Signatures:', margin, yPos);
  yPos += 10;

  // Add signature lines
  doc.setFont('helvetica', 'normal');
  form.signatures.forEach(signature => {
    if (yPos > doc.internal.pageSize.height - margin) {
      doc.addPage();
      yPos = margin;
    }
    
    doc.text(`${signature.role} Signature:`, margin, yPos);
    doc.line(margin + 50, yPos, pageWidth - margin, yPos);
    yPos += 10;
    
    doc.text('Date:', margin, yPos);
    doc.line(margin + 30, yPos, pageWidth - margin, yPos);
    yPos += 20;
  });

  return doc;
};

export const generateAllDocumentsPDF = (client: Client): jsPDF => {
  const doc = new jsPDF();
  let isFirstPage = true;

  client.documents.forEach(document => {
    if (!isFirstPage) {
      doc.addPage();
    }
    isFirstPage = false;

    const pageWidth = doc.internal.pageSize.width;
    let yPos = 20;

    // Add document title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(document.title, pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Add metadata
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Type: ${document.type}`, 20, yPos);
    doc.text(`Status: ${document.status}`, pageWidth - 20, yPos, { align: 'right' });
    yPos += 10;
    doc.text(`Created: ${format(new Date(document.createdAt), 'MMMM d, yyyy')}`, 20, yPos);
    if (document.signedAt) {
      doc.text(`Signed: ${format(new Date(document.signedAt), 'MMMM d, yyyy')}`, pageWidth - 20, yPos, { align: 'right' });
    }
    yPos += 15;

    // Add content
    doc.setFontSize(12);
    const contentLines = doc.splitTextToSize(document.content, pageWidth - 40);
    contentLines.forEach(line => {
      if (yPos > doc.internal.pageSize.height - 20) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, 20, yPos);
      yPos += 7;
    });
  });

  return doc;
};