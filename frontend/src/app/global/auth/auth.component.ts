import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  standalone:true,
  imports:[FormsModule, CommonModule],
  styleUrls: ['./auth.component.css']
})
export class AuthComponent{
  showLogin = true;
  loginData = {
    email: '',
    password: ''
  };
  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  };

  showRegisterForm(): void {
    this.showLogin = false;
  }

  showLoginForm(): void {
    this.showLogin = true;
  }

  onLogin(form: NgForm): void {
    if (form.valid) {
      // Implement your login logic here
      console.log('Logging in with:', this.loginData);
    }
  }

  onRegister(form: NgForm): void {
    if (form.valid) {
      // Implement your register logic here
      console.log('Registering with:', this.registerData);
    }
  }
}
