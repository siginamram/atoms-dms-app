import { Component } from '@angular/core';

@Component({
  selector: 'app-quote-generation-doc',
  templateUrl: './quote-generation-doc.component.html',
  styleUrls: ['./quote-generation-doc.component.css'],
})
export class QuoteGenerationDocComponent {
  downloadPdf(): void {
    const filePath = 'assets/quotes/Quotation-file.pdf'; // Path to the PDF file in assets folder
    const fileName = 'quotation.pdf'; // Desired download name

    // Fetch the PDF file from the assets folder and trigger the download
    fetch(filePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('Error downloading PDF:', error);
        alert('Failed to download the PDF. Please try again later.');
      });
  }
}
