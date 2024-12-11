import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../../features/auth/services/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginObj: any = {
    "UserName": "",
    "Password": "",
  };

  errorMessage: string = '';

  constructor(
    private http: HttpClient, 
    private router: Router,
    private commanApiService: AuthService
  ) { }

  ngOnInit() {
    // You can add any initialization logic if required
    this.onLogin()
  }

  onLogin() {
    //debugger;
       // Example API call logic:
    // if (this.loginObj.UserName === 'admin' && this.loginObj.Password === 'admin123') {
    //   console.log('Login successful');
    //   this.router.navigateByUrl('/home/dashboard');
    // } else {
    //   this.errorMessage = 'Invalid credentials';
    // }

   // Clear localStorage before login
   localStorage.clear();
    // Call the API with the login credentials
  this.commanApiService.UserLogin(this.loginObj).subscribe(
    (res: any) => {
      console.log('API Response:', res);

      // Check if the API returned a valid response
      if (res) {
        // Save user data in localStorage (or sessionStorage for better security)
        localStorage.setItem('UserID', res.userID);
        localStorage.setItem('Username', res.userName);
        localStorage.setItem('userRoles', JSON.stringify(res.roleName));
        localStorage.setItem('RoleId', JSON.stringify(res.roleID));

        // Navigate to the dashboard
        this.router.navigateByUrl('/home/dashboard');
      } else {
        // Invalid credentials
        console.error('Invalid Login Credentials. Please try again.');
        //alert('Invalid Login Credentials. Please try again.');
      }
    },
    (error) => {
      // Handle error
      console.error('Login Error:', error);
      //alert('Login Failed. Please try again later.');
    }
  );
  }
}

