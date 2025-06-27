// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'loginToken';

  constructor(private router: Router) {}

  // ✅ Save the token to localStorage
 setToken(token: string): void {
  localStorage.setItem(this.TOKEN_KEY, token);
  console.log('[AuthService] Token stored:', token);
}

  // ✅ Get token and validate expiry using jwt-decode
 getToken(): string | null {
  const token = localStorage.getItem(this.TOKEN_KEY);
  if (!token) {
    console.warn('[AuthService] No token found');
    return null;
  }

  try {
    const decoded: any = jwtDecode(token);
    const exp = decoded.exp * 1000;
    if (Date.now() > exp) {
      console.warn('[AuthService] Token expired');
      this.logout();
      return null;
    }
    return token;
  } catch (e) {
    console.error('[AuthService] Invalid token', e);
    this.logout();
    return null;
  }
}


  // ✅ Check login status
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // ✅ Clear token and redirect
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/auth/login']);
  }

  // ✅ (Optional) Decode user info
  getUserInfo(): any {
    const token = this.getToken();
    return token ? jwtDecode(token) : null;
  }
}
