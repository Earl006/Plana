import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  standalone:true,
  imports:[CommonModule,RouterModule],
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  constructor(private router: Router){}

  isExpanded = false;
  

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/home']);
  }
}