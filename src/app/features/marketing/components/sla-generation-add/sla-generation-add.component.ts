import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sla-generation-add',
  templateUrl: './sla-generation-add.component.html',
  styleUrls: ['./sla-generation-add.component.css'],
})
export class SlaGenerationAddComponent {
  slaForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.slaForm = this.fb.group({
      leadName: ['', Validators.required],
      organizationDomain: ['', Validators.required],
      city: ['', Validators.required],
      district: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      pincode: ['', Validators.required],
      posterDesigns: ['', Validators.required],
      youtubeVideos: ['', Validators.required],
      reels: ['', Validators.required],
      addBudget: ['', Validators.required],
      shootOffer: ['', Validators.required],
      shootBudget: [null],
      chargePerVisit: [''],
      basePackage: ['', Validators.required],
      facebook: [false],
      instagram: [false],
      linkedin: [false],
      others: [false],
    });
  }

  onSubmit() {
    if (this.slaForm.valid) {
      console.log(this.slaForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
