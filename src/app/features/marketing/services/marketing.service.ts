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

 // API to get client details by Lead ID
 getClientByLeadId(leadId: number): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Client/ClientByLeadId/${leadId}`;
  return this.http.get(apiUrl);
}

addClient(payload: any): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Client/addClient`;
  return this.http.post(apiUrl, payload);
}
// Fetch leads by User ID
getLeadsByUserId(userId: number): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Sales/leadsByUserId/${userId}`;
  return this.http.get(apiUrl);
}

// Fetch meeting history by Lead ID
getMeetingHistoryByLeadId(leadId: number): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Sales/meetingHistoryByLeadId/${leadId}`;
  return this.http.get(apiUrl);
} 
getQuoteByUserId(userId: number): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Sales/quotationByUser/${userId}`;
  return this.http.get(apiUrl);
}
getQuoteByLeadId(leadId: number): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Sales/quotationByLead/${leadId}`;
  return this.http.get(apiUrl);
}
saveQuote(payload: any): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Sales/saveQuotation`;
  return this.http.post(apiUrl, payload);
}
GetClientKTStatus (userId: number): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Client/clientKTStatus/${userId}`;
  return this.http.get(apiUrl);
}
managerlistByRoleID (roleId: number): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/User/userByRoleID/${roleId}`;
  return this.http.get(apiUrl);
}
teamleadByManager(managerId: number, roleId: number): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/User/teamMembersByManager/${managerId}/${roleId}`;
  return this.http.get(apiUrl);
}
updateClientKTStatus(payload: any): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Client/updateClientKTStatus`;
  return this.http.post(apiUrl, payload);
}
GetclientKTStatusByClientId (clientID: number): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Client/clientKTStatusByClientId/${clientID}`;
  return this.http.get(apiUrl);
}

}
