// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'loginToken';
  private readonly EXPIRATION_KEY = 'tokenExpiration';

  constructor(private router: Router) { }

  setToken(token: string, expiration: number): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.EXPIRATION_KEY, expiration.toString());
  }

  getToken(): string | null {
    const expiration = localStorage.getItem(this.EXPIRATION_KEY);
    if (expiration && new Date().getTime() > +expiration) {
      this.logout();
      return null;
    }
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EXPIRATION_KEY);
    this.router.navigate(['/auth/login']);
  }
}
