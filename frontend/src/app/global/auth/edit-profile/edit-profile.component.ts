import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  standalone:true,
  imports:[ReactiveFormsModule],
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Initialize form with user data (assuming you have user data to populate)
    this.profileForm.patchValue({
      firstName: 'John',  // Replace with actual data
      lastName: 'Doe',    // Replace with actual data
      email: 'john.doe@example.com',  // Replace with actual data
      phoneNumber: '1234567890'  // Replace with actual data
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      // Handle form submission logic here (e.g., update user profile)
      console.log(this.profileForm.value);
      // Example: Call a service to update user profile data
      // this.userService.updateProfile(this.profileForm.value).subscribe(...);
    }
  }
}
