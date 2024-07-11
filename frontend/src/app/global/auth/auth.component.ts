import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  standalone:true,
  imports:[CommonModule,FormsModule,RouterModule, NavbarComponent],
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoginView = true;

  // Login form fields
  emailLogin: string = '';
  passwordLogin: string = '';

  nameRegister: string = '';
  emailRegister: string = '';
  passwordRegister: string = '';
  confirmPassword: string = '';

  toggleView() {
    this.isLoginView = !this.isLoginView;
  }

  onLogin() {
    // Implement login logic here
    console.log('Login', this.emailLogin, this.passwordLogin);
  }

  onRegister() {
    // Implement registration logic here
    console.log('Register');
  }
}