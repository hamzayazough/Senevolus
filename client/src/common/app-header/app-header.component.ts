import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss'
})
export class AppHeaderComponent {
  @Input() type: string = "default";

  constructor(
    private router : Router
  ) {}

  navigate(adress : string) {
    this.router.navigate([adress]);
  }
}
