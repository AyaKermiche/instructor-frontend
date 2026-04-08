import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-liste-candidats',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './liste-candidats.component.html'
})
export class ListeCandidatsComponent implements OnInit {
  candidates = signal<any[]>([]);
  searchText = signal<string>('');
  
  // Get this from your Auth process/LocalStorage
  instructorId: number = 1; 

  filteredCandidates = computed(() => {
    const query = this.searchText().toLowerCase().trim();
    if (!query) return this.candidates();
    return this.candidates().filter(c => 
      `${c.first_name} ${c.last_name}`.toLowerCase().includes(query)
    );
  });

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Try to get the real ID from storage if it exists
    const storedId = localStorage.getItem('userId');
    if (storedId) this.instructorId = Number(storedId);
    
    this.fetchInstructorCandidates();
  }

  fetchInstructorCandidates() {
    /** * Filtering Strategy:
     * We add a filter to the API call so the database only returns 
     * candidates where instructor_id equals our current ID.
     */
    const filterPath = `?filter=instructor_id,eq,${this.instructorId}`;
    const apiUrl = `https://www.infinity-prod.com/beta/formula1/admin-api/records/candidate${filterPath}`;

    this.http.get<any>(apiUrl).subscribe({
      next: (res) => {
        this.candidates.set(res.records || []);
      },
      error: (err) => console.error('Erreur lors du filtrage:', err)
    });
  }

  getStepInfo(step: string) {
    const s = step?.toLowerCase();
    if (s === 'conduite') return { color: 'primary', icon: 'bi-car-front-fill' };
    if (s === 'code') return { color: 'success', icon: 'bi-book-fill' };
    if (s === 'créneau') return { color: 'warning', icon: 'bi-cone-striped' };
    return { color: 'secondary', icon: 'bi-person' };
  }
}