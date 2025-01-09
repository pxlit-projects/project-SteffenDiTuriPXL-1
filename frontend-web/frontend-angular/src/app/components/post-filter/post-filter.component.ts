import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-filter.component.html',
  styleUrl: './post-filter.component.css'
})
export class PostFilterComponent {
  @Output() filterChanged = new EventEmitter<string>();

  onFilterChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.filterChanged.emit(inputElement.value);
  }
}
