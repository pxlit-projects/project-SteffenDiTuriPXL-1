import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  role = 'user';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.setUser(this.username, this.role);
    this.router.navigate(['/dashboard']);
  }
}
