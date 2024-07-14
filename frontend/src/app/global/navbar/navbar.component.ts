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
  isLoggedIn = false;

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

    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const token = localStorage.getItem('authToken');
    this.isLoggedIn = !!token;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  logout() {
    localStorage.removeItem('authToken');
    this.isLoggedIn = false;
    window.location.reload();
    this.router.navigate(['/']);
  }
}