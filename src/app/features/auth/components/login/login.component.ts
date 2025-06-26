import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import {LoginService} from 'src/app/features/auth/services/login.service';


@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginObj: any = {
    UserName: '',
    Password: '',
  };
  showSpinner: boolean = false;
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private commanApiService: LoginService,
    private dialog: MatDialog,
    private location: Location,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.disableBrowserNavigation();
  }

  onLogin() {
    this.showSpinner = true;

    // Clear localStorage before login
    localStorage.clear();

    // Call the API with the login credentials
    this.commanApiService.UserLogin(this.loginObj).subscribe(
      (res: any) => {
        console.log('API Response:', res);

        if (res?.token) {
          // Save user data in localStorage
          this.authService.setToken(res.token);
         // localStorage.setItem('authToken', res.token);
          sessionStorage.setItem('isLoggedIn', 'true');
          sessionStorage.setItem('loginTime', Date.now().toString());
          localStorage.setItem('UserID', res.userID);
          localStorage.setItem('Username', res.userName);
          localStorage.setItem('userRoles', JSON.stringify(res.roleName));
          localStorage.setItem('RoleId', JSON.stringify(res.roleID));
          localStorage.setItem('empID', res.employeeID);
          localStorage.setItem('firstName', res.firstName);
          localStorage.setItem('lastName', res.lastName);
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
      (error:any) => {
        // Handle error
        this.openAlertDialog('Error', `Login Error: ${error.error}`, 'error');
        console.error('Login Error:', error);
        this.showSpinner = false;
      }
    );
  }

  navigateBasedOnRole(roleID: number) {
    // Dynamically navigate based on roleID
    const routes: { [key: number]: string } = {
      1: '/home/admin-dashboard',
      2: '/home/dashboard/manager-dashboard',
      3: '/home/dashboard/lead-dashboard',
      10: '/home/dashboard/cw-dashboard',
      11: '/home/dashboard/pd-dashboard',
      12: '/home/dashboard/video-editor-dashboard',
      13: '/home/dashboard/pg-dashboard',
      9: '/home/dashboard/dma-dashboard',
      8: '/home/dashboard/manager-dashboard',
      7: '/home/dashboard/sa-dashboard',
    };

    const route = routes[roleID] || '/home/dashboard';
    console.log(`Navigating to ${route}`);
    this.router.navigateByUrl(route);
  }

  openAlertDialog(title: string, message: string, type: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: {
        title,
        message,
        type,
      },
    });
  }

  disableBrowserNavigation(): void {
    // Prevent back navigation
    history.pushState(null, '', window.location.href);

    window.onpopstate = () => {
      history.pushState(null, '', window.location.href);
    };

    // Prevent forward navigation
    window.onunload = () => {
      history.replaceState(null, '', window.location.href);
    };
  }
}
