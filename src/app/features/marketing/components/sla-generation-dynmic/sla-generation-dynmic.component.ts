import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ToWords } from 'to-words';


@Component({
  selector: 'app-sla-generation-dynamic',
  standalone: false,
  templateUrl: './sla-generation-dynmic.component.html',
  styleUrls: ['./sla-generation-dynmic.component.css']
})
export class SlaGenerationDynamicComponent {
  showSpinner: boolean = false;
  clientName: string = '';
  city: string = '';
  clientRepresentativeName = '';
  clientRepresentativeDesignation = '';
  signingDate = new Date();
  slaData: any;
  packageDetails: any;
  shootBudget: any;
  shootBudgetInWords: any;
  adBudget: any;
  adBudgetInWords: any;
  totalBudget: any;
  totalBudgetInWords: any;
  dateSuffix = ["", "st", "nd", "rd", "rth", "th"];
  paymentDate: any;
  suffix: string = '';
  salesPersonDesignation:any;
  salesPersonName: any;

  toWords = new ToWords();
  constructor(private route: ActivatedRoute,private router: Router) { }
  ngOnInit() {
    window.scrollTo(0, 0);
    this.route.queryParams.subscribe(params => {
      this.slaData = JSON.parse(atob(params['data']));
      console.log(this.slaData)
      this.salesPersonName = this.slaData?.salesPersonName;
      this.salesPersonDesignation = this.slaData?.salesPersonDesignation;
      this.clientName = this.slaData?.organizationName;
      this.clientRepresentativeName = this.slaData?.clientName;
      this.clientRepresentativeDesignation = this.slaData?.clientDesignation;
      this.city = this.slaData?.address;
      this.packageDetails = this.slaData?.package;
      this.shootBudget = this.packageDetails?.chargePerVisit.toLocaleString('en-IN');
      this.adBudget = this.packageDetails?.adBudget.toLocaleString('en-IN');
      let budget = this.calculateTotalBudget()
      this.totalBudget = budget.toLocaleString('en-IN');
      this.paymentDate = new Date(this.slaData?.paymentDate).getDate();
      this.suffix = this.prepareRenewalDate();
      this.adBudgetInWords = this.toWords.convert(this.packageDetails?.adBudget,{currency: true, ignoreDecimal: true })
      this.shootBudgetInWords = this.toWords.convert(this.packageDetails?.chargePerVisit,{currency: true,ignoreDecimal: true})
      this.totalBudgetInWords = this.toWords.convert(budget,{currency: true,ignoreDecimal: true})
      this.signingDate =new Date(this.slaData?.slaGenerateDate);
    })
  }
  calculateTotalBudget() {
    let budget = this.packageDetails?.adBudget + this.packageDetails?.basePackage;
    return (budget + budget * 0.18);
  }

  prepareRenewalDate() {
    let dateString = this.paymentDate.toString()
    let date = this.paymentDate
    if ((date >= 5 && date <= 20) || (date >= 25 && date <= 30)) {
      return 'th'
    }
    else if (dateString[1]) {
      let index = parseInt(dateString[1], 10);
      return this.dateSuffix[index];
    }else{
      let index = parseInt(dateString[0], 10);
      return this.dateSuffix[index];
    }
  }

  async generatePDF() {
    this.showSpinner = true;
    const pdf = new jsPDF('p', 'mm', 'a4'); // Create PDF in A4 size

    const element1 = document.getElementById('pdf-container1');
    const element2 = document.getElementById('pdf-container2');
    const element3 = document.getElementById('pdf-container3');

    if (element1 && element2 && element3) {
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

      // Capture element3
      const canvas3 = await html2canvas(element3, { scale: 2 });
      const imgData3 = canvas3.toDataURL('image/png');
      const pdfHeight3 = (canvas3.height * pdfWidth) / canvas3.width;

      pdf.addPage(); // Add a new page
      pdf.addImage(imgData3, 'PNG', 0, 0, pdfWidth, pdfHeight3); // Add element2 to the new page

      // Save the PDF
      pdf.save(`${this.clientName}_SLA.pdf`);
    }
    this.showSpinner = false;
  }

  redirect(){
    if(this.slaData?.pageName == 'list'){
      this.router.navigate([`/home/marketing/sla-generation`]);
    }
    else{
      this.router.navigate([`/home/marketing/generate-sla/${this.slaData?.clientId}`]);
    }
  }

}