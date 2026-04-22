import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// Check this path carefully! Adjust if your folder structure is different.
import { InstructorPlanningService } from '../../services/instructorplanning.service'; 

@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './planning.component.html',
  styleUrl: './planning.component.scss'
})
export class PlanningComponent implements OnInit {
  // Use 'private' and type it correctly to avoid the 'unknown' error
  private planningService = inject(InstructorPlanningService);

  // Define the structure of groupedSchedules
  groupedSchedules: { [key: number]: any[] } = {};
  
  days = [
    { label: 'LUNDI', id: 'lundi', dayIndex: 1 },
    { label: 'MARDI', id: 'mardi', dayIndex: 2 },
    { label: 'MERCREDI', id: 'mercredi', dayIndex: 3 },
    { label: 'JEUDI', id: 'jeudi', dayIndex: 4 },
    { label: 'VENDREDI', id: 'vendredi', dayIndex: 5 },
    { label: 'SAMEDI', id: 'samedi', dayIndex: 6 },
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
        startTime: s.startTime || s.start_time,
        endTime: s.endTime || s.end_time,
        scheduleDay: s.scheduleDay || s.schedule_day,
        isAvailable: s.isAvailable ?? s.is_available
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
      if (!this.groupedSchedules[day]) {
        this.groupedSchedules[day] = [];
      }
      this.groupedSchedules[day].push(slot);
    });
  }
}