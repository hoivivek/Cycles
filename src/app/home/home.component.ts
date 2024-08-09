import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const formData = this.signupForm.value;

      this.http.post('/api/register', formData).subscribe({
        next: response => {
          console.log('User registered successfully', response);
          this.router.navigate(['/login']);
        },
        error: error => {
          if (error.status === 0) {
            console.error('Network error or server is unreachable', error);
            alert('Network error or server is unreachable. Please try again later.');
          } else if (typeof error.error === 'string' && error.error.startsWith('<!DOCTYPE')) {
            console.error('Unexpected response format', error);
            alert('Registration failed: Unexpected response from the server.');
          } else {
            console.error('Error occurred while registering user', error);
            alert('Registration failed: ' + (error.error?.message || 'Unknown error'));
          }
        }
      });
    } else {
      console.warn('Form is invalid');
    }
  }
}

