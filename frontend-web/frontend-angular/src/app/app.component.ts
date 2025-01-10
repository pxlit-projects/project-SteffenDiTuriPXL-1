import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationPanelComponent } from "./components/navigation-panel/navigation-panel.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationPanelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend-angular';
}
