import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

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

  constructor(private fb: FormBuilder) {
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
      // Handle the request reset code logic
      console.log(this.requestCodeForm.value);
      this.isCodeRequested = true;  // Slide to the next form
    }
  }

  onResetPassword() {
    if (this.resetPasswordForm.valid) {
      // Handle the reset password logic
      console.log(this.resetPasswordForm.value);
    }
  }

}
