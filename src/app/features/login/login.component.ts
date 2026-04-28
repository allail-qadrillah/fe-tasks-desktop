import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,  
  imports: [
    CommonModule,      
    ReactiveFormsModule  
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';

  /**
   * Define form with FormBuilder
   * Every FormControl has validators
   */
  loginForm: FormGroup = this.fb.group({
    username: ['', [
      Validators.required,        
      Validators.email             
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(6)
    ]]
  });

  /**
   * Getter shortcut for accessing form controls in the template. makes it easier to check validation status in the HTML
   */
  get username() { return this.loginForm.get('username')!; }
  get password() { return this.loginForm.get('password')!; }

  /**
   * Handler submit form that called when user click SIGN IN button
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.value;
    // Set loading state
    this.isLoading = true;
    this.errorMessage = '';

    // Called AuthService for login
    this.authService.login(username, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Login failed. Please check your credentials.';

        // ← Handle different error scenarios (API vs PouchDB)
        if (err.message === 'Invalid credentials') {
          this.errorMessage = 'Invalid email or password.';
        } else if (err.status === 401) {
          this.errorMessage = 'Invalid email or password.';
        } else if (err.status === 0) {
          this.errorMessage = 'No internet connection and no saved credentials.';
        } else {
          this.errorMessage = err.error?.message || 'Login failed. Please try again.';
        }
      }
    });
  }
}