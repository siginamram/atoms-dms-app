import { Component } from '@angular/core';

@Component({
  selector: 'app-video-editer-dashboard',
  standalone:false,
  templateUrl: './video-editer-dashboard.component.html',
  styleUrl: './video-editer-dashboard.component.css'
})
export class VideoEditerDashboardComponent {
  activeTab: string = 'graphic'; // Default active tab
}
