import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment'

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
employeeLeaveRequest(payload: any): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Employee/employeeLeaveRequest`;
  // Set responseType to 'text' since the API returns plain text
  return this.http.post(apiUrl, payload, { responseType: 'text' as 'json' });
}
employeeLateRequest(payload: any): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Employee/employeeLateRequest`;
  // Set responseType to 'text' since the API returns plain text
  return this.http.post(apiUrl, payload, { responseType: 'text' as 'json' });
}

// get User Id by details
GetEmpLeaveDashboard(employeeId: number): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Employee/GetEmpLeaveDashboard/${employeeId}`;
  return this.http.get(apiUrl);
}

GetApprovalLeaveRequests(empId: number, fdate: string, tdate: string): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Employee/GetApprovalLeaveRequests/${empId}/${fdate}/${tdate}`;
  return this.http.get(apiUrl);
}

GetApprovalLateRequests(empId: number, fdate: string, tdate: string): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Employee/GetApprovalLateRequests/${empId}/${fdate}/${tdate}`;
  return this.http.get(apiUrl);
}

ApproveLeaveRequest(payload: any): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Employee/ApproveLeaveRequest`;
  // Set responseType to 'text' since the API returns plain text
  return this.http.post(apiUrl, payload, { responseType: 'text' as 'json' });
}

ApproveLateRequest(payload: any): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Employee/ApproveLateRequest`;
  // Set responseType to 'text' since the API returns plain text
  return this.http.post(apiUrl, payload, { responseType: 'text' as 'json' });
}

AddUpdateExpenses(payload: any): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Account/AddUpdateExpenses`;
  return this.http.post(apiUrl, payload, { responseType: 'text' as 'json' });
}

GetExpenses(fdate: string, tdate: string): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Account/GetExpenses/${fdate}/${tdate}`;
  return this.http.get(apiUrl);
}

GetInvoicesByMonth(date: string, isApplicable: any): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Account/GetInvoicesByMonth/${date}/${isApplicable}`;
  return this.http.get(apiUrl);
}

GetPaymentCollection(date: string): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Account/GetPaymentCollection/${date}`;
  return this.http.get(apiUrl);
}

GetPaymentFollowup(invoiceNo: number): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Account/GetPaymentFollowup/${invoiceNo}`;
  return this.http.get(apiUrl);
}

UpdateInvoicePaymentFollwUp(payload: any): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Account/UpdateInvoicePaymentFollwUp`;
  return this.http.post(apiUrl, payload, { responseType: 'text' as 'json' });
}

GenerateInvoice(date: string): Observable<string> {
  const apiUrl = `${this.baseApiUrl}/api/Account/GenerateInvoice/${date}`;
  return this.http.get(apiUrl, { responseType: 'text' });
}

GetInvoiceDetailsById(invoiceNo: number): Observable<any> {
  const apiUrl = `${this.baseApiUrl}/api/Account/GetInvoiceDetailsById?invoiceId=${invoiceNo}`;
  return this.http.get(apiUrl);
}



}
