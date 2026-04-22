
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';

    this.authService.login(this.username, this.password).subscribe({
      next: (res: any) => {

        // ✅ SAVE TOKEN (if backend returns it)
        if (res.token) {
          localStorage.setItem('token', res.token);
        }

        // ✅ SAVE USER ID (CRITICAL FIX)
        if (res.user?.id) {
          localStorage.setItem('userId', res.user.id);
        }

        // optional debug
        console.log('LOGIN RESPONSE:', res);

        this.router.navigate(['/home']);
      },

      error: (e) => {
        this.error = e.error?.message || 'Login failed';
        this.loading = false;
      },
    });
  }
}

/*import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error = '';
  loading = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (e) => {
        this.error = e.error?.message || 'An error occurred during login';
        this.loading = false;
      },
    });
  }
}*/
