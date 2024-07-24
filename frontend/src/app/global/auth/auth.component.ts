import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // New import
import { Router } from '@angular/router';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, HttpClientModule],
  // providers: [provideHttpClient(withInterceptorsFromDi())] ,// New provider
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoginView = true;

  // Login form fields
  emailLogin: string = '';
  passwordLogin: string = '';

  // Register form fields
  firstNameRegister: string = '';
  lastNameRegister: string = '';
  emailRegister: string = '';
  phoneNumberRegister: string = '';
  passwordRegister: string = '';
  confirmPasswordRegister: string = '';

  // Messages
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  toggleView() {
    this.isLoginView = !this.isLoginView;
  }

  clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }

  onLogin(form: NgForm) {
    if (form.valid) {
      const credentials = {
        email: this.emailLogin,
        password: this.passwordLogin
      };
      this.authService.login(credentials).subscribe(
        response => {
          localStorage.setItem('authToken', response.result.token);
          localStorage.setItem('userId', response.result.user.id);
          
          
          
          this.successMessage = 'Login successful!';
          this.errorMessage = '';


  
          // Check the user's role and route accordingly
          if (response.result.user.role === 'ATTENDEE') {
            this.router.navigate(['/home']);
          } else if (response.result.user.role === 'EVENT_MANAGER') {
            this.router.navigate(['/dashboard']);
          }else if( response.result.user.role === 'ADMIN') {
            this.router.navigate(['/admin-dashboard']);
          }
           else {
            // Handle unexpected role
            console.error('Unexpected user role:', response.result.user.role);
            this.errorMessage = 'Login successful, but unable to determine user role.';
          }
        },
        error => {
          
          this.errorMessage = 'Login failed. Please check your credentials and try again.';
          this.successMessage = '';
          setTimeout(() => {
            this.clearLoginFields();
            this.clearMessages();
          }, 2000);


        }
      );
    } else {
      this.errorMessage = 'Please enter valid email and password.';
    }
  }

  onRegister(form: NgForm) {
    this.clearMessages();
    
    if (form.valid) {
      // Email validation
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailPattern.test(this.emailRegister)) {
        this.errorMessage = 'Please enter a valid email address.';

        return;
      }
  
      // Password match validation
      if (this.passwordRegister !== this.confirmPasswordRegister) {
        this.errorMessage = 'Passwords do not match.';
        return;
      }
  
      const user = {
        email: this.emailRegister,
        password: this.passwordRegister,
        firstName: this.firstNameRegister,
        lastName: this.lastNameRegister,
        phoneNumber: this.phoneNumberRegister
      };
  
      this.authService.register(user).subscribe(
        response => {
          this.successMessage = 'Registration successful!';
          this.clearFormFields();
          setTimeout(() => {
            this.toggleView();
            this.clearMessages();
          }, 2000); 
        },
        error => {
          this.errorMessage = 'Registration failed. Please try again.';
          
        }
      );
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }

  clearLoginFields() {
    this.emailLogin  = '';
    this.passwordLogin = '';
  }
  
  // New method to clear form fields
  clearFormFields() {
    this.firstNameRegister = '';
    this.lastNameRegister = '';
    this.emailRegister = '';
    this.phoneNumberRegister = '';
    this.passwordRegister = '';
    this.confirmPasswordRegister = '';
  }
}
