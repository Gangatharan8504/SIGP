import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Generate high-definition ATS-Friendly A4 PDF from a DOM element
 */
export const generatePdfFromElement = async (element, fileName = 'Resume.pdf') => {
  if (!element) return false;

  try {
    // 1. Snapshot the element with high DPI (scale: 2)
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1024,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Subsequent pages if long resume
    while (heightLeft > 5) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('Client PDF Generation error:', error);
    // Fallback to native window print
    window.print();
    return false;
  }
};

/**
 * Print resume using browser's print dialog
 */
export const printResumeElement = () => {
  window.print();
};
