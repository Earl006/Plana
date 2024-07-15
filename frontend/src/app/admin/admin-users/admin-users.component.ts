import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { TopbarComponent } from '../../event-manager/topbar/topbar.component';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: string;
  avatarUrl: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: 'EVENT_MANAGER' | 'ATTENDEE' | 'ADMIN';
  // Add other properties as needed
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [TopbarComponent, AdminSidebarComponent, CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedRole: string = '';
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;

  showChangeRoleModal: boolean = false;
  selectedUser: User | null = null;
  newRole: 'EVENT_MANAGER' | 'ATTENDEE' | 'ADMIN' = 'ATTENDEE';
  showDeleteConfirmModal: boolean = false;
  userToDelete: User | null = null;

  constructor(private userService: UserService) {} 

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    // Fetch users from your API
    this.userService.getAllUsers().subscribe(
      (users: User[]) => {
        this.users = users;
        this.filterUsers();
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user => 
      (this.selectedRole === '' || user.role === this.selectedRole) &&
      (user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       user.email.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
    this.currentPage = 1;
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  openChangeRoleModal(user: User) {
    this.selectedUser = user;
    this.newRole = user.role;
    this.showChangeRoleModal = true;
  }

  closeChangeRoleModal() {
    this.showChangeRoleModal = false;
    this.selectedUser = null;
  }
  openDeleteConfirmModal(user: User) {
    this.userToDelete = user;
    this.showDeleteConfirmModal = true;
  }

  closeDeleteConfirmModal() {
    this.showDeleteConfirmModal = false;
    this.userToDelete = null;
  }

  confirmDeleteUser() {
    if (this.userToDelete) {
      this.deleteUser(this.userToDelete.id);
      this.closeDeleteConfirmModal();
    }
  }
  changeUserRole() {
    if (this.selectedUser && this.newRole) {
      this.userService.changeRole(this.selectedUser.id, this.newRole).subscribe(
        () => {
          this.selectedUser!.role = this.newRole;
          this.closeChangeRoleModal();
          // Optionally, show a success message
        },
        (error) => {
          console.error('Error changing user role:', error);
          // Show an error message
        }
      );
    }
  }

  deleteUser(userId: string) {
      this.userService.deleteUser(userId).subscribe(
        () => {
          this.users = this.users.filter(user => user.id !== userId);
          this.filterUsers();
          //  show a success message
        },
        (error) => {
          console.error('Error deleting user:', error);
          // Show an error message
        }
      );
    
  }

  exportUsers() {
    // Implement user export functionality
    console.log('Exporting users...');
  }
}
