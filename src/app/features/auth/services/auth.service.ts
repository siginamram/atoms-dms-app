import { HttpClient } from '@angular/common/http'; //Import this library manually, or add "typeRoots" into tsconfig.json file 
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseApiUrl : string = environment.baseApiUrl;   // retrieve the base URL from environmet.ts
  constructor(private http: HttpClient) { }

  UserLogin(post: any): Observable<any[]> {
    return this.http.post<any>(`${this.baseApiUrl}/api/User/userLogin`, post);
  }
}
