
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  instructorName: string = 'Chargement...';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.instructorName = `${user.firstName} ${user.lastName}`;
      } else {
        this.instructorName = 'Mon Compte';
      }
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

/*import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { InstructorService } from '../../services/instructor.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  instructorName: string = 'Chargement...'; // Default placeholder
  instructorId: number = 1; // Replace with: Number(localStorage.getItem('userId'))

  constructor(
    private instructorService: InstructorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadInstructorName();
  }

  loadInstructorName() {
    this.instructorService.getById(this.instructorId).subscribe({
      next: (res: any) => {
        // Build the full name from the API response
        this.instructorName = `${res.first_name} ${res.last_name}`;
      },
      error: () => {
        this.instructorName = 'Mon Compte'; // Fallback if API fails
      }
    });
  }

  logout() {
    // Clear session/local storage
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}*/