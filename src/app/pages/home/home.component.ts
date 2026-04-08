import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  todayLessons = signal<any[]>([]);
  selectedLessonId = signal<number | null>(null);
  instructorId: number = 1; // Replace with: Number(localStorage.getItem('userId'))

  // Helper to get local date string (YYYY-MM-DD)
  get todayDate(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTodayLessons();
  }

  loadTodayLessons() {
    const dayStart = `${this.todayDate} 00:00:00`;
    const dayEnd = `${this.todayDate} 23:59:59`;
    
    // Using the 'between' logic (ge and le) which solved the filtering issue
    const url = `https://www.infinity-prod.com/beta/formula1/admin-api/records/session?filter=instructor_id,eq,${this.instructorId}&filter=start_time,ge,${dayStart}&filter=start_time,le,${dayEnd}&join=candidate`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.todayLessons.set(res.records || []);
      },
      error: (err) => console.error('Error loading sessions', err)
    });
  }

  setPresence(sessionId: number, status: string) {
    const isAttended = status === 'Present';
    const payload = { 
      attended: isAttended, 
      status: 'Terminée' 
    };

    // Added the missing slash / before sessionId
    this.http.put(`https://www.infinity-prod.com/beta/formula1/admin-api/records/session/${sessionId}`, payload).subscribe({
      next: () => this.loadTodayLessons(),
      error: (err) => console.error('Update failed', err)
    });
  }

  getTheme(type: any) {
    const t = type?.toString().toLowerCase();
    if (t === 'conduite') return { color: 'primary', bg: 'primary-soft' };
    if (t === 'code') return { color: 'success', bg: 'success-soft' };
    return { color: 'warning', bg: 'warning-soft' };
  }
}