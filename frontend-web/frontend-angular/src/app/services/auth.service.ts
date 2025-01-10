import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: { username: string; role: string } | null = null;

  // Set user in memory and optionally persist to local/session storage
  setUser(username: string, role: string): void {
    this.user = { username, role };
    sessionStorage.setItem('user', JSON.stringify(this.user));
  }

  // Retrieve the user from memory or storage
  getUser(): { username: string; role: string } | null {
    if (!this.user) {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
      }
    }
    return this.user;
  }

  clearUser(): void {
    this.user = null;
    sessionStorage.removeItem('user');
  }
}
