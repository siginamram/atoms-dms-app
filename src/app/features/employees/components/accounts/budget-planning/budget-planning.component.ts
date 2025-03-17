import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-budget-planning',
  standalone:false,
  templateUrl: './budget-planning.component.html',
  styleUrl: './budget-planning.component.css',
    providers: [provideMomentDateAdapter(MY_FORMATS)],
})
export class BudgetPlanningComponent implements OnInit {
  selectedMonth = new FormControl(moment()); // Default current month

  incomeStatementForm: FormGroup = new FormGroup({
    previousBalance: new FormControl({ value: '',  disabled: false}),
    amountToBeReceived: new FormControl({ value: '',  disabled: false}),
    currentMonthExpenses: new FormControl({ value: '',  disabled: false}),
    overallBalance: new FormControl({ value: '',  disabled: false}),

    // Expenses Breakdown
    adBudget: new FormControl({ value: '',  disabled: false}),
    gst: new FormControl({ value: '',  disabled: false}),
    salaries: new FormControl({ value: '',  disabled: false}),
    rent: new FormControl({ value: '',  disabled: false}),
    powerBill: new FormControl({ value: '',  disabled: false}),

    groceries: new FormControl({ value: '',  disabled: false}),
    snacks: new FormControl({ value: '',  disabled: false}),
    milk: new FormControl({ value: '',  disabled: false}),
    water: new FormControl({ value: '',  disabled: false}),
    transport: new FormControl({ value: '',  disabled: false}),

    marketing: new FormControl({ value: '',  disabled: false}),
    mobileRecharges: new FormControl({ value: '',  disabled: false}),
    wifiRecharges: new FormControl({ value: '',  disabled: false}),
    others: new FormControl({ value: '',  disabled: false}),
    employeeBenefits: new FormControl({ value: '',  disabled: false})
  });

  constructor() {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    const selectedMonthFormatted = moment(this.selectedMonth.value).format('YYYY-MM');
    console.log(`Fetching data for month: ${selectedMonthFormatted}`);

    const mockData = {
      previousBalance: '₹30,000',
      amountToBeReceived: '₹40,000',
      currentMonthExpenses: '₹60,000',
      overallBalance: '₹10,000',
      adBudget: '₹8,000',
      gst: '₹5,500',
      salaries: '₹25,000',
      rent: '₹12,000',
      powerBill: '₹2,500',
      groceries: '₹6,000',
      snacks: '₹3,500',
      milk: '₹1,800',
      water: '₹1,500',
      transport: '₹7,500',
      marketing: '₹9,500',
      mobileRecharges: '₹1,800',
      wifiRecharges: '₹1,500',
      others: '₹4,000',
      employeeBenefits: '₹6,500'
    };

    this.incomeStatementForm.patchValue(mockData);
  }
}