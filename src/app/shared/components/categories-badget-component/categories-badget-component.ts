import { Component, input } from '@angular/core';

@Component({
  selector: 'categories-badget-component',
  standalone: false,
  templateUrl: './categories-badget-component.html',
  styleUrl: './categories-badget-component.scss',
})
export class CategoriesBadgetComponent {
  public category = input.required<string>();
}
