import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../global/navbar/navbar.component';
import { AuthService } from '../../services/auth.service'; // Import the AuthService
import { UserService } from '../../services/user.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [CommonModule,NavbarComponent, RouterModule],
  templateUrl: './booking-success.component.html',
  styleUrl: './booking-success.component.css'
})
export class BookingSuccessComponent implements OnInit{

  userId:string=''
  email:string=''

  constructor(private authService: AuthService, private userService: UserService) {} // Inject the AuthService

  ngOnInit(): void {
      this.userId=this.authService.getUserId()!;
      this.getUserEmail()
  }

  getUserEmail(){
    this.userService.getUserById(this.userId).subscribe(
      (response)=>{
        this.email=response.email;
      }
    )
  }
}
