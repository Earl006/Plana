import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../global/navbar/navbar.component';

@Component({
  selector: 'app-unauthrorised',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './unauthrorised.component.html',
  styleUrl: './unauthrorised.component.css'
})
export class UnauthrorisedComponent {
  constructor(private router: Router) {}

  goToHome() {
    this.router.navigate(['/home']);
  }
}
