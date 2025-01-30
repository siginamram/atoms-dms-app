import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginObj: any = {
    UserName: '',
    Password: ''
  };
  showSpinner: boolean = false;
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private commanApiService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // Any initialization logic if required
  }

  onLogin() {
    this.showSpinner = true;

    // Clear localStorage before login
    localStorage.clear();

    // Call the API with the login credentials
    this.commanApiService.UserLogin(this.loginObj).subscribe(
      (res: any) => {
        console.log('API Response:', res);

        if (res) {
          // Save user data in localStorage
          localStorage.setItem('UserID', res.userID);
          localStorage.setItem('Username', res.userName);
          localStorage.setItem('userRoles', JSON.stringify(res.roleName));
          localStorage.setItem('RoleId', JSON.stringify(res.roleID));

          // Navigate based on the role
          this.navigateBasedOnRole(res.roleID);

          this.showSpinner = false;
        } else {
          this.openAlertDialog(
            'Error',
            'Invalid Login Credentials. Please try again.',
            'error'
          );
          console.error('Invalid Login Credentials. Please try again.');
          this.showSpinner = false;
        }
      },
      (error) => {
        // Handle error
        this.openAlertDialog(
          'Error',
          `Login Error: ${error.error}`,
          'error'
        );
        console.error('Login Error:', error);
        this.showSpinner = false;
      }
    );
  }

  navigateBasedOnRole(roleID: number) {
    // Dynamically navigate based on roleID
    if (roleID === 1) {
      console.log('Navigating to Admin Dashboard');
      this.router.navigateByUrl('/home/admin-dashboard');
    } else if (roleID === 2) {
      console.log('Navigating to Manager Dashboard');
      this.router.navigateByUrl('/home/dashboard/manager-dashboard');
    } else if (roleID === 3) {
      console.log('Navigating to Team Lead Dashboard');
      this.router.navigateByUrl('/home/dashboard/lead-dashboard');
    } else if (roleID === 10) {
      console.log('Navigating to Employee Dashboard');
      this.router.navigateByUrl('/home/dashboard/cw-dashboard');
    } 
   else if (roleID === 11) {
    console.log('Navigating to Employee Dashboard');
    this.router.navigateByUrl('/home/dashboard/pd-dashboard');
  } 
  else if (roleID === 13) {
    console.log('Navigating to Employee Dashboard');
    this.router.navigateByUrl('/home/dashboard/pg-dashboard');
  } 
  else if (roleID === 9) {
    console.log('Navigating to Employee Dashboard');
    this.router.navigateByUrl('/home/dashboard/dma-dashboard');
  } 
    else if (roleID === 8) {
      console.log('Navigating to Employee Dashboard');
      this.router.navigateByUrl('/home/dashboard/sl-dashboard');
    } 
    else if (roleID === 7) {
      console.log('Navigating to Employee Dashboard');
      this.router.navigateByUrl('/home/dashboard/sa-dashboard');
    } 
    else {
      console.log('Navigating to Default Dashboard');
      this.router.navigateByUrl('/home/dashboard');
    }
  }

  openAlertDialog(title: string, message: string, type: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: {
        title,
        message,
        type
      }
    });
  }
}
