import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: { username: string; role: string } | null = null;

  setUser(username: string, role: string): void {
    this.currentUser = { username, role };
  }

  getUser(): { username: string; role: string } | null {
    return this.currentUser;
  }
}
