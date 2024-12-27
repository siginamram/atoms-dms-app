import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {
  baseApiUrl: string = environment.baseApiUrl;   // retrieve the base URL from environmet.ts
  constructor(private http: HttpClient) { }

  getemployeesByRoleID (roleId: number): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/User/userByRoleID/${roleId}`;
    return this.http.get(apiUrl);
  }

  getOnboardByStatus(userId: number, status: number): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Client/onboardClients/${userId}/${status}`;
    return this.http.get(apiUrl);
  }

  getclientByClientId (clientId: number): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Client/clientByClientId/${clientId}`;
    return this.http.get(apiUrl);
  }

  UpdateOnboardClient(payload: any): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Client/UpdateOnboardClient`;
    // Sending POST request with payload and expecting a text response
    return this.http.post(apiUrl, payload, { responseType: 'text' as 'json' });
  }
  
  UpdatePresentClient(payload: any): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Client/UpdatePresentClient`;
    // Sending POST request with payload and expecting a text response
    return this.http.post(apiUrl, payload, { responseType: 'text' as 'json' });
  }
  

  getClientsByContentWriter(userId: number, date: string): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/ClientsByContentWriter/${userId}/${date}`;
    return this.http.get(apiUrl);
  }
  
  AddClientEmergencyRequest(payload: any): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/AddClientEmergencyRequest`;
    // Set responseType to 'text' since the API returns plain text
    return this.http.post(apiUrl, payload, { responseType: 'text' as 'json' });
  }
  
  UpdateContentWriterTracker(payload: any): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/UpdateContentWriterTracker`;
    // Set responseType to 'text' since the API returns plain text
    return this.http.post(apiUrl, payload, { responseType: 'text' as 'json' });
  }
  getMonthlyTrackerData(clientId: number, date: string): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/contentWriterMonthlyTracker/${clientId}/${date}`;
    return this.http.get(apiUrl);
  }

  getclientDeliverablesAndPackages (clientId: number): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/clientDeliverablesAndPackages/${clientId}`;
    return this.http.get(apiUrl);
  }
  
  getAllActiveClients(): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Client/AllActiveClients`;
    return this.http.get(apiUrl);
  }

  getSpecialDaysByClient(clientId: number, year: number): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Client/specialDaysByClient/${clientId}/${year}`;
    return this.http.get(apiUrl);
  }
  
  addSpecialDay(payload: any): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Client/addSpecialDay`;
    // Set responseType to 'text' since the API returns plain text
    return this.http.post(apiUrl, payload, { responseType: 'text' as 'json' });
  }

  getClientsByGraphicDesigner(userId: number, date: string): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/ClientsByGraphicDesigner/${userId}/${date}`;
    return this.http.get(apiUrl);
  }
  
  GraphicDesignerMonthlyTracker(clientId: number, date: string,creativeType:number): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/GraphicDesignerMonthlyTracker/${clientId}/${date}/${creativeType}`;
    return this.http.get(apiUrl);
  }
  updateGraphicDesignLink(payload: any): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/UpdateGraphicDesignLink`;
    return this.http.post(apiUrl, payload, { responseType: 'text' as 'json' });
  }
  
}
