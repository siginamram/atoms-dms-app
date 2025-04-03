import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeesService } from '../../../services/employees.service';
import { ToWords } from 'to-words';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as moment from 'moment';

@Component({
  selector: 'app-gstinvoicesdownload',
  standalone:false,
  templateUrl: './gstinvoicesdownload.component.html',
  styleUrls: ['./gstinvoicesdownload.component.css']
})
export class GstinvoicesdownloadComponent implements OnInit {
  invoiceData: any;
  amountInWords: string = '';
  servicePeriod: string = '';

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

      const toWords = new ToWords();

      this.employeesService.GetInvoiceDetailsById(invoiceId).subscribe((res: any) => {
        this.invoiceData = res;
        this.amountInWords = toWords.convert(res.totalAmount, { currency: true, ignoreDecimal: true });
        this.servicePeriod = this.getMonthYear(res.date);
      });
    }
  }

  getMonthYear(dateStr: string): string {
    const date = new Date(dateStr);
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
        pdf.save(`Invoice-${this.invoiceData?.organizationName +'-' + this.invoiceData?.date || 'Download'}.pdf`);
  
           // Show buttons again after PDF generation
           buttonsToHide.forEach(btn => btn.style.display = 'block');
      });
    }, 100); // small delay to ensure button hides
  }

  goBack(): void {
    const tab = this.route.snapshot.queryParamMap.get('tab') || 'gst';
    const date = this.route.snapshot.queryParamMap.get('date') || moment().format('YYYY-MM');
    this.router.navigate(['/home/employees/payment-tabs'], {
      queryParams: {
        tab,
        date
      }
    });
  }
}
