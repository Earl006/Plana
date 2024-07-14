import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  standalone:true,
  imports:[DatePipe, RouterModule],
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  currentDate = new Date();
  currentTime = new Date();
  greeting: string | undefined;
  managerName: string = ''; 
  userId: string = '';

  constructor(private authService: AuthService, private userService: UserService) {
    this.updateTime();
  }
  

  ngOnInit(): void {
    this.setGreeting();
    this.userId = this.authService.getUserId()!;
  }

  loadManagerName() {
    this.userService.getUserById(this.userId).subscribe(user => {
      this.managerName = user.firstName + ' ' + user.lastName;
    }
  )};

  setGreeting(): void {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      this.greeting = 'Morning';
    } else if (currentHour < 18) {
      this.greeting = 'Afternoon';
    } else {
      this.greeting = 'Evening';
    }
  }

  updateTime(): void {
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  logout(): void {
    // Implement logout functionality here
  }
}
