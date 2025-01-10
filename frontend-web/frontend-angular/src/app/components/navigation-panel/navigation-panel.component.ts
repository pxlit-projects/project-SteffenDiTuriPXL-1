import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navigation-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation-panel.component.html',
  styleUrl: './navigation-panel.component.css'
})
export class NavigationPanelComponent {
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  // Navigate to a specific route
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  // Check if a given route is active
  isActive(route: string): boolean {
    // Compare the current URL path with the route
    return this.router.url === route;
  }

  // Check if the current route is the login page
  isLoginPage(): boolean {
    return this.router.url === '/';
  }
}
