import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  baseApiUrl: string = environment.baseApiUrl;   // retrieve the base URL from environmet.ts
  private triggerDocument = new Subject<any>();
  data$ = this.triggerDocument.asObservable();

constructor(private http: HttpClient) { }

 // Get all countries
  getAllEmployeesList(): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/api/Employee/getActiveEmployeesList`);
  }

  
 // Get all Deparments
 getAllDepartments(): Observable<any> {
  return this.http.get(`${this.baseApiUrl}/api/MasterData/getAllDepartments`);
}

 // Get all Rolles
 getAllRolls(): Observable<any> {
  return this.http.get(`${this.baseApiUrl}/api/MasterData/getAllRoles`);
}

 // submit add empolyee
addEmployee(payload: any): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Employee/addEmployee`;
  return this.http.post(apiUrl, payload);
}
// get User Id by details
getProfileDetailsbyEmpId(employeeId: number): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Employee/GetProfileDetailsByEmployeeId/${employeeId}`;
  return this.http.get(apiUrl);
}
 // Update empolyee Details
 UpdateEmployee(payload: any): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Employee/UpdateProfileDetails`;
  return this.http.post(apiUrl, payload, { responseType: 'text' as 'json' });
}
}
