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
    const logoUrl = '../../../../assets/img/Atoms-Digital.png'; // Path to your logo
  
    // Add Logo
    const addLogo = (doc: any, callback: () => void) => {
      const img = new Image();
      img.src = logoUrl;
      img.onload = () => {
        doc.addImage(img, 'PNG', 10, 10, 50, 15); // Adjust logo size and position
        callback();
      };
    };
  
    addLogo(doc, () => {
      // Header Section
      doc.setFontSize(10);
      doc.text('ATOMS DIGITAL SOLUTIONS PRIVATE LIMITED', 105, 30, {
        align: 'center',
      });
      doc.text(
        'CIN: U62099AP2023PTC111381 | atomsdigitalsolutions1@gmail.com | +91 91107 43341',
        105,
        35,
        { align: 'center' }
      );
  
      // SLA Title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('SERVICE LEVEL AGREEMENT (SLA)', 105, 50, { align: 'center' });
  
      // Between Section
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `BETWEEN\n\nATOMS DIGITAL SOLUTIONS AND ${this.clientData.organizationName || 'N/A'}`,
        105,
        60,
        { align: 'center' }
      );
  
      // Scope of Services
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Scope of Services:', 10, 80);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text(
        `Atoms Digital Solutions agrees to provide Digital Marketing Services to ${this.clientData.organizationName || 'N/A'}, Guntur.`,
        10,
        90
      );
  
      // Service Deliverables
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Service Deliverables:', 10, 110);
      doc.setFont('helvetica', 'normal');
      const deliverables = [
        'Optimizing social media handles - Facebook, Instagram, and YouTube',
        'Content creation for designs',
        `Upload ${this.clientData.package?.noOfPosters || 'N/A'} posters per month`,
        `Upload ${this.clientData.package?.noOfReels || 'N/A'} reels per month`,
        `Upload ${this.clientData.package?.noOfYouTubeVideos || 'N/A'} YouTube videos per month`,
        'Run sponsored ads on Facebook and Instagram with 10% of the overall budget',
      ];
      deliverables.forEach((item, index) => {
        doc.text(`- ${item}`, 10, 120 + index * 10);
      });
  
      // Data Sharing
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Data Sharing:', 10, 180);
      doc.setFont('helvetica', 'normal');
      const dataSharing = [
        `${this.clientData.organizationName || 'N/A'} agrees to provide required knowledge transfer sessions to the content writers & graphic designers before onboarding.`,
        `${this.clientData.organizationName || 'N/A'} agrees to provide required data, content, and information for any additional projects at least FOUR days before the date of requirement.`,
        `${this.clientData.organizationName || 'N/A'} agrees to provide required feedback to improve the quality of service offered.`,
        `${this.clientData.organizationName || 'N/A'} agrees to offer time for monthly photo and video shoots with one month payment in advance.`,
      ];
      dataSharing.forEach((item, index) => {
        doc.text(`- ${item}`, 10, 190 + index * 10);
      });
  
      // Payment Terms
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Payment Terms:', 10, 240);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `${this.clientData.organizationName || 'N/A'} commits to pay Atoms Digital Solutions a total sum of Twenty Five Thousand Rupees only (₹25,000/-) per month for the specified services.`,
        10,
        250
      );
  
      // Footer
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text(
        'Atoms Digital Solutions Private Limited, Flat No. 301, Sri Siva Sankari Nilayam, Guntur, Andhra Pradesh',
        10,
        280,
        { align: 'left' }
      );
  
      // Save PDF
      doc.save('SLA_Document.pdf');
    });
  }
  
  
}