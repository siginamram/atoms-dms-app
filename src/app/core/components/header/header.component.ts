import { Component, OnInit } from '@angular/core';
//import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone:false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

 
  username:any = ""; // Replace with your actual username

  constructor() {}

  logout() {
    //this.authService.logout(); // Implement your logout logic
  }
  ngOnInit(): void {
        // Retrieve user roles from local storage
        this.username = localStorage.getItem('Username');
      //this.username ="Krish Siginam";
  }

}
