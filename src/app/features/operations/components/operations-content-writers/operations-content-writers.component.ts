import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-operations-content-writers',
  templateUrl: './operations-content-writers.component.html',
  styleUrls: ['./operations-content-writers.component.css'],
})
export class OperationsContentWritersComponent {
  clients = ['Client A', 'Client B', 'Client C']; // Example client list
  categories = ['Category X', 'Category Y', 'Category Z']; // Example category list
  totalPosts = 0; // Example total posts
  totalReels = 0; // Example total reels
  selectedClient: string = ''; // Default selected client
  selectedCategory: string = ''; // Default selected category
    // Dynamic counts
    brandingPosterCount = 0;
    brandingReelCount = 0;
    educationalPosterCount = 0;
    educationalReelCount = 0;
    memePosterCount = 0;
    memeReelCount = 0;
  
    // Totals
    totalPosters = 0;
  

  displayedColumns: string[] = [
    'date',
    'day',
    'speciality',
    'promotionType',
    'language',
    'creativeType',
    'edit',
    'approval',
    'remarks',
  ];
  contentWritersData: any[] = [
    {
      date: '2024-12-20',
      day: 'Monday',
      speciality: 'Speciality 1',
      promotionType: 'Branding',
      language: 'English',
      creativeType: 'Poster',
      approvalStatus: 'approved',
      remarks: 'Well done',
    },
    {
      date: '2024-12-21',
      day: 'Tuesday',
      speciality: 'Speciality 2',
      promotionType: 'Education',
      language: 'Telugu',
      creativeType: 'Graphic Reel',
      approvalStatus: 'pending',
      remarks: 'Pending review',
    },
  ];

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
      caption: [''],
    });
  }

  addNewEntry() {
    this.isPopupVisible = true;
    this.isEditMode = false;
    this.popupForm.reset();
  }

  editEntry(element: any) {
    this.isPopupVisible = true;
    this.isEditMode = true;
    this.popupForm.patchValue(element);
  }

  saveEntry() {
    if (this.popupForm.valid) {
      if (this.isEditMode) {
        const index = this.contentWritersData.findIndex(
          (entry) => entry.date === this.popupForm.value.date
        );
        this.contentWritersData[index] = this.popupForm.value;
      } else {
        this.contentWritersData.push(this.popupForm.value);
      }
      this.calculateTotals();
    }
    this.closePopup();
  }

  closePopup() {
    this.isPopupVisible = false;
  }

  filterByClient() {
    console.log('Filtering by client:', this.selectedClient);
  }

  filterByCategory() {
    console.log('Filtering by category:', this.selectedCategory);
  }

  navigateToPreviousMonth() {
    console.log('Navigate to Previous Month');
  }

  navigateToNextMonth() {
    console.log('Navigate to Next Month');
  }

  updateApproval(element: any) {
    console.log('Approval Updated:', element);
    element.approvalStatus = element.approvalStatus || 'pending';
  }

  updateRemarks(element: any) {
    console.log('Remarks Updated:', element);
  }

  calculateTotals() {
    this.totalPosts = this.contentWritersData.filter(
      (entry) => entry.creativeType === 'Poster'
    ).length;
    this.totalReels = this.contentWritersData.filter(
      (entry) => entry.creativeType === 'Graphic Reel'
    ).length;
  }
}
