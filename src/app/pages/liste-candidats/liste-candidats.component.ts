import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-liste-candidats',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './liste-candidats.component.html'
})
export class ListeCandidatsComponent implements OnInit {

  candidates = signal<any[]>([]);
  searchText = signal<string>('');

  instructorId: number = 1;

  filteredCandidates = computed(() => {
    const query = this.searchText().toLowerCase().trim();

    if (!query) return this.candidates();

    return this.candidates().filter(c =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(query)
    );
  });

  constructor(private sessionService: SessionService) {}

  ngOnInit() {
    const storedId = localStorage.getItem('userId');
    if (storedId) this.instructorId = Number(storedId);

    this.loadCandidatesFromSessions();
  }

  loadCandidatesFromSessions() {
    this.sessionService.getByInstructor(this.instructorId).subscribe({
      next: (sessions: any[]) => {

        // Extract candidates
        const candidates = sessions.map(s => s.candidate);

        // Remove duplicates
        const unique = Array.from(
          new Map(candidates.map(c => [c.id, c])).values()
        );

        this.candidates.set(unique);
      },
      error: (err) => console.error(err)
    });
  }

  getStepInfo(step: string) {
    const s = step?.toLowerCase();
    if (s === 'conduite') return { color: 'primary', icon: 'bi-car-front-fill' };
    if (s === 'code') return { color: 'success', icon: 'bi-book-fill' };
    return { color: 'secondary', icon: 'bi-person' };
  }
}