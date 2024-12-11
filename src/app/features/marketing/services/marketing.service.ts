import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarketingService {
  baseApiUrl: string = environment.baseApiUrl;   // retrieve the base URL from environmet.ts
  constructor(private http: HttpClient) { }

  //Masters
  // Get all countries
  getAllCountries(): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/api/MasterData/getAllCountries`);
  }

  // Get states by country ID
  getStatesByCountry(countryId: number): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/api/MasterData/statesByCountry/${countryId}`);
  }

  // Get districts by state ID
  getDistrictsByState(stateId: number): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/api/MasterData/districtsByState/${stateId}`);
  }

  // Get cities by district ID
  getCitiesByDistrict(districtId: number): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/api/MasterData/citiesByDistrict/${districtId}`);
  }

  //Lead Management
  addLead(leadData: any): Observable<any> {
    return this.http.post(this.baseApiUrl + '/api/Sales/addLead', leadData);
  }

  getLeadsByStatusAndRole(userId: number, status: number): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Sales/getLeadsByStatusAndRole/${userId}/${status}`;
    return this.http.get(apiUrl);
}

}
