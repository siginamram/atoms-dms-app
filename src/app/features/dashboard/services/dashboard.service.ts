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

  pendingPostsDashboard(userId: number, fdate: string,tdate: string,creativeTypeId:number): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Dashboard/pendingPostsDashboard/${userId}/${fdate}/${tdate}/${creativeTypeId}`;
    return this.http.get(apiUrl);
  }

  promotedPostsDashboard(userId: number, fdate: string,tdate: string,creativeTypeId:number): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Dashboard/promotedPostsDashboard/${userId}/${fdate}/${tdate}/${creativeTypeId}`;
    return this.http.get(apiUrl);
  }

  resourcesDataDashboard(roleId: number, creativeTypeId: string): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Dashboard/resourcesDataDashboard/${roleId}/${creativeTypeId}`;
    return this.http.get(apiUrl);
  }

  KTStatusDashboard(userId: number): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Dashboard/KTStatusDashboard/${userId}`;
    return this.http.get(apiUrl);
  }

  GetPosterDesignerDashboardByUser(userId: number, date: string): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Dashboard/GetPosterDesignerDashboardByUser/${userId}/${date}`;
    return this.http.get(apiUrl);
  }

  GetGraphicDesignerDashboardByMonth(userId: number, date: string): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Dashboard/GetGraphicDesignerDashboardByMonth/${userId}/${date}`;
    return this.http.get(apiUrl);
  }

  GetVideoEditorDashboardByMonth(userId: number, date: string,creativeTypeId:number): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Dashboard/GetVideoEditorDashboardByMonth/${userId}/${date}/${creativeTypeId}`;
    return this.http.get(apiUrl);
  }

  GetDMADashboardByMonth(userId: number, fdate: any,tdate: any): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Dashboard/GetDMADashboardByMonth/${userId}/${fdate}/${tdate}`;
    return this.http.get(apiUrl);
  }

  GetVideoGrapherDashboardByMonth(userId: number, date: string): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Dashboard/GetVideoGrapherDashboardByMonth/${userId}/${date}`;
    return this.http.get(apiUrl);
  }

  DMAPendingPostsDashboard(userId: number,  fdate: any,tdate: any,creativeTypeId:number): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Dashboard/DMAPendingPostsDashboard/${userId}/${fdate}/${tdate}/${creativeTypeId}`;
    return this.http.get(apiUrl);
  }

  DMAPromotedPostsDashboard(userId: number, fdate: any,tdate: any,creativeTypeId:number): Observable<any> {
    const apiUrl = `${this.baseApiUrl}/api/Dashboard/DMAPromotedPostsDashboard/${userId}/${fdate}/${tdate}/${creativeTypeId}`;
    return this.http.get(apiUrl);
  }
}
