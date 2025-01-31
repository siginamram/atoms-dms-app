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
  roleID: number | null = null; // To store the role ID from localStorage
  menuItems: any[] = []; // Menu items to display dynamically
  constructor(public roleService: RoleService) {}

  ngOnInit(): void {
    // Retrieve user roles from local storage
    const storedUserRoles = localStorage.getItem('userRoles');
    if (storedUserRoles) {
      this.userRoles = JSON.parse(storedUserRoles);
      this.roleService.setUserRoles(this.userRoles);
    }
      // Retrieve RoleId from localStorage
      const roleIdString = localStorage.getItem('RoleId');
      if (roleIdString) {
        this.roleID = JSON.parse(roleIdString);
  
        // Dynamically set the menu items based on the role ID
        this.setMenuItems(this.roleID);
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

  setMenuItems(roleID: any): void {
    if (roleID === 1) {
      this.menuItems = [
        { title: 'Dashboard', icon: 'home', route: '/home/dashboard/admin-dashboard' },
      ];
    } else if (roleID === 2) {
      this.menuItems = [
        { title: 'Dashboard', icon: 'home', route: '/home/dashboard/manager-dashboard' },
      ];
    } else if (roleID === 3) {
      this.menuItems = [
        { title: 'Dashboard', icon: 'home', route: '/home/dashboard/lead-dashboard' },
      ];
    } else if (roleID === 10) {
      this.menuItems = [
        { title: 'Dashboard', icon: 'home', route: '/home/dashboard/cw-dashboard' },
      ];
    }
     else if (roleID === 11) {
      this.menuItems = [
        { title: 'Dashboard', icon: 'home', route: '/home/dashboard/pd-dashboard' },
      ];
    } 
    else if (roleID === 12) {
      this.menuItems = [
        { title: 'Dashboard', icon: 'home', route: '/home/dashboard/video-editor-dashboard' },
      ];
    }
    else if (roleID === 13) {
      this.menuItems = [
        { title: 'Dashboard', icon: 'home', route: '/home/dashboard/pg-dashboard' },
      ];
    } 
    else if (roleID === 9) {
      this.menuItems = [
        { title: 'Dashboard', icon: 'home', route: '/home/dashboard/dma-dashboard' },
      ];
    } 
    else if (roleID === 8) {
      this.menuItems = [
        { title: 'Dashboard', icon: 'home', route: '/home/dashboard/sl-dashboard' },
      ];
    } 
    else if (roleID === 7) {
      this.menuItems = [
        { title: 'Dashboard', icon: 'home', route: '/home/dashboard/sa-dashboard' },
      ];
  
    } else {
      this.menuItems = [
        { title: 'Dashboard', icon: 'home', route: '/home/dashboard' },
      ];
    }
  }
  
}
