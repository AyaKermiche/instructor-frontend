import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [DatePipe],
  templateUrl: './notification.component.html'
})
export class NotificationComponent implements OnInit {
  notifications = signal<any[]>([]);
  instructorId: number = 1;

  // Helper to get local date string YYYY-MM-DD
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadExamNotifications();
  }

  

loadExamNotifications() {
  const todayStr = this.formatDate(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = this.formatDate(tomorrow);

  const url = `https://www.infinity-prod.com/beta/formula1/admin-api/records/exam?join=candidate&filter=exam_date,ge,${todayStr}&filter=exam_date,le,${tomorrowStr}`;

  this.http.get<any>(url).subscribe({
    next: (res) => {
      const allExams = res.records || [];
      
      // DEBUG: Look at this in your browser console!
      console.log("Date Range:", todayStr, "to", tomorrowStr);
      console.table(allExams); 

      const filtered = allExams.filter((exam: any) => {
        /**
         * We check three things:
         * 1. Does 'candidate' exist?
         * 2. Is it 'instructor_id' or 'instructorId'?
         * 3. We use == instead of === to handle string vs number comparison
         */
        const instructorIdFromDb = exam.candidate?.instructor_id || exam.candidate_id?.instructor_id;
        return instructorIdFromDb == this.instructorId;
      });

      console.log("Filtered Results:", filtered);
      this.notifications.set(filtered);
    },
    error: (err) => console.error('Notification error:', err)
  });
}
  // Helper for the template to show "Aujourd'hui" or "Demain"
  getDayLabel(examDate: string): string {
    const today = this.formatDate(new Date());
    return examDate === today ? "Aujourd'hui" : "Demain";
  }
}