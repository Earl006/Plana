import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service'; 
import { Router } from '@angular/router';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  standalone:true,
  imports:[ReactiveFormsModule, NavbarComponent, CommonModule],
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: FormGroup | undefined;
  successMessage: string = '';
  errorMessage: string = '';
  userId: string = '';

  constructor(private fb: FormBuilder,private authService: AuthService,private router: Router
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId()!; 
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.passwordForm && this.passwordForm.valid) {
      const token = localStorage.getItem('authToken');
      if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        return;
      }else{
        const changePasswordRequest = {
          userId: this.userId,
          oldPassword: this.passwordForm.value.oldPassword,
          newPassword: this.passwordForm.value.newPassword
        };
        
        this.authService.changePassword(changePasswordRequest, token ?? '').subscribe(response => {
          this.successMessage = 'Password changed successfully';
          this.errorMessage = '';
          this.passwordForm?.reset();
          setTimeout(() => {
            this.clearMessages();
            this.router.navigate(['/home']);
          }, 5000);
        }, error => {
          this.errorMessage = error.error.error;
          setTimeout(() => {
            this.clearMessages();
          }, 5000);
        });
        
      }
      
      this.passwordForm.reset();
    }
  }

  clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
