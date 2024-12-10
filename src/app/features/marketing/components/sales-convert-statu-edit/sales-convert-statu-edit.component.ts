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
      advanceDate: ['']
    });
  }

  onSubmit() {
    if (this.progressForm.valid) {
      console.log('Form Data:', this.progressForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
