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
}
