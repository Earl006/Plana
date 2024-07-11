import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterModule } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, NgClass]
})
export class NavbarComponent implements OnInit {
  isScrolled = false;
  isLoggedIn = true; // You should replace this with actual auth logic

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const fragment = this.router.parseUrl(this.router.url).fragment;
      if (fragment) {
        const element = document.querySelector('#' + fragment);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    });

    // Here you would typically check if the user is logged in
    // For example:
    // this.isLoggedIn = this.authService.isLoggedIn();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  logout() {
    // Implement logout logic here
    // For example:
    // this.authService.logout();
    // this.isLoggedIn = false;
    // this.router.navigate(['/']);
    console.log('Logout clicked');
  }
}