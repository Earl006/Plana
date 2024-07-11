import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  standalone:true,
  imports:[CommonModule],
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