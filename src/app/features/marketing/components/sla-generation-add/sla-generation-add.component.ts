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
      clientName: ['', Validators.required],
      designation: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
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
      youtube: [false],
      others: [false],
      otherPlatforms: [''], // To store the value of the "Other Platforms" field
    });

    // Update validators dynamically for "otherPlatforms"
    this.slaForm.get('others')?.valueChanges.subscribe((othersSelected) => {
      if (othersSelected) {
        this.slaForm.get('otherPlatforms')?.setValidators(Validators.required);
      } else {
        this.slaForm.get('otherPlatforms')?.clearValidators();
      }
      this.slaForm.get('otherPlatforms')?.updateValueAndValidity();
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
