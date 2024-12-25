import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Moment } from 'moment';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { Router } from '@angular/router';
import { OperationsService } from '../../services/operations.service';
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
  selector: 'app-operations-content-writers',
  standalone: false,
  templateUrl: './operations-content-writers.component.html',
  styleUrls: ['./operations-content-writers.component.css'],
  providers: [provideMomentDateAdapter(MY_FORMATS)],
  //encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperationsContentWritersComponent {
  // Data and Filters
  selectedClient: string = ''; // Default selected client
  selectedMonthYear: Date | null = null;
  startAtDate = new Date();
  leads: any[] = [];
  searchTerm: string = '';
  formattedMonthYear: string = '';
  readonly date = new FormControl(moment());
  // Metrics
  brandingPosterCount = 0;
  brandingReelCount = 0;
  educationalPosterCount = 0;
  educationalReelCount = 0;
  memePosterCount = 0;
  memeReelCount = 0;

  totalPosters = 0;
  totalReels = 0;

  // Table Data
  contentWritersData = [
    {
      date: '2024-12-20',
      day: 'Monday',
      speciality: 'Speciality 1',
      promotionType: 'Branding',
      language: 'English',
      creativeType: 'Poster',
      approvalStatus: false,
      remarks: 'Pending review',
    },
    {
      date: '2024-12-21',
      day: 'Tuesday',
      speciality: 'Speciality 2',
      promotionType: 'Education',
      language: 'Telugu',
      creativeType: 'Reel',
      approvalStatus: true,
      remarks: 'Approved',
    },
  ];

  filteredData = this.contentWritersData;

  displayedColumns: string[] = [
    'date',
    'day',
    'speciality',
    'promotionType',
    'language',
    'creativeType',
    'approval',
    'remarks',
    'edit',
  ];

  // Popup Management
  isPopupVisible = false;
  isEditMode = false;
  popupForm: FormGroup;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private router: Router, private operationsService: OperationsService) {
    this.popupForm = this.fb.group({
      date: [''],
      day: [''],
      speciality: [''],
      promotionType: [''],
      language: [''],
      creativeType: [''],
      approvalStatus: [false],
      remarks: [''],
    });
  }

  // Filter leads for autocomplete
  filterSearch(): void {
    const searchTerm = this.searchTerm.toLowerCase();
    this.leads = this.leads.filter((lead) =>
      lead.organizationName.toLowerCase().includes(searchTerm)
    );
  }

  // Filter leads by selected client ID
  filterLeads(selectedLeadId: number): void {
    const selectedLead = this.leads.find((lead) => lead.leadId === selectedLeadId);
    if (selectedLead) {
      this.searchTerm = selectedLead.organizationName;
      //this.dataSource1.data = [selectedLead];
    } else {
      //this.dataSource1.data = this.leads;
    }
  }


  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>): void {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  onMonthYearSelected(event: moment.Moment, datepicker: any): void {
    if (event && event.isValid && event.isValid()) {
      // Format the selected date as MM/YYYY
      this.formattedMonthYear = event.format('MM/YYYY');
      console.log('Selected Month/Year:', this.formattedMonthYear);

      // Close the datepicker
      datepicker.close();

      // Trigger Angular change detection
      this.cdr.detectChanges();
    } else {
      console.error('Invalid date selected:', event);
    }
  }

  // Calculate Totals
  calculateTotals() {
    this.totalPosters = this.filteredData.filter(item => item.creativeType === 'Poster').length;
    this.totalReels = this.filteredData.filter(item => item.creativeType === 'Reel').length;

    this.brandingPosterCount = this.filteredData.filter(
      item => item.promotionType === 'Branding' && item.creativeType === 'Poster'
    ).length;

    this.brandingReelCount = this.filteredData.filter(
      item => item.promotionType === 'Branding' && item.creativeType === 'Reel'
    ).length;

    this.educationalPosterCount = this.filteredData.filter(
      item => item.promotionType === 'Education' && item.creativeType === 'Poster'
    ).length;

    this.educationalReelCount = this.filteredData.filter(
      item => item.promotionType === 'Education' && item.creativeType === 'Reel'
    ).length;

    this.memePosterCount = this.filteredData.filter(
      item => item.promotionType === 'Meme' && item.creativeType === 'Poster'
    ).length;

    this.memeReelCount = this.filteredData.filter(
      item => item.promotionType === 'Meme' && item.creativeType === 'Reel'
    ).length;
  }

  // Add New Entry
  addNewEntry() {
    this.isPopupVisible = true;
    this.isEditMode = false;
    this.popupForm.reset();
  }

  // Edit Entry
  editEntry(element: any) {
    this.isPopupVisible = true;
    this.isEditMode = true;
    this.popupForm.patchValue(element);
  }

  // Save Entry
  saveEntry() {
    if (this.popupForm.valid) {
      if (this.isEditMode) {
        const index = this.contentWritersData.findIndex(
          entry => entry.date === this.popupForm.value.date
        );
        this.contentWritersData[index] = this.popupForm.value;
      } else {
        this.contentWritersData.push(this.popupForm.value);
      }
      this.calculateTotals();
      this.closePopup();
    }
  }

  // Close Popup
  closePopup() {
    this.isPopupVisible = false;
  }

  // Update Approval Status
  updateApproval(element: any) {
    element.approvalStatus = !element.approvalStatus;
  }

  // Update Remarks
  updateRemarks(element: any) {
    console.log('Updated remarks:', element.remarks);
  }
}
