import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Generate Strict 1-Page High-Definition ATS-Friendly A4 PDF
 */
export const generatePdfFromElement = async (element, fileName = 'Resume.pdf') => {
  if (!element) return false;

  try {
    // 1. Snapshot the element with scale: 2 for crisp vector-like text
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794, // exact 210mm at 96 DPI
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    
    // Create standard portrait A4 PDF (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = 210; // 210mm
    const pdfHeight = 297; // 297mm

    // Calculate aspect ratio to fit STRICTLY onto exactly ONE single A4 page
    const canvasRatio = canvas.height / canvas.width;
    let finalWidth = pdfWidth;
    let finalHeight = pdfWidth * canvasRatio;

    // If content height exceeds A4 height, scale down proportionately to fit strictly on 1 page!
    if (finalHeight > pdfHeight) {
      finalHeight = pdfHeight;
      finalWidth = pdfHeight / canvasRatio;
    }

    const xOffset = Math.max(0, (pdfWidth - finalWidth) / 2);
    const yOffset = 0;

    // Add exactly ONE page
    pdf.addImage(imgData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight, undefined, 'FAST');

    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('Client PDF Generation error:', error);
    printResumeElement(element);
    return false;
  }
};

/**
 * Print ONLY the resume element cleanly on 1 sheet of paper using an isolated hidden iframe
 */
export const printResumeElement = (element) => {
  if (!element) {
    window.print();
    return;
  }

  // Create an invisible iframe to isolate the resume from the rest of the website
  const printFrame = document.createElement('iframe');
  printFrame.style.position = 'fixed';
  printFrame.style.right = '0';
  printFrame.style.bottom = '0';
  printFrame.style.width = '0';
  printFrame.style.height = '0';
  printFrame.style.border = '0';
  document.body.appendChild(printFrame);

  const frameDoc = printFrame.contentWindow.document;
  frameDoc.open();
  frameDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Resume Print</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
        <style>
          @page {
            size: A4 portrait;
            margin: 0;
          }
          *, *::before, *::after {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            margin: 0;
            padding: 0;
            background: #ffffff;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            width: 210mm;
            height: 297mm;
            max-height: 297mm;
            overflow: hidden;
          }
          .resume-container {
            width: 210mm;
            height: 297mm;
            max-height: 297mm;
            margin: 0 auto;
            padding: 8mm;
            background: #ffffff;
            box-sizing: border-box;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <div class="resume-container">
          ${element.innerHTML}
        </div>
      </body>
    </html>
  `);
  frameDoc.close();

  printFrame.onload = () => {
    setTimeout(() => {
      printFrame.contentWindow.focus();
      printFrame.contentWindow.print();
      setTimeout(() => {
        if (document.body.contains(printFrame)) {
          document.body.removeChild(printFrame);
        }
      }, 1500);
    }, 300);
  };
};
