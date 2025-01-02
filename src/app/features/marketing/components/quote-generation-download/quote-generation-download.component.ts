import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ToWords } from 'to-words';

@Component({
  selector: 'app-quote-generation-download',
  standalone:false,
  templateUrl: './quote-generation-download.component.html',
  styleUrl: './quote-generation-download.component.css'
})
export class QuoteGenerationDownloadComponent {
    clientData: any;
    services: any;
    leadPackage: any;
    mStrategies: any;
    smo:any;
    assistance:any;
    shootBudegetInWords: string='';
    shootBudget: number = 0;
    adBudgetInWords: string = '';
    packageTypeList: any = {
      1:'Stater',
      2:'Basic',
      3:'Pro',
      4:'Advanced',
      5:'Gold'
    }
    clientPackage: string ='';
    basePackage: number = 0;
    basePackageInWords: string = '';
    totalBudget: number = 0;
    totalBudgetInWords: string = '';
    noSCForAdCMUpto: number = 0;
    noSCForAdCMUptoInWords: string = '';
    adBudget: number = 0;
    isAssistance:boolean= false;
    showSpinner: boolean = false;
    constructor(private route: ActivatedRoute){
    }

    ngOnInit(){
      this.route.queryParams.subscribe(params => {
       this.clientData = JSON.parse(atob(params['data']));
       this.services = this.clientData?.clientServices;
       this.leadPackage = this.clientData?.leadPackage;
       this.smo = this.clientData?.socialMediaOptimization;
       this.mStrategies = this.clientData?.marketingStrategies;
       this.clientPackage =this.packageTypeList[this.mStrategies?.selectedMarketingStrategy];
      })
      var  toWords = new ToWords();
      this.shootBudget = this.leadPackage?.chargesPerVisit.toLocaleString('en-IN');
      this.adBudget = this.leadPackage?.adBudget.toLocaleString('en-IN');
      this.basePackage = this.leadPackage?.basePackage.toLocaleString('en-IN');
      this.shootBudegetInWords = toWords.convert(this.leadPackage?.chargesPerVisit, { currency: true, ignoreDecimal: true });
      this.adBudgetInWords = toWords.convert(this.leadPackage?.adBudget , { currency: true, ignoreDecimal: true });
      this.basePackageInWords = toWords.convert(this.leadPackage?.basePackage, { currency: true, ignoreDecimal: true });
      let budget = this.calculateTotalBudget();
      this.totalBudget = budget.toLocaleString('en-IN');
      this.totalBudgetInWords =  toWords.convert(budget , { currency: true, ignoreDecimal: true });
      this.assistance = this.clientData?.advanceAssistance;
      this.noSCForAdCMUpto = this.leadPackage?.noSCForAdCMUpto.toLocaleString('en-IN');;
      this.noSCForAdCMUptoInWords = toWords.convert(this.leadPackage?.noSCForAdCMUpto, { currency: true, ignoreDecimal: true });
      this.isAssistance = this.assistance?.sem ||  this.assistance?.justDail || this.assistance?.whatsappMarketing || this.assistance?.emailMarketing || this.assistance?.influencerMarketing || this.assistance?.interviewInYTAndTV
    }


    async generatePDF() {
      this.showSpinner = true;
      const pdf = new jsPDF('p', 'mm', 'a4'); // Create PDF in A4 size
  
      const element1 = document.getElementById('pdf-container1');
      const element2 = document.getElementById('pdf-container2');
  
      if (element1 && element2) {
        // Capture element1
        const canvas1 = await html2canvas(element1, { scale: 2 });
        const imgData1 = canvas1.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas1.height * pdfWidth) / canvas1.width;
  
        pdf.addImage(imgData1, 'PNG', 0, 0, pdfWidth, pdfHeight); // Add element1 to the first page
  
        // Capture element2
        const canvas2 = await html2canvas(element2, { scale: 2 });
        const imgData2 = canvas2.toDataURL('image/png');
        const pdfHeight2 = (canvas2.height * pdfWidth) / canvas2.width;
  
        pdf.addPage(); // Add a new page
        pdf.addImage(imgData2, 'PNG', 0, 0, pdfWidth, pdfHeight2); // Add element2 to the new page
        this.showSpinner = false;
        // Save the PDF
        pdf.save('quotation.pdf');
      }
    }

    calculateTotalBudget(){
      let budget = this.leadPackage?.adBudget + this.leadPackage?.basePackage
      return  (budget + budget*0.18)
    }
    
}
