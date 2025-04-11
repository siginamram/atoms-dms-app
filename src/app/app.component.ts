import { Component } from '@angular/core';
import { SessionTimeoutService } from './services/session-timeout.service';

@Component({
  standalone:false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'EmployeeManagement.UI';
  constructor(private sessionTimeoutService: SessionTimeoutService) {}
}
