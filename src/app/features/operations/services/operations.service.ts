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
    return this.http.post(apiUrl, payload);
  }

  UpdatePresentClient(payload: any): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Client/UpdatePresentClient`;
    return this.http.post(apiUrl, payload);
  }

  getClientsByContentWriter(userId: number, date: string): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/ClientsByContentWriter/${userId}/${date}`;
    return this.http.get(apiUrl);
  }
  
}
