import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseApiUrl: string = environment.baseApiUrl;   // retrieve the base URL from environmet.ts
  constructor(private http: HttpClient) { }

  
  getManagerDashboardData(userId: number, fdate: string,tdate: string): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Dashboard/ManagerDashboardData/${userId}/${fdate}/${tdate}`;
    return this.http.get(apiUrl);
  }

  getOnboardByStatus(userId: number, status: number): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Client/onboardClients/${userId}/${status}`;
    return this.http.get(apiUrl);
  }

  GetStatisticsByUser(userId: number, fdate: string,tdate: string): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Dashboard/GetStatisticsByUser/${userId}/${fdate}/${tdate}`;
    return this.http.get(apiUrl);
  }

  GetcontentDashboardByUser(userId: number, date: string): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Dashboard/GetcontentDashboardByUser/${userId}/${date}`;
    return this.http.get(apiUrl);
  }
}
