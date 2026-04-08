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
  instructorId: number = 1; // TEMP (API limitation)

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
    this.initForms();
    this.loadInstructorData();
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

  // ================= LOAD DATA =================
  loadInstructorData() {
    this.isLoading = true;

    this.instructorService.getById(this.instructorId).subscribe({
      next: (res: any) => {
        this.instructor = {
          ...res,
          hire_date: new Date(res.hire_date)
        };

        this.editForm.patchValue({
          email: res.email,
          phone: res.phone
        });

        this.isLoading = false;
      },
      error: (err) => {
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
        this.instructor = {
          ...this.instructor,
          ...this.editForm.value
        };

        this.isUpdating = false;
        this.updateSuccess = true;
      },
      error: () => {
        this.isUpdating = false;
        this.updateError = true;
      }
    });
  }

  // ================= UPDATE PASSWORD =================
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
      error: () => {
        this.passwordError = true;
      }
    });
  }

  // ================= HELPERS =================
  get fullName(): string {
    return this.instructor
      ? `${this.instructor.first_name} ${this.instructor.last_name}`
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

/*import { Component, OnInit } from '@angular/core';
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
  editForm!: FormGroup;
  passwordForm!: FormGroup;
  instructorId: number = 1; // Replace with: Number(localStorage.getItem('userId'))

  constructor(
    private fb: FormBuilder,
    private instructorService: InstructorService
  ) {}

  ngOnInit() {
    this.initForms();
    this.loadInstructorData();
  }

  initForms() {
    this.editForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  loadInstructorData() {
    this.instructorService.getById(this.instructorId).subscribe({
      next: (res: any) => {
        this.instructor = res;
        this.editForm.patchValue(res);
      },
      error: (err) => console.error('Error fetching profile', err)
    });
  }

  onUpdateProfile() {
    if (this.editForm.valid) {
      this.instructorService.update(this.instructorId, this.editForm.value).subscribe({
        next: () => {
          this.loadInstructorData();
          // You might want to show a success toast here
        }
      });
    }
  }

  onUpdatePassword() {
    if (this.passwordForm.valid) {
      const payload = { password: this.passwordForm.value.newPassword };
      this.instructorService.update(this.instructorId, payload).subscribe({
        next: () => this.passwordForm.reset()
      });
    }
  }
}*/