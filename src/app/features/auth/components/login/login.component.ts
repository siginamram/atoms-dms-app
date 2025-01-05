import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../../features/auth/services/auth.service'
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  standalone:false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginObj: any = {
    "UserName": "",
    "Password": "",
  };
  showSpinner: boolean = false;

  errorMessage: string = '';

  constructor(
    private http: HttpClient, 
    private router: Router,
    private commanApiService: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    // You can add any initialization logic if required
    // this.onLogin()
  }

  onLogin() {
    this.showSpinner = true;
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
        this.showSpinner = false;
      } else {
        this.openAlertDialog('Error','Invalid Login Credentials. Please try again.', 'error')
        // Invalid credentials
        console.error('Invalid Login Credentials. Please try again.');
        //alert('Invalid Login Credentials. Please try again.');
        this.showSpinner = false;
      }
    },
    (error) => {
      // Handle error
      this.openAlertDialog('Error',`Login Error: ${error.error}`, 'error')
      console.error('Login Error:', error);
      this.showSpinner = false;
      //alert('Login Failed. Please try again later.');
    }
  );

  
  }

  openAlertDialog(title: string, message: string, type: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: {
        title,
        message,
        type,
      },
    });}
}

