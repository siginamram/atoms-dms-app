import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username:any = ""; // Replace with your actual username
  constructor() { }

  ngOnInit(): void {
    // Retrieve user roles from local storage
    this.username = localStorage.getItem('Username');
  }

}
