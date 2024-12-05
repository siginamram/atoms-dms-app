import { Component, OnInit } from '@angular/core';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css']
})
export class LeftMenuComponent implements OnInit {
  userRoles: string[] = [];
  isMobileMenuActive = false; // Track the mobile menu visibility

  constructor(public roleService: RoleService) {}

  ngOnInit(): void {
    // Retrieve user roles from local storage
    const storedUserRoles = localStorage.getItem('userRoles');
    if (storedUserRoles) {
      this.userRoles = JSON.parse(storedUserRoles);
      this.roleService.setUserRoles(this.userRoles);
    }
  }

  // Toggle mobile menu visibility
  toggleMobileMenu() {
    this.isMobileMenuActive = !this.isMobileMenuActive;
  }
}
