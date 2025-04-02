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
        this.incomeStatementForm.patchValue({
          pendingCurrentPeriod: this.formatCurrency(data.pendingCollectionThisPeriod),
          pendingPastMonth: this.formatCurrency(data.pendingCollectionPastMonth),
          totalRevenue: this.formatCurrency(data.totalRevenueGenerated),
          totalExpenses: this.formatCurrency(data.totalExpenses),
          overallBalance: this.formatCurrency(data.overallBalanceAmount),

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
