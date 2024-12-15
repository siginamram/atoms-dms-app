import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sales-convert-statu-edit',
  templateUrl: './sales-convert-statu-edit.component.html',
  styleUrls: ['./sales-convert-statu-edit.component.css'],
})
export class SalesConvertStatuEditComponent implements OnInit {
  progressForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.progressForm = this.fb.group({
      operationsManager: ['', Validators.required],
      operationsLead: ['', Validators.required],
      contactNumberManager: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      contactNumberLead: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      ktStatus: ['', Validators.required],
      ktDate: ['', Validators.required],
      paymentStatus: ['', Validators.required],
      advanceDate: [''],
      posterDesigns: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      youtubeVideos: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      reels: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      addBudget: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      shootOffer: ['', Validators.required],
      shootBudget: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      chargePerVisit: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      basePackage: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      slaUpload: [null, Validators.required],
    });
  }

  onFileChange(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      console.log('Selected file:', file);
    }
  }

  onSubmit() {
    if (this.progressForm.valid) {
      console.log('Form Data:', this.progressForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
