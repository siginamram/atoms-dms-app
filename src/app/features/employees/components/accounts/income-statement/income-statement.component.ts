import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { EmployeesService } from '../../../services/employees.service';

@Component({
  selector: 'app-income-statement',
  standalone: false,
  templateUrl: './income-statement.component.html',
  styleUrls: ['./income-statement.component.css']
})
export class IncomeStatementComponent implements OnInit {
  fromDate = new FormControl(moment().startOf('month'));
  toDate = new FormControl(moment().endOf('month'));
  isLoading = false;
  lastMonthBalnce :any =0;
  pendingPastMonth :any = 0;
  receivedPrevious:any = 0;
  balancePrevious:any = 0;
  
  pendingCurrent:any = 0;
  receivedCurrent:any = 0;
  balanceCurrent:any = 0;
  totalExpenses :any =0;
  totalExpected:any = 0;
  totalReceived:any = 0;
  totalPending:any = 0;

  totalAdvAmount :any = 0;
  recivedAdvAmount :any = 0;
  AdvbalancePrevious:any = 0;
  
  incomeStatementForm: FormGroup = new FormGroup({
    pendingCurrentPeriod: new FormControl(''),
    pendingPastMonth: new FormControl(''),
    totalRevenue: new FormControl(''),
    totalExpenses: new FormControl(''),
    overallBalance: new FormControl(''),

    adBudget: new FormControl(''),
    gst: new FormControl(''),
    salaries: new FormControl(''),
    rent: new FormControl(''),
    powerBill: new FormControl(''),

    groceries: new FormControl(''),
    snacks: new FormControl(''),
    milk: new FormControl(''),
    water: new FormControl(''),
    transport: new FormControl(''),

    marketing: new FormControl(''),
    mobileRecharges: new FormControl(''),
    wifiRecharges: new FormControl(''),
    others: new FormControl(''),
    employeeBenefits: new FormControl('')
  });

  constructor(private employeesService: EmployeesService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    const fdate = moment(this.fromDate.value).format('YYYY-MM-DD');
    const tdate = moment(this.toDate.value).format('YYYY-MM-DD');

    this.isLoading = true;
    this.incomeStatementForm.disable(); // Optional: prevent editing while loading

    this.employeesService.GetIncomeStatements(fdate, tdate).subscribe(
      (data: any) => {
          // Raw values for calculation
        let pendingFromPreviousMonths =  75000 + data.pendingFromPreviousMonths + data.amountReceivedPrevious   || 0;
        let amountReceivedPrevious = data.amountReceivedPrevious || 0;
        let tobeReceivedCurrentMonth = data.tobeReceivedCurrentMonth || 0;
        let amountReceivedCurrent = data.amountReceivedCurrent || 0;
         let lastMonthBalnce = 98590 + data.previousMonthOverallBalanceAmount + data.receivedAdvAmountPreviousMonth || 0;

         this.lastMonthBalnce = this.formatCurrency(98590 + data.previousMonthOverallBalanceAmount + data.receivedAdvAmountPreviousMonth) || 0;
        // Adv
         let totalAdvAmount =data.totalAdvAmount || 0;
         let recivedAdvAmount= data.recivedAdvAmount || 0;
         let AdvbalancePrevious=totalAdvAmount -recivedAdvAmount || 0;

         this.totalAdvAmount=this.formatCurrency(totalAdvAmount);
         this.recivedAdvAmount=this.formatCurrency(recivedAdvAmount);
         this.AdvbalancePrevious=this.formatCurrency(AdvbalancePrevious);

        // Calculated raw totals
        let balancePrev = pendingFromPreviousMonths - amountReceivedPrevious;
        let balanceCurr = tobeReceivedCurrentMonth - amountReceivedCurrent;

        let totalToBeReceived = pendingFromPreviousMonths + tobeReceivedCurrentMonth;
        let totalReceivedAmount = amountReceivedPrevious + amountReceivedCurrent;
        let totalPendingAmount = totalToBeReceived - totalReceivedAmount;

        let overallBalanceRaw = (totalReceivedAmount + lastMonthBalnce + recivedAdvAmount) - (data.totalExpenses || 0);

        // let previousMonthBalnce = lastMonthBalnce + overallBalanceRaw || 0 ;

        // this.lastMonthBalnce =this.formatCurrency(previousMonthBalnce);

        // Bind formatted values to display properties
        this.pendingPastMonth = this.formatCurrency(pendingFromPreviousMonths );
        this.receivedPrevious = this.formatCurrency(amountReceivedPrevious);
        this.balancePrevious = this.formatCurrency(balancePrev);

        this.pendingCurrent = this.formatCurrency(tobeReceivedCurrentMonth);
        this.receivedCurrent = this.formatCurrency(amountReceivedCurrent);
        this.balanceCurrent = this.formatCurrency(balanceCurr);

        this.totalExpected = this.formatCurrency(totalToBeReceived);
        this.totalReceived = this.formatCurrency(totalReceivedAmount);
        this.totalPending = this.formatCurrency(totalPendingAmount);
        this.totalExpenses= this.formatCurrency(data.totalExpenses);
     
        this.incomeStatementForm.patchValue({
          totalExpenses: this.formatCurrency(data.totalExpenses),
          overallBalance: this.formatCurrency(overallBalanceRaw),

          adBudget: this.formatCurrency(data.adBudget),
          gst: this.formatCurrency(data.gst),
          salaries: this.formatCurrency(data.salaries),
          rent: this.formatCurrency(data.rent),
          powerBill: this.formatCurrency(data.powerBill),

          groceries: this.formatCurrency(data.monthlyGroceriesAndEssentials),
          snacks: this.formatCurrency(data.snacks),
          milk: this.formatCurrency(data.milk),
          water: this.formatCurrency(data.water),
          transport: this.formatCurrency(data.expensesOfOperationalTransportation),

          marketing: this.formatCurrency(data.marketingExpenses),
          mobileRecharges: this.formatCurrency(data.mobileRecharges),
          wifiRecharges: this.formatCurrency(data.wiFiRecharges),
          others: this.formatCurrency(data.others),
          employeeBenefits: this.formatCurrency(data.employeeBenefits),
        });

        this.incomeStatementForm.enable(); // re-enable form
        this.isLoading = false;
      },
      error => {
        console.error('Failed to fetch income statement:', error);
        this.isLoading = false;
        this.incomeStatementForm.enable();
      }
    );
  }

  formatCurrency(value: number): string {
    return `₹${value.toLocaleString('en-IN')}`;
  }
}
