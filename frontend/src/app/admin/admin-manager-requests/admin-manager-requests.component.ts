import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from '../../event-manager/topbar/topbar.component';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';

interface User {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  role: string;
  managerRequestStatus: string;
  createdAt: string;
}

@Component({
  selector: 'app-admin-manager-requests',
  standalone: true,
  imports: [CommonModule, TopbarComponent, AdminSidebarComponent],
  templateUrl: './admin-manager-requests.component.html',
  styleUrls: ['./admin-manager-requests.component.css']
})
export class AdminManagerRequestsComponent implements OnInit {
  pendingRequests: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadPendingRequests();
  }

  loadPendingRequests() {
    this.userService.getManagerRequests().subscribe(
      (users: User[]) => {
        this.pendingRequests = users;
      },
      (error) => {
        console.error('Error loading pending requests:', error);
      }
    );
  }

  approveRequest(userId: string) {
    this.userService.approveManagerRole(userId).subscribe(
      () => {
        this.loadPendingRequests();
      },
      (error) => {
        console.error('Error approving request:', error);
      }
    );
  }

  rejectRequest(userId: string) {
    this.userService.rejectManagerRole(userId).subscribe(
      () => {
        this.loadPendingRequests();
      },
      (error) => {
        console.error('Error rejecting request:', error);
      }
    );
  }
}