import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-leadmanagementadd',
  templateUrl: './leadmanagementadd.component.html',
  styleUrls: ['./leadmanagementadd.component.css'],
})
export class LeadmanagementaddComponent {
  leadForm: FormGroup;

  countries: { id: number; name: string }[] = [
    { id: 1, name: 'India' },
    { id: 2, name: 'United States' },
  ];

  states: { id: number; name: string; countryId: number }[] = [
    { id: 1, name: 'Andhra Pradesh', countryId: 1 },
    { id: 2, name: 'Karnataka', countryId: 1 },
    { id: 3, name: 'California', countryId: 2 },
  ];

  districts: { id: number; name: string; stateId: number }[] = [
    { id: 1, name: 'Anantapur', stateId: 1 },
    { id: 2, name: 'Bangalore', stateId: 2 },
    { id: 3, name: 'Los Angeles', stateId: 3 },
  ];

  cities: { id: number; name: string; districtId: number }[] = [
    { id: 1, name: 'Hindupur', districtId: 1 },
    { id: 2, name: 'Bangalore City', districtId: 2 },
    { id: 3, name: 'Downtown LA', districtId: 3 },
  ];

  filteredStates: { id: number; name: string; countryId: number }[] = [];
  filteredDistricts: { id: number; name: string; stateId: number }[] = [];
  filteredCities: { id: number; name: string; districtId: number }[] = [];

  constructor(private fb: FormBuilder) {
    this.leadForm = this.fb.group({
      organizationName: ['', [Validators.required, Validators.minLength(3)]],
      salesperson: ['', Validators.required],
      status: ['', Validators.required],
      domain: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      district: ['', Validators.required],
      city: ['', Validators.required],
      pocName: ['', Validators.required],
      pocContact: [
        '',
        [Validators.required, Validators.pattern('^\\d{10}$')], // Validates 10-digit phone number
      ],
      pocDesignation: ['', Validators.required],
      referredBy: ['', Validators.required],
      pinCode:['', Validators.required],
      address: [''],
    });
  }

  onCountryChange(countryId: number) {
    this.filteredStates = this.states.filter((state) => state.countryId === countryId);
    this.filteredDistricts = [];
    this.filteredCities = [];
    this.leadForm.patchValue({ state: '', district: '', city: '' });
  }

  onStateChange(stateId: number) {
    this.filteredDistricts = this.districts.filter((district) => district.stateId === stateId);
    this.filteredCities = [];
    this.leadForm.patchValue({ district: '', city: '' });
  }

  onDistrictChange(districtId: number) {
    this.filteredCities = this.cities.filter((city) => city.districtId === districtId);
    this.leadForm.patchValue({ city: '' });
  }

  onSubmit() {
    if (this.leadForm.valid) {
      console.log('Form Submitted:', this.leadForm.value);
      alert('Lead saved successfully!');
      this.leadForm.reset();
    } else {
      alert('Please fill all required fields correctly.');
    }
  }

}
