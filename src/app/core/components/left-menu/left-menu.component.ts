import { Component, OnInit } from '@angular/core';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-left-menu',
  standalone:false,
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css']
})
export class LeftMenuComponent implements OnInit {
  userRoles: string[] = [];
  isMobileMenuActive = false; // Track the mobile menu visibility
  isDropdownActive: { [key: string]: boolean } = {}; // Store active state for each dropdown

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

  // Toggle dropdown visibility on mobile
  toggleDropdown(dropdown: string) {
    this.isDropdownActive[dropdown] = !this.isDropdownActive[dropdown];
  }
}
