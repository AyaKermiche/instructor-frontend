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

  /*loadExamNotifications() {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const todayStr = this.formatDate(today);
    const tomorrowStr = this.formatDate(tomorrow);

    // API: Fetch exams where date is BETWEEN today and tomorrow for this instructor
    // Note: Use your actual domain here
    const url = `https://www.infinity-prod.com/beta/formula1/admin-api/records/exam?join=candidate&filter=candidate.instructor_id,eq,${this.instructorId}&filter=exam_date,ge,${todayStr}&filter=exam_date,le,${tomorrowStr}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.notifications.set(res.records || []);
      },
      error: (err) => console.error('Notification error:', err)
    });
  }*/

    /*loadExamNotifications() {
  const todayStr = this.formatDate(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = this.formatDate(tomorrow);

  // WE REMOVE the nested filter 'candidate.instructor_id' that caused the 500 error.
  // Instead, we fetch exams by date and join the candidate just for the display names.
  const url = `https://www.infinity-prod.com/beta/formula1/admin-api/records/exam?join=candidate&filter=exam_date,ge,${todayStr}&filter=exam_date,le,${tomorrowStr}`;

  this.http.get<any>(url).subscribe({
    next: (res) => {
      // Because we can't filter the instructor in the URL easily without a crash,
      // we filter the results in TypeScript (client-side) instead.
      const allExams = res.records || [];
      
      const filtered = allExams.filter((exam: any) => {
        // Only keep exams where the candidate belongs to this instructor
        return exam.candidate?.instructor_id == this.instructorId;
      });

      this.notifications.set(filtered);
    },
    error: (err) => console.error('Notification error:', err)
  });
}*/

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