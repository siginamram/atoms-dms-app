import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AlertDialogComponent } from '../shared/components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class SessionTimeoutService {
  
  private timeout: any;
  //private readonly SESSION_TIMEOUT = 20 * 60 * 1000; // 20 minutes
  //private readonly SESSION_TIMEOUT = 25 * 60 * 1000; // 25 minutes
  //private readonly SESSION_TIMEOUT= 30 * 60 * 1000; // 30 minutes
  private readonly SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour

  constructor(private router: Router, private ngZone: NgZone,  private dialog: MatDialog) {
    this.initListener();
    this.resetTimer();
  }

  private initListener() {
    ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event =>
      document.addEventListener(event, () => this.resetTimer())
    );
  }

  private resetTimer() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.logout();
    }, this.SESSION_TIMEOUT);
  }

  private logout() {
    sessionStorage.clear(); // Or remove only isLoggedIn
    this.router.navigate(['/auth/login']);
    this.openAlertDialog('Error', 'Session expired due to inactivity. Please login again.');
    
    //alert('Session expired due to inactivity. Please login again.');
  }

    openAlertDialog(title: string, message: string): void {
        this.dialog.open(AlertDialogComponent, {
          width: '400px',
          data: {
            title,
            message,
            type: title.toLowerCase(), // success, error, or warning
          },
        });
      }
}
