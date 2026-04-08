/*import { Component, OnInit, signal } from '@angular/core';
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

  instructorId: number = 1; // TEMP
  today: string = new Date().toISOString().split('T')[0];

  isLoading = false;
  error = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTodayLessons();
  }

  // ================= LOAD =================
  loadTodayLessons() {
    this.isLoading = true;
    this.error = false;

    const url = `https://www.infinity-prod.com/beta/formula1/admin-api/records/session
    ?filter=instructor_id,eq,${this.instructorId}
    &filter=start_time,bw,${this.today}
    &join=candidate_id`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.todayLessons.set(res?.records || []);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading sessions', err);
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  // ================= UPDATE PRESENCE =================
  setPresence(sessionId: number, status: string) {

    const isAttended = status === 'Present';

    const payload = {
      attended: isAttended,
      status: 'Terminée'
    };

    this.http.put(
      `https://www.infinity-prod.com/beta/formula1/admin-api/records/session/${sessionId}`,
      payload
    ).subscribe({
      next: () => {

        // ✅ Optimistic update (NO reload)
        const updated = this.todayLessons().map(l =>
          l.id === sessionId
            ? { ...l, presence: status }
            : l
        );

        this.todayLessons.set(updated);
      },
      error: (err) => console.error('Update failed', err)
    });
  }

  // ================= THEME =================
  getTheme(type: any) {
    const t = type?.toString().toLowerCase();

    if (t === 'conduite') return { color: 'primary', bg: 'primary-soft' };
    if (t === 'code') return { color: 'success', bg: 'success-soft' };

    return { color: 'warning', bg: 'warning-soft' };
  }
}*/
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
/*export class HomeComponent implements OnInit {
  todayLessons = signal<any[]>([]);
  selectedLessonId = signal<number | null>(null);
  instructorId: number = 1; // Replace with: Number(localStorage.getItem('userId'))
  today: string = new Date().toISOString().split('T')[0];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTodayLessons();
  }

  loadTodayLessons() {
    // Table name: session | Filter: start_time starts with today
    const url = `https://www.infinity-prod.com/beta/formula1/admin-api/records/session?filter=instructor_id,eq,${this.instructorId}&filter=start_time,bw,${this.today}&join=candidate`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.todayLessons.set(res.records || []);
      },
      error: (err) => console.error('Error loading sessions', err)
    });
  }*/
  // ... imports ...

export class HomeComponent implements OnInit {
  todayLessons = signal<any[]>([]);
  selectedLessonId = signal<number | null>(null);
  instructorId: number = 1; 

  // FIX: Get local date instead of UTC to avoid "day-shifting"
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

  /*loadTodayLessons() {
    // We use the local date string here
    //const url = `https://www.infinity-prod.com/beta/formula1/admin-api/records/session?filter=instructor_id,eq,${this.instructorId}&filter=start_time,bw,${this.todayDate}&join=candidate`;
     const url = `https://www.infinity-prod.com/beta/formula1/admin-api/records/session?filter1=instructor_id,eq,${this.instructorId}&filter2=start_time,bw,${this.todayDate}&join=candidate`;
    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.todayLessons.set(res.records || []);
      },
      error: (err) => console.error('Error loading sessions', err)
    });
  }*/

    loadTodayLessons() {
  const dayStart = `${this.todayDate} 00:00:00`;
  const dayEnd = `${this.todayDate} 23:59:59`;
  
  const url = `https://www.infinity-prod.com/beta/formula1/admin-api/records/session?filter=instructor_id,eq,${this.instructorId}&filter=start_time,ge,${dayStart}&filter=start_time,le,${dayEnd}&join=candidate`;

  this.http.get<any>(url).subscribe({
    next: (res) => this.todayLessons.set(res.records || []),
    error: (err) => console.error(err)
  });
}

  
  // Changed status to string to match your modal buttons ('Present' / 'Absent')
  /*setPresence(sessionId: number, status: string) {
    const isAttended = status === 'Present';
    const payload = { 
      attended: isAttended, 
      status: 'Terminée' 
    };

    this.http.put(`https://www.infinity-prod.com/beta/formula1/admin-api/records/session/${sessionId}`, payload).subscribe({
      next: () => this.loadTodayLessons(),
      error: (err) => console.error('Update failed', err)
    });
  }*/

    setPresence(sessionId: number, status: string) {
  // If the instructor clicks "Present", we send true. If "Absent", we send false.
  const isAttended = status === 'Present';
  
  const payload = { 
    attended: isAttended, 
    status: 'Terminée' 
  };

  this.http.put(`https://www.infinity-prod.com/beta/formula1/admin-api/records/session/${sessionId}`, payload).subscribe({
    next: () => {
      this.loadTodayLessons(); // This refreshes the UI after the DB change
    },
    error: (err) => console.error('Update failed', err)
  });
}

  // Helper function for colors based on session type or status
  getTheme(type: any) {
    const t = type?.toString().toLowerCase();
    if (t === 'conduite') return { color: 'primary', bg: 'primary-soft' };
    if (t === 'code') return { color: 'success', bg: 'success-soft' };
    return { color: 'warning', bg: 'warning-soft' };
  }
}