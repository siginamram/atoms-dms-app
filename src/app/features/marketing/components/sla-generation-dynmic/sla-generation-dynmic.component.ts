import { Component, OnInit } from '@angular/core';
import { MarketingService } from '../../services/marketing.service';
import { ActivatedRoute } from '@angular/router';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-sla-generation-dynamic',
  standalone:false,
  templateUrl: './sla-generation-dynmic.component.html',
  styleUrls: ['./sla-generation-dynmic.component.css']
})
export class SlaGenerationDynamicComponent {
  letterheadUrl = '../../../../assets/img/atomsletter_header.jpg';
  clientName = 'Narendra Ortho and Spine';
  city = 'Guntur';
  platforms = ['Facebook', 'Instagram', 'LinkedIn'];
  deliverables = {
    posters: '16',
    graphicReels: '4',
    educationalReels: '2',
    youtubeVideos: '1',
  };
  adBudget = { amount: '50000', words: 'Fifty Thousand Only' };
  shootDetails = { budgetAmount: '5000', budgetWords: 'Five Thousand Only' };
  payment = { amount: '15000', words: 'Fifteen Thousand Only', dueDate: '10th of Every Month' };
  salespersonName = 'Mr. Ayyappa Siginam';
  salespersonDesignation = 'Chairman and Director';
  clientRepresentativeName = 'Dr. Narendra Reddy Medagam';
  clientRepresentativeDesignation = 'MS (Ortho), DNB, FNB (Spine)';
  signingDate = '12 July 2024';
  clientSigningDate = '12 July 2024';
}