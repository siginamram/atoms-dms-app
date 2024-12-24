import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-operations-content-writers',
  templateUrl: './operations-content-writers.component.html',
  styleUrls: ['./operations-content-writers.component.css'],
})
export class OperationsContentWritersComponent {
  // Data and Filters
  clients = ['Client A', 'Client B', 'Client C']; // Example client list
  filteredClients: string[] = [...this.clients];
  selectedClient: string = ''; // Default selected client
  selectedMonthYear: Date | null = null;
  startAtDate = new Date();

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

  constructor(private fb: FormBuilder) {
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

  // Filter Clients
  filterClients() {
    this.filteredClients = this.clients.filter(client =>
      client.toLowerCase().includes(this.selectedClient.toLowerCase())
    );
  }

  // Filter by Month and Year
  filterByMonthYear() {
    if (this.selectedMonthYear) {
      const month = this.selectedMonthYear.getMonth();
      const year = this.selectedMonthYear.getFullYear();
      this.filteredData = this.contentWritersData.filter(data => {
        const date = new Date(data.date);
        return date.getMonth() === month && date.getFullYear() === year;
      });
    } else {
      this.filteredData = [...this.contentWritersData];
    }
    this.calculateTotals();
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
