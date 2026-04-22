import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  todayLessons = signal<any[]>([]);
  selectedLessonId = signal<number | null>(null);

  constructor(private sessionService: SessionService) {}

  ngOnInit() {
    this.loadTodayLessons();
  }

  loadTodayLessons() {
    this.sessionService.getTodaySessions().subscribe({
      next: (res: any) => {
        this.todayLessons.set(res);
        console.log('Sessions:', res); // DEBUG
      },
      error: (err) => console.error('Error loading sessions', err)
    });
  }

  setPresence(sessionId: number, status: string) {
    const payload = {
      status: status === 'Present' ? 'Terminée' : 'Absent'
    };

    this.sessionService.updateSession(sessionId, payload).subscribe({
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