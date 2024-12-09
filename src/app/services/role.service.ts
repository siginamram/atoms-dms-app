// role.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  // Define the roles here (you can adjust this as needed)
  private userRoles: string[] = [];

  constructor() {
    // You can initialize user roles here if needed
  }

  // Method to check if the user has any of the provided roles
  hasRole(roles: string[]): boolean {
    // Check if any of the provided roles match the user's roles
    return roles.some(role => this.userRoles.includes(role));
  }

  // Method to set the user roles
  setUserRoles(roles: string[]): void {
    // Set the user roles
    this.userRoles = roles;
  }

  // Method to get the user roles
  getUserRoles(): string[] {
    // Return the user roles
    return this.userRoles;
  }
}
