// FILE: planning.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InstructorPlanningService } from '../../services/instructorplanning.service';

@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './planning.component.html',
  styleUrl: './planning.component.scss'
})
export class PlanningComponent implements OnInit {
  private planningService = inject(InstructorPlanningService);

  groupedSchedules: { [key: number]: any[] } = {};

  days = [
    { label: 'LUNDI',    id: 'lundi',    dayIndex: 1 },
    { label: 'MARDI',    id: 'mardi',    dayIndex: 2 },
    { label: 'MERCREDI', id: 'mercredi', dayIndex: 3 },
    { label: 'JEUDI',    id: 'jeudi',    dayIndex: 4 },
    { label: 'VENDREDI', id: 'vendredi', dayIndex: 5 },
    { label: 'SAMEDI',   id: 'samedi',   dayIndex: 6 },
    { label: 'DIMANCHE', id: 'dimanche', dayIndex: 0 },
  ];

  ngOnInit(): void {
    const storedId = localStorage.getItem('userId');
    if (!storedId) {
      console.error('No instructorId found');
      return;
    }
    this.loadPlanning(Number(storedId));
  }

  loadPlanning(instructorId: number): void {
    this.planningService.getSchedulesByInstructor(instructorId).subscribe({
      next: (data: any[]) => {
        const normalized = data.map(s => ({
          ...s,
          // Handle both camelCase and snake_case
          startTime:   s.startTime   || s.start_time,
          endTime:     s.endTime     || s.end_time,
          scheduleDay: s.scheduleDay ?? s.schedule_day,
          isAvailable: s.isAvailable ?? s.is_available,

            typeSession: s.typeSession || s.type_session || s.sessionType

        }));
        this.groupData(normalized);
      },
      error: (err: any) => console.error('Erreur planning:', err)
    });
  }

  private groupData(schedules: any[]): void {
    this.groupedSchedules = {};
    schedules.forEach(slot => {
      const day = slot.scheduleDay;
      if (day === undefined || day === null) return;
      if (!this.groupedSchedules[day]) {
        this.groupedSchedules[day] = [];
      }
      this.groupedSchedules[day].push(slot);
    });
  }

  /**
   * Formats a time value that may be:
   * - A string "HH:mm" or "HH:mm:ss" (stored directly in DB)
   * - An ISO date string
   * - A Date object
   * Always returns "HH:mm"
   */
  formatTime(time: any): string {
    if (!time) return '--:--';

    // Already "HH:mm" or "HH:mm:ss" string
    if (typeof time === 'string' && /^\d{2}:\d{2}/.test(time)) {
      return time.substring(0, 5);
    }

    // ISO string or Date object
    const date = new Date(time);
    if (!isNaN(date.getTime())) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    return '--:--';
  }
}