import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-income-statement',
  standalone: false,
  templateUrl: './income-statement.component.html',
  styleUrls: ['./income-statement.component.css']
})
export class IncomeStatementComponent implements OnInit {

  fromDate = new FormControl(moment().startOf('month')); // First day of the current month
  toDate = new FormControl(moment().endOf('month')); // Last day of the current month

  incomeStatementForm: FormGroup = new FormGroup({
    pendingCurrentPeriod: new FormControl({ value: '',  disabled: false }),
    pendingPastMonth: new FormControl({ value: '',  disabled: false }),
    totalRevenue: new FormControl({ value: '',  disabled: false }),
    totalExpenses: new FormControl({ value: '',  disabled: false }),
    overallBalance: new FormControl({ value: '',  disabled: false }),

    // Expenses Breakdown
    adBudget: new FormControl({ value: '',  disabled: false }),
    gst: new FormControl({ value: '',  disabled: false }),
    salaries: new FormControl({ value: '',  disabled: false }),
    rent: new FormControl({ value: '',  disabled: false }),
    powerBill: new FormControl({ value: '',  disabled: false }),

    groceries: new FormControl({ value: '',  disabled: false }),
    snacks: new FormControl({ value: '',  disabled: false }),
    milk: new FormControl({ value: '',  disabled: false }),
    water: new FormControl({ value: '',  disabled: false }),
    transport: new FormControl({ value: '',  disabled: false }),

    marketing: new FormControl({ value: '',  disabled: false }),
    mobileRecharges: new FormControl({ value: '',  disabled: false }),
    wifiRecharges: new FormControl({ value: '',  disabled: false }),
    others: new FormControl({ value: '',  disabled: false }),
    employeeBenefits: new FormControl({ value: '',  disabled: false })
  });

  constructor() {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    const fromDateFormatted = moment(this.fromDate.value).format('YYYY-MM-DD');
    const toDateFormatted = moment(this.toDate.value).format('YYYY-MM-DD');

    console.log(`Fetching data from ${fromDateFormatted} to ${toDateFormatted}`);

    const mockData = {
      pendingCurrentPeriod: '₹50,000',
      pendingPastMonth: '₹20,000',
      totalRevenue: '₹1,00,000',
      totalExpenses: '₹60,000',
      overallBalance: '₹40,000',
      adBudget: '₹10,000',
      gst: '₹5,000',
      salaries: '₹30,000',
      rent: '₹15,000',
      powerBill: '₹2,000',
      groceries: '₹5,000',
      snacks: '₹3,000',
      milk: '₹1,500',
      water: '₹1,200',
      transport: '₹6,000',
      marketing: '₹8,000',
      mobileRecharges: '₹1,500',
      wifiRecharges: '₹1,200',
      others: '₹3,000',
      employeeBenefits: '₹5,000'
    };

    this.incomeStatementForm.patchValue(mockData);
  }
}
