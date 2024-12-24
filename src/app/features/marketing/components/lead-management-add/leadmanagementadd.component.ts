import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { MarketingService } from '../../services/marketing.service';

@Component({
  selector: 'app-leadmanagementadd',
  standalone:false,
  templateUrl: './leadmanagementadd.component.html',
  styleUrls: ['./leadmanagementadd.component.css'],
})
export class LeadmanagementaddComponent implements OnInit {
  leadForm: FormGroup;
  countries: { id: number; name: string }[] = [];
  filteredStates: { id: number; name: string }[] = [];
  filteredDistricts: { id: number; name: string }[] = [];
  filteredCities: { id: number; name: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private commanApiService: MarketingService,
    private dialog: MatDialog // Inject MatDialog
  ) {
    this.leadForm = this.fb.group({
      organizationName: ['', [Validators.required, Validators.minLength(3)]],
      domain: ['', Validators.required],
      date: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      district: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      pocName: ['', Validators.required],
      pocContact: ['', [Validators.required, Validators.pattern('^\\d{10}$')]],
      pocDesignation: ['', Validators.required],
      referredBy: ['', Validators.required],
      status: ['', Validators.required],
      insight: [''],
    });
  }

  ngOnInit(): void {
    this.loadCountries();
  }

  // Load countries from the API
  loadCountries() {
    this.commanApiService.getAllCountries().subscribe(
      (data: any) => {
        this.countries = data.map((country: any) => ({
          id: country.countryID,
          name: country.countryName,
        }));
      },
      (error) => {
        this.openAlertDialog('Error', 'Failed to load countries. Please try again.', 'error');
      }
    );
  }

  // Handle country change and load states
  onCountryChange(countryId: number) {
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
        this.openAlertDialog('Error', 'Failed to load states. Please try again.', 'error');
      }
    );
  }

  // Handle state change and load districts
  onStateChange(stateId: number) {
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
        this.openAlertDialog('Error', 'Failed to load districts. Please try again.', 'error');
      }
    );
  }

  // Handle district change and load cities
  onDistrictChange(districtId: number) {
    this.commanApiService.getCitiesByDistrict(districtId).subscribe(
      (data: any) => {
        this.filteredCities = data.map((city: any) => ({
          id: city.cityID,
          name: city.cityName,
        }));
        this.leadForm.patchValue({ city: '' });
      },
      (error) => {
        this.openAlertDialog('Error', 'Failed to load cities. Please try again.', 'error');
      }
    );
  }

  // Handle form submission
  onSubmit() {
    if (this.leadForm.valid) {
      const userID = parseInt(localStorage.getItem('UserID') || '0', 10);
      const formValues = this.leadForm.value;

      const payload = {
        OrganizationName: formValues.organizationName,
        Domain: formValues.domain,
        Date: formValues.date,
        CityID: formValues.city,
        Address: formValues.address,
        ReferredBy: formValues.referredBy,
        POCName: formValues.pocName,
        POCContact: formValues.pocContact,
        POCDesignation: formValues.pocDesignation,
        Status: parseInt(formValues.status, 10),
        Insight: formValues.insight,
        SalesPersonID: userID,
      };

      this.commanApiService.addLead(payload).subscribe(
        (response) => {
          this.openAlertDialog('Success', 'Lead saved successfully!', 'success');
          this.router.navigate(['/home/marketing/lead-management']);
          this.leadForm.reset();
        },
        (error) => {
          this.openAlertDialog('Error', 'Failed to save lead. Please try again.', 'error');
        }
      );
    } else {
      this.openAlertDialog('Error', 'Please fill all required fields correctly.', 'error');
    }
  }

  // Open the alert dialog dynamically
  openAlertDialog(title: string, message: string, type: string): void {
    this.dialog.open(AlertDialogComponent, {
      data: {
        title,
        message,
        type,
      },
    });
  }
}
