import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InstructorService } from '../../services/instructor.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  instructor: any = null;
  instructorId!: number;

  editForm!: FormGroup;
  passwordForm!: FormGroup;

  isLoading = false;
  isUpdating = false;

  updateSuccess = false;
  updateError = false;

  passwordSuccess = false;
  passwordError = false;

  constructor(
    private fb: FormBuilder,
    private instructorService: InstructorService
  ) {}

  ngOnInit(): void {
  const storedId = localStorage.getItem('userId');

  if (!storedId) {
    console.error('No instructorId in localStorage');
    return;
  }

  this.instructorId = Number(storedId);

  this.initForms();           // ✅ FIRST
  this.loadInstructorData();  // THEN API
}

  // ================= FORMS =================
  initForms() {
    this.editForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const newPass = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return newPass === confirm ? null : { mismatch: true };
  }

  // ================= LOAD =================
  loadInstructorData() {
    this.isLoading = true;

    this.instructorService.getById(this.instructorId).subscribe({
      next: (res: any) => {
        this.instructor = res;

        this.editForm.patchValue({
          email: res.email,
          phone: res.phone
        });

        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching profile', err);
        this.instructor = null;
        this.isLoading = false;
      }
    });
  }

  // ================= UPDATE PROFILE =================
  onUpdateProfile() {
    if (this.editForm.invalid) return;

    this.isUpdating = true;
    this.updateSuccess = false;
    this.updateError = false;

    this.instructorService.update(this.instructorId, this.editForm.value).subscribe({
      next: () => {
        this.isUpdating = false;
        this.updateSuccess = true;
        this.loadInstructorData();
      },
      error: (err) => {
        console.error(err);
        this.isUpdating = false;
        this.updateError = true;
      }
    });
  }

  // ================= PASSWORD =================
  onUpdatePassword() {
    if (this.passwordForm.invalid) return;

    this.passwordSuccess = false;
    this.passwordError = false;

    const payload = {
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword
    };

    this.instructorService.updatePassword(this.instructorId, payload).subscribe({
      next: () => {
        this.passwordForm.reset();
        this.passwordSuccess = true;
      },
      error: (err) => {
        console.error(err);
        this.passwordError = true;
      }
    });
  }

  // ================= HELPERS =================
  get fullName(): string {
    return this.instructor
      ? `${this.instructor.firstName} ${this.instructor.lastName}`
      : '';
  }

  openEditModal() {
    this.updateSuccess = false;
    this.updateError = false;

    this.editForm.patchValue({
      email: this.instructor.email,
      phone: this.instructor.phone
    });
  }
}