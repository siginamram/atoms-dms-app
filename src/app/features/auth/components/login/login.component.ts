import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';

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
    private commanApiService: AuthService,
    private dialog: MatDialog,
    private location: Location
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
      8: '/home/dashboard/sl-dashboard',
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
