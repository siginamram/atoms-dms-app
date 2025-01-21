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
  getMonthlyTrackerData(clientId: number, date: string,forecast: number): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/contentWriterMonthlyTracker/${clientId}/${date}/${forecast}`;
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

  getClientsByGraphicReelEditor(userId: number, date: string): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/ClientsByGraphicReelEditor/${userId}/${date}`;
    return this.http.get(apiUrl);
  }
  
  getclientsByVideoEditor(userId: number, date: string): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/clientsByVideoEditor/${userId}/${date}`;
    return this.http.get(apiUrl);
  }

  videoEditorMonthlyTracker(clientId: number, date: string): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/videoEditorMonthlyTracker/${clientId}/${date}`;
    return this.http.get(apiUrl);
  }
  
  UpdateClientMonthlyVideoURL(payload: any): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/UpdateClientMonthlyVideoURL`;
    return this.http.post(apiUrl, payload, { responseType: 'text' as 'json' });
  }

  ShootHistoryByMonth(date: string): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/ShootHistoryByMonth/${date}`;
    return this.http.get(apiUrl);
  }

  scheduleMeetingForShoot(type: number): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/scheduleMeetingForShoot/${type}`;
    return this.http.get(apiUrl);
  }

  photoGrapherScheduleMeet(payload: any): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/photoGrapherScheduleMeet`;
    return this.http.post(apiUrl, payload, { responseType: 'text' as 'json' });
  }

  photoGrapherRescheduleMeet(payload: any): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/photoGrapherRescheduleMeet`;
    return this.http.post(apiUrl, payload, { responseType: 'text' as 'json' });
  }
  photoGrapherCompleteMeet(payload: any): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/photoGrapherCompleteMeet`;
    return this.http.post(apiUrl, payload, { responseType: 'text' as 'json' });
  }

  DMAMonthlyTracker(clientId: number, date: string): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/DMAMonthlyTracker/${clientId}/${date}`;
    return this.http.get(apiUrl);
  }

  UpdatePostScheduleDate(payload: any): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/UpdatePostScheduleDate`;
    return this.http.post(apiUrl, payload, { responseType: 'text' as 'json' });
  }

  UpdatePostStatus(payload: any): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/UpdatePostStatus`;
    return this.http.post(apiUrl, payload, { responseType: 'text' as 'json' });
  }

  contentApprovalRequests(userId: number, date: string): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/contentApprovalRequests/${userId}/${date}`;
    return this.http.get(apiUrl);
  }

  graphicApprovalRequests(userId: number, date: string,creativeType:number): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/graphicApprovalRequests/${userId}/${date}/${creativeType}`;
    return this.http.get(apiUrl);
  }

  UpdateApprovalStatus(payload: any): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/UpdateApprovalStatus`;
    return this.http.post(apiUrl, payload, { responseType: 'text' as 'json' });
  }
  
  videoEditorApprovalRequests(userId: number, date: string): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/videoEditorApprovalRequests/${userId}/${date}`;
    return this.http.get(apiUrl);
  }

  GetShootOfferdClients(): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Client/GetShootOfferdClients`;
    return this.http.get(apiUrl);
  }

  getClientsByUser (userId: number): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Client/ClientsByUser/${userId}`;
    return this.http.get(apiUrl);
  }

  ClientsByDMA(userId: number, date: string): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/ClientsByDMA/${userId}/${date}`;
    return this.http.get(apiUrl);
  }

  contentApprovalHistory(userId: number, date: string): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/contentApprovalHistory/${userId}/${date}`;
    return this.http.get(apiUrl);
  }

  graphicApprovalHistory(userId: number, date: string,creativeType:number): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/graphicApprovalHistory/${userId}/${date}/${creativeType}`;
    return this.http.get(apiUrl);
  }

  videoEditorApprovalHistory(userId: number, date: string): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/videoEditorApprovalHistory/${userId}/${date}`;
    return this.http.get(apiUrl);
  }


  getAdCampaignByMonthAndUserId(employeeId: number, date: string): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Client/AdCampaignByMonthAndUserId`;
    const payload = {
      employeeId,
      date: date || null // Use null if date is not provided
    };
    return this.http.post(apiUrl, payload);
  }
  
  updateAdCampaignItem(payload: any): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Client/updateAdCampaignItem`;
    // Set responseType to 'text' since the API returns plain text
    return this.http.post(apiUrl, payload, { responseType: 'text' as 'json' });
  }

  GetAdCampaignItemsByClientIdAndMonth(clientId: number, from: any,to:any): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Client/GetAdCampaignItemsByClientIdAndMonth`;
    const payload = {
      clientId,
      from,
      to
    };
    return this.http.post(apiUrl, payload);
  }
}
