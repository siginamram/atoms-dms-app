import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarketingService } from '../../services/marketing.service';

@Component({
  selector: 'app-leadmanagementadd',
  templateUrl: './leadmanagementadd.component.html',
  styleUrls: ['./leadmanagementadd.component.css'],
})
export class LeadmanagementaddComponent implements OnInit {
  leadForm: FormGroup;
  countries: { id: number; name: string }[] = [];
  filteredStates: { id: number; name: string }[] = [];
  filteredDistricts: { id: number; name: string }[] = [];
  filteredCities: { id: number; name: string }[] = [];

  constructor(private fb: FormBuilder, private commanApiService: MarketingService) {
    this.leadForm = this.fb.group({
      organizationName: ['', [Validators.required, Validators.minLength(3)]],
      domain: ['', Validators.required],
      date: ['', Validators.required], // Date field added
      country: ['', Validators.required],
      state: ['', Validators.required],
      district: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required], // Address field added
      pocName: ['', Validators.required],
      pocContact: ['', [Validators.required, Validators.pattern('^\\d{10}$')]], // Validates 10-digit phone number
      pocDesignation: ['', Validators.required],
      referredBy: ['', Validators.required],
      //pinCode: ['', Validators.required],
      status: ['', Validators.required],
      insight:[''],
    });
  }

  ngOnInit(): void {
    this.loadCountries(); // Load countries on initialization
  }

  // Load countries from the API
  loadCountries() {
    this.commanApiService.getAllCountries().subscribe(
      (data: any) => {
        console.log('Fetched Countries:', data);
        this.countries = data.map((country: any) => ({
          id: country.countryID,
          name: country.countryName,
        }));
      },
      (error) => {
        console.error('Error loading countries:', error);
      }
    );
  }

  // Handle country change and load states
  onCountryChange(countryId: number) {
    console.log('Selected Country ID:', countryId);
    this.commanApiService.getStatesByCountry(countryId).subscribe(
      (data: any) => {
        this.filteredStates = data.map((state: any) => ({
          id: state.stateID,
          name: state.stateName,
        }));
        this.filteredDistricts = [];
        this.filteredCities = [];
        this.leadForm.patchValue({ state: '', district: '', city: '' });
      },
      (error) => {
        console.error('Error loading states:', error);
      }
    );
  }

  // Handle state change and load districts
  onStateChange(stateId: number) {
    console.log('Selected State ID:', stateId);
    this.commanApiService.getDistrictsByState(stateId).subscribe(
      (data: any) => {
        this.filteredDistricts = data.map((district: any) => ({
          id: district.districtID,
          name: district.districtName,
        }));
        this.filteredCities = [];
        this.leadForm.patchValue({ district: '', city: '' });
      },
      (error) => {
        console.error('Error loading districts:', error);
      }
    );
  }

  // Handle district change and load cities
  onDistrictChange(districtId: number) {
    console.log('Selected District ID:', districtId);
    this.commanApiService.getCitiesByDistrict(districtId).subscribe(
      (data: any) => {
        this.filteredCities = data.map((city: any) => ({
          id: city.cityID,
          name: city.cityName,
        }));
        this.leadForm.patchValue({ city: '' });
      },
      (error) => {
        console.error('Error loading cities:', error);
      }
    );
  }

// Handle form submission
onSubmit() {
  if (this.leadForm.valid) {
    // Extract UserID from localStorage and ensure it is an integer
    const userID = parseInt(localStorage.getItem('UserID') || '0', 10);
    console.log('User ID:', userID);

    // Extract form values and create the payload
    const formValues = this.leadForm.value;

    const payload = {
      OrganizationName: formValues.organizationName,
      Domain: formValues.domain,
      Date: formValues.date,
      CityID: formValues.city, // Only passing City ID
      Address: formValues.address,
      ReferredBy: formValues.referredBy,
      POCName: formValues.pocName,
      POCContact: formValues.pocContact,
      POCDesignation: formValues.pocDesignation,
      Status: parseInt(formValues.status, 10), // Convert Status to an integer
      Insight: formValues.insight,
      SalesPersonID: userID, // Pass SalesPersonID as an integer
    };

    console.log('Payload:', payload); // Debug payload before API call

    // Call the API to save the lead
    this.commanApiService.addLead(payload).subscribe(
      (response) => {
        console.log('Lead saved successfully:', response);
        alert('Lead saved successfully!');
        this.leadForm.reset(); // Reset form after successful submission
      },
      (error) => {
        console.error('Failed to save lead:', error);
        alert('Failed to save lead. Please try again.');
      }
    );
  } else {
    console.log('Form is invalid:', this.leadForm.errors);
    alert('Please fill all required fields correctly.');
  }
}

  
}
