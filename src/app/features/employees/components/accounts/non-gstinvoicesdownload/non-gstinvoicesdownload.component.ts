import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeesService } from '../../../services/employees.service';
import { ToWords } from 'to-words';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-non-gstinvoicesdownload',
  standalone:false,
  templateUrl: './non-gstinvoicesdownload.component.html',
  styleUrls: ['./non-gstinvoicesdownload.component.css']
})
export class NonGstinvoicesdownloadComponent implements OnInit {
  invoiceData: any;
  servicePeriod: string = '';
  invoiceId: any;
  AmountInWords: any;

  @ViewChild('invoiceContent', { static: false }) invoiceContent!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private employeesService: EmployeesService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const invoiceParam = this.route.snapshot.queryParamMap.get('invoice');
    if (invoiceParam) {
      const invoiceObj = typeof invoiceParam === 'string' ? JSON.parse(invoiceParam) : invoiceParam;
      const invoiceId = invoiceObj?.id || invoiceObj;
      this.invoiceId = invoiceId;
    }

    if (this.invoiceId) {
      const toWords = new ToWords();
      this.employeesService.GetInvoiceDetailsById(this.invoiceId).subscribe((res: any) => {
        this.invoiceData = res;
        this.servicePeriod = this.getMonthYear(res.date);
        this.AmountInWords = toWords.convert(res.totalAmount, { currency: true, ignoreDecimal: true });
      });
    }
  }

  // getMonthYear(dateStr: string): string {
  //   const date = new Date(dateStr);
  //   const month = date.toLocaleString('default', { month: 'long' });
  //   const year = date.getFullYear();
  //   return `${month} ${year}`;
  // }

  getMonthYear(dateStr: string): string {
    const date = new Date(dateStr);
    date.setMonth(date.getMonth() - 1); // go back one month
  
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  }
downloadPDF(): void {
  const invoiceElement = document.querySelector('.invoice-container') as HTMLElement;
  const buttonsToHide = document.querySelectorAll('.no-print') as NodeListOf<HTMLElement>;

  // Step 1: Hide the button manually before capture
  buttonsToHide.forEach(btn => btn.style.display = 'none');

  // Step 2: Wait a short time to let DOM update
  setTimeout(() => {
    html2canvas(invoiceElement, {
      scale: 3,
      useCORS: true,
      scrollY: -window.scrollY
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice-${this.invoiceData?.organizationName +'-' + this.servicePeriod || 'Download'}.pdf`);

         // Show buttons again after PDF generation
         buttonsToHide.forEach(btn => btn.style.display = 'block');
    });
  }, 100); // small delay to ensure button hides
}

goBack(): void {
  this.router.navigate(['/home/employees/payment-tabs']); 
}
  
}
