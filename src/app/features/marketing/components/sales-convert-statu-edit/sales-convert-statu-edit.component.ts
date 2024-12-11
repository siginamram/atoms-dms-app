import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sales-convert-statu-edit',
  templateUrl: './sales-convert-statu-edit.component.html',
  styleUrls: ['./sales-convert-statu-edit.component.css']
})
export class SalesConvertStatuEditComponent implements OnInit {
  progressForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.progressForm = this.fb.group({
      operationsManager: ['', Validators.required],
      operationsLead: ['', Validators.required],
      contactNumberManager: ['', Validators.required],
      contactNumberLead: ['', Validators.required],
      ktStatus: ['', Validators.required],
      ktDate: ['', Validators.required],
      paymentStatus: ['', Validators.required],
      advanceDate: [''],
      posterDesigns: ['', Validators.required],
      youtubeVideos: ['', Validators.required],
      reels: ['', Validators.required],
      addBudget: ['', Validators.required],
      shootOffer: ['', Validators.required],
      shootBudget: ['', Validators.required],
      chargePerVisit: ['', Validators.required],
      basePackage: ['', Validators.required],
      slaUpload: [null, Validators.required]
    });
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    console.log('Uploaded File:', file);
    this.progressForm.patchValue({ slaUpload: file });
  }

  onSubmit() {
    if (this.progressForm.valid) {
      console.log('Form Data:', this.progressForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
