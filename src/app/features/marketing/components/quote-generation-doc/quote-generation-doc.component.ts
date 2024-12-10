import { Component } from '@angular/core';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-quote-generation-doc',
  templateUrl: './quote-generation-doc.component.html',
  styleUrl: './quote-generation-doc.component.css'
})
export class QuoteGenerationDocComponent {
  downloadPdf(): void {
    const doc = new jsPDF();

    // Add content to the PDF
    doc.setFontSize(18);
    doc.text('Quotation Document', 10, 10);

    doc.setFontSize(12);
    doc.text('Thank you for considering our services.', 10, 20);
    doc.text('Here are the details of your quotation:', 10, 30);

    doc.text('1. Service: Example Service', 10, 40);
    doc.text('2. Price: $1000', 10, 50);
    doc.text('3. Terms: Payment due within 30 days', 10, 60);

    doc.text('If you have any questions, please contact us.', 10, 80);

    // Save the PDF
    doc.save('quotation.pdf');
  }
}
