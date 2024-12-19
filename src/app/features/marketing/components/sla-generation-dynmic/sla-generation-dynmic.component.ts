import { Component, OnInit } from '@angular/core';
import { MarketingService } from '../../services/marketing.service';
import { ActivatedRoute } from '@angular/router';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-sla-generation-dynamic',
  templateUrl: './sla-generation-dynmic.component.html',
  styleUrls: ['./sla-generation-dynmic.component.css']
})
export class SlaGenerationDynamicComponent implements OnInit {
  clientData: any = null; // Store client details dynamically
  leadID: number | null = null; // Store LeadID

  constructor(
    private commanApiService: MarketingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.leadID = +params['id'];
      if (this.leadID) {
        this.loadClientDetails(this.leadID); // Fetch client details
      }
    });
  }

  loadClientDetails(leadID: number): void {
    this.commanApiService.getClientByLeadId(leadID).subscribe(
      (data: any) => {
        console.log('Client Data:', data);
        this.clientData = data;
      },
      (error) => {
        console.error('Error fetching client data:', error);
      }
    );
  }
  
  generateSLADocument(): void {
    if (!this.clientData) {
        console.error('Client data is not loaded');
        return;
    }

    const doc = new jsPDF();
    const letterheadUrl = '../../../../assets/img/atomsletter_header.jpg'; // Full-page letterhead path
    const currentDate = new Date().toLocaleDateString('en-GB'); // Current Date

    // Function to add letterhead
    const addLetterhead = (doc: any) => {
        doc.addImage(letterheadUrl, 'JPEG', 0, 0, 210, 297); // Full-page letterhead
    };

    // Function to add section titles
    const addSectionTitle = (doc: any, title: string, y: number) => {
        doc.setFont('times', 'bold');
        doc.setFontSize(12);
        doc.text(title, 10, y);
        return y + 10;
    };

    // Function to add content with page overflow handling
    const addContent = (doc: any, content: string | string[], y: number) => {
        doc.setFont('times', 'normal');
        doc.setFontSize(11);
        const pageHeight = 297; // A4 Page height in mm

        if (Array.isArray(content)) {
            content.forEach((item) => {
                if (y > 270) { // Check for page overflow
                    doc.addPage();
                    addLetterhead(doc);
                    y = 50; // Reset Y for new page
                }
                doc.text(`• ${item}`, 12, y);
                y += 8;
            });
        } else {
            const lines = doc.splitTextToSize(content, 180);
            lines.forEach((line: string) => {
                if (y > 270) { // Check for page overflow
                    doc.addPage();
                    addLetterhead(doc);
                    y = 50; // Reset Y for new page
                }
                doc.text(line, 12, y);
                y += 8;
            });
        }
        return y;
    };

    const renderContent = () => {
        let currentY = 50; // Initial Y position
        addLetterhead(doc); // Add letterhead on the first page

        // SLA Title
        doc.setFont('times', 'bold');
        doc.setFontSize(14);
        doc.text('SERVICE LEVEL AGREEMENT (SLA)', 105, currentY, { align: 'center' });
        currentY += 10;
        doc.text('BETWEEN', 105, currentY, { align: 'center' });
        currentY += 10;
        doc.text(`ATOMS DIGITAL SOLUTIONS AND ${this.clientData.organizationName || 'N/A'}`, 105, currentY, { align: 'center' });
        currentY += 20;

        // Add sections dynamically
        currentY = addSectionTitle(doc, 'Scope of Services:', currentY);
        currentY = addContent(doc, `Atoms Digital Solutions agrees to provide Digital Marketing Services to ${this.clientData.organizationName || 'N/A'}, Guntur.`, currentY);

        currentY = addSectionTitle(doc, 'Service Deliverables:', currentY);
        currentY = addContent(doc, [
            'Optimizing social media handles - Facebook, Instagram, and YouTube',
            'Content creation for designs',
            `Upload ${this.clientData.package?.noOfPosters || '15'} posters per month`,
            `Upload ${this.clientData.package?.noOfReels || '12'} reels per month`,
            `Upload ${this.clientData.package?.noOfYouTubeVideos || '4'} YouTube videos per month`,
            'Run sponsored ads on Facebook and Instagram with 10% of overall budget'
        ], currentY);

        currentY = addSectionTitle(doc, 'Payment Terms:', currentY);
        currentY = addContent(doc, `${this.clientData.organizationName || 'N/A'} commits to pay Atoms Digital Solutions a total sum of ${this.clientData.package?.basePackage || '₹25,000'} per month for the specified services.`, currentY);

        currentY = addSectionTitle(doc, 'Data Sharing:', currentY);
        currentY = addContent(doc, [
            'Provide required knowledge transfer sessions to content writers & designers.',
            'Provide data, content, and information at least FOUR days before requirement.',
            'Offer time for monthly photo and video shoots with one month payment in advance.',
            'Provide feedback to improve service quality.'
        ], currentY);

        currentY = addSectionTitle(doc, 'Confidentiality:', currentY);
        currentY = addContent(doc, 'Both parties agree to ensure the confidentiality of proprietary information shared during the engagement.', currentY);

        currentY = addSectionTitle(doc, 'Timeline:', currentY);
        currentY = addContent(doc, 'Services are renewed monthly, and the timeline can be modified upon mutual agreement.', currentY);

        currentY = addSectionTitle(doc, 'Termination Clause:', currentY);
        currentY = addContent(doc, [
            'Either party can terminate the agreement with a one-month written notice.',
            'Services will continue till the end of the paid period in case of advance payments.'
        ], currentY);

        currentY = addSectionTitle(doc, 'Governing Law:', currentY);
        currentY = addContent(doc, 'This agreement is governed by the laws of the jurisdiction where Atoms Digital Solutions is headquartered.', currentY);

        // Add Signatures
        if (currentY > 250) {
            doc.addPage();
            addLetterhead(doc);
            currentY = 50;
        }
        currentY += 20;
        doc.setFont('times', 'bold');
        doc.text('Signatures:', 10, currentY);
        currentY += 10;
        doc.setFont('times', 'normal');
        doc.text('Mr. Ayyappa Siginam', 10, currentY);
        doc.text('Chairman and Director, Atoms Digital Solutions', 10, currentY + 8);
        doc.text(`Date: ${currentDate}`, 10, currentY + 16);

        doc.text(`${this.clientData.clientName || 'Client Name'}`, 120, currentY);
        doc.text(`${this.clientData.clientDesignation || 'Client Designation'}`, 120, currentY + 8);
        doc.text(`Date: ${currentDate}`, 120, currentY + 16);
    };

    renderContent();
    doc.save('SLA_Document.pdf');
}




}
