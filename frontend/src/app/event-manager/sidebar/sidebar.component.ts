import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  standalone:true,
  imports:[CommonModule,RouterModule],
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isExpanded = false;
  

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  logout() {
    // Implement logout logic here
    console.log('Logging out...');
  }
}