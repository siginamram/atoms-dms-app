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
  overallBalanceRaw : any =0;
  lastMonthBalnce1 :any =0;

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
    employeeBenefits: new FormControl(''),
    cashNetBalance:new FormControl(''),
    currentAccountNetBalance:new FormControl('')
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
        let pendingFromPreviousMonths =  75000 + data.incomeStatement.pendingFromPreviousMonths + data.incomeStatement.amountReceivedPrevious   || 0;
        let amountReceivedPrevious = data.incomeStatement.amountReceivedPrevious || 0;
        let tobeReceivedCurrentMonth = data.incomeStatement.tobeReceivedCurrentMonth || 0;
        let amountReceivedCurrent = data.incomeStatement.amountReceivedCurrent || 0;
 
     
          this.lastMonthBalnce1 = data.monthlyBalancesStatement.previousMonthOverallBalance;
          this.lastMonthBalnce = this.formatCurrency(data.monthlyBalancesStatement.previousMonthOverallBalance) || 0;
      
       
        // Adv
         let totalAdvAmount =data.incomeStatement.totalAdvAmount || 0;
         let recivedAdvAmount= data.incomeStatement.recivedAdvAmount || 0;
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
        let overallBalance = data.monthlyBalancesStatement.overallBalance;
        this.overallBalanceRaw = this.formatCurrency(data.monthlyBalancesStatement.overallBalance)
      

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
        this.totalExpenses= this.formatCurrency(data.incomeStatement.totalExpenses);
     
        this.incomeStatementForm.patchValue({
          totalExpenses: this.formatCurrency(data.incomeStatement.totalExpenses),
          //overallBalance: this.formatCurrency(this.overallBalanceRaw),

          adBudget: this.formatCurrency(data.incomeStatement.adBudget),
          gst: this.formatCurrency(data.incomeStatement.gst),
          salaries: this.formatCurrency(data.incomeStatement.salaries),
          rent: this.formatCurrency(data.incomeStatement.rent),
          powerBill: this.formatCurrency(data.incomeStatement.powerBill),

          groceries: this.formatCurrency(data.incomeStatement.monthlyGroceriesAndEssentials),
          snacks: this.formatCurrency(data.incomeStatement.snacks),
          milk: this.formatCurrency(data.incomeStatement.milk),
          water: this.formatCurrency(data.incomeStatement.water),
          transport: this.formatCurrency(data.incomeStatement.expensesOfOperationalTransportation),

          marketing: this.formatCurrency(data.incomeStatement.marketingExpenses),
          mobileRecharges: this.formatCurrency(data.incomeStatement.mobileRecharges),
          wifiRecharges: this.formatCurrency(data.incomeStatement.wiFiRecharges),
          others: this.formatCurrency(data.incomeStatement.others),
          employeeBenefits: this.formatCurrency(data.incomeStatement.employeeBenefits),

          cashNetBalance:this.formatCurrency(data.monthlyBalancesStatement.overallCashBalance),
          currentAccountNetBalance:this.formatCurrency(data.monthlyBalancesStatement.overallCurrentAccountBalance)
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
