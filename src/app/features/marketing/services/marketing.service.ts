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

updateLeadStatus(payload: { leadID: number; salesPersonID: number; status: number }): Observable<any> {
  return this.http.post(this.baseApiUrl + '/api/Sales/updateLeadStatus', payload, {
    responseType: 'text', // Explicitly handle plain text response
  });
}

scheduleMeet(payload: any): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Sales/scheduleMeet`;
  return this.http.post(apiUrl, payload);
}

getMeetingsByUser(userId: number): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Sales/scheduleMeetingsByUser/${userId}`;
  return this.http.get(apiUrl);
}

getTentativeMeetingsByUser(userId: number): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Sales/tentativeMeetingsByUser/${userId}`;
  return this.http.get(apiUrl);
}

getMeetingDetails(meetID: number): Observable<any> {
  return this.http.get(`${this.baseApiUrl}/api/Sales/scheduleMeetingsByID/${meetID}`);
}

updateMeeting(meetingData: any): Observable<any> {
  return this.http.post(`${this.baseApiUrl}/api/Sales/updateMeetingStatus`, meetingData);
}


}
