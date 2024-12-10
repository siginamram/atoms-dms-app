import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { EmployeesService } from 'src/app/services/employees.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginObj: any = {
    "emailId": "",
    "password": "",
    "role": "0",
    "rememberMe": false
  };

  errorMessage: string = '';

  constructor(
    private http: HttpClient, 
    private router: Router,
    private commanApiService: EmployeesService
  ) { }

  ngOnInit() {
    // You can add any initialization logic if required
    this.onLogin()
  }

  onLogin() {
    //debugger;
    if (this.loginObj.emailId === 'admin' && this.loginObj.password === 'admin123') {
      console.log('Login successful');
      this.router.navigateByUrl('/home/dashboard');
    } else {
      //this.errorMessage = 'Invalid credentials';
    }

    // Example API call logic:
    // this.commanApiService.CheckLogin(this.loginObj).subscribe((res: any) => {
    //   if (res.data.firstName) {
    //     localStorage.setItem('Username', res.data.firstName);
    //     localStorage.setItem('userRoles', JSON.stringify(res.data.role));
    //     this.router.navigateByUrl('/home');
    //     alert('login Success');
    //   } else {
    //     alert("login Failed");
    //   }
    // });
  }
}

