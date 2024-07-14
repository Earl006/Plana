import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service'; // Assuming you have AuthService
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NavbarComponent, CommonModule],
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;
  userId: string = ''; // Initialize to empty string
  managerRequestStatus: string = ''; 
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder, 
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserId()!; 
    this.loadUserData();
  }

  loadUserData() {
    this.userService.getUserById(this.userId).subscribe(user => {
      this.profileForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber
      });
      this.managerRequestStatus = user.managerRequestStatus; 
    });
  }

  sendManagerRequest() {
    this.userService.requestManagerRole(this.userId).subscribe(response => {
      this.successMessage = 'Manager request sent successfully awaiting approval from admin';
      this.errorMessage = '';
      setTimeout(() => {
        window.location.reload();
        this.clearMessages();
      },7000);
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.userService.updateUser(this.userId, this.profileForm.value).subscribe(response => {
        this.successMessage = 'Profile updated successfully';
        this.errorMessage = '';
        setTimeout(() => {
          this.clearMessages();
          this.router.navigate(['/home']);
        },2000);
        console.log('Profile updated successfully');
      });
    }
  }
  clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
