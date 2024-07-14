import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, RouterModule, FormsModule,CommonModule, NavbarComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  requestCodeForm: FormGroup;
  resetPasswordForm: FormGroup;
  isCodeRequested = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.requestCodeForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetPasswordForm = this.fb.group({
      resetCode: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value === confirmPassword.value) {
      return null;
    } else {
      return { mismatch: true };
    }
  }

  onRequestCode() {
    if (this.requestCodeForm.valid) {
      this.authService.requestPasswordReset(this.requestCodeForm.value).subscribe(
        response => {
          this.successMessage = 'Reset code has been sent to your email';
          this.errorMessage = '';
          setTimeout(() => {
            this.clearMessages();
          },3000);
          console.log(response);
        },
        error => {
          this.errorMessage = error.error.message;
          this.successMessage = '';
          setTimeout(() => {
            this.clearMessages();
          },3000);
          console.error(error);
        }
      );
      console.log(this.requestCodeForm.value);
      this.isCodeRequested = true;  // Slide to the next form
    }
  }

  onResetPassword() {
    if (this.resetPasswordForm.valid) {
      this.authService.resetPassword(this.resetPasswordForm.value).subscribe(
        response => {
          this.successMessage = 'Password reset successfully';
          this.errorMessage = '';
          setTimeout(() => {
            this.clearMessages();
            this.router.navigate(['/login']);
          },3000);
          console.log(response);
        },
        error => {
          this.errorMessage = error.error.message;
          this.successMessage = '';
          setTimeout(() => {
            this.clearMessages();
          },3000);
          console.error(error);
        }
      );
      console.log(this.resetPasswordForm.value);
    }
  }
  clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }

}
