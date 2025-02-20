import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  baseApiUrl: string = environment.baseApiUrl;   // retrieve the base URL from environmet.ts
  constructor(private http: HttpClient) { }

  
  employeeLeaveRequest(payload: any): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Employee/employeeLeaveRequest`;
    // Set responseType to 'text' since the API returns plain text
    return this.http.post(apiUrl, payload, { responseType: 'text' as 'json' });
  }
  
  UpdateContentWriterTracker(payload: any): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/UpdateContentWriterTracker`;
    // Set responseType to 'text' since the API returns plain text
    return this.http.post(apiUrl, payload, { responseType: 'text' as 'json' });
  }

  getClientsByContentWriter(userId: number, date: string): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Operations/ClientsByContentWriter/${userId}/${date}`;
    return this.http.get(apiUrl);
  }
}
