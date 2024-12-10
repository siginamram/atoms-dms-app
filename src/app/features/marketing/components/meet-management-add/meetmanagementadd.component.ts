import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-meetmanagementadd',
  templateUrl: './meetmanagementadd.component.html',
  styleUrls: ['./meetmanagementadd.component.css'],
})
export class MeetmanagementaddComponent {
  meetForm: FormGroup;
  uploadedImage: string | ArrayBuffer | null = null; // For previewing uploaded image

  constructor(private fb: FormBuilder) {
    this.meetForm = this.fb.group({
      leadName: ['', Validators.required],
      meetStatus: ['', Validators.required],
      travellingDuration: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      selfie: ['', Validators.required], // Add validation for selfie
      waitingTime: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      meetTime: ['', Validators.required],
      leadStatus: ['', Validators.required],
      longitudes: ['', Validators.required],
      latitudes: ['', Validators.required],
      nextMeetDate: ['', Validators.required],
      nextMeetTime: ['', Validators.required],
      nextMeetRequired: ['', Validators.required],
      insight: ['', Validators.maxLength(500)],
    });
  }

  // Handle image upload
  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.uploadedImage = reader.result; // Display the preview
      };
      reader.readAsDataURL(file);
      this.meetForm.patchValue({ selfie: file.name }); // Update the form control
    }
  }

  onSubmit() {
    if (this.meetForm.valid) {
      console.log('Form Submitted', this.meetForm.value);
      alert('Meet details saved successfully!');
      this.meetForm.reset();
      this.uploadedImage = null; // Clear the image preview
    } else {
      alert('Please fill all required fields correctly.');
    }
  }
}
