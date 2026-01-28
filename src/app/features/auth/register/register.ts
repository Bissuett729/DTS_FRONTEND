import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiRepository } from '../../../core/infrastructure/repositories/auth/auth-api.repository';

@Component({
  selector: 'foxcode-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authRepository = inject(AuthApiRepository);

  registerForm!: FormGroup;
  isLoading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  ngOnInit(): void {
    // Resetear estado local al cargar register
    this.isLoading.set(false);
    this.error.set(null);
    this.success.set(false);
    this.initForm();
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.email]], // opcional
      clock: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.error.set(null);

      const { username, email, clock } = this.registerForm.value;
      
      const userData = {
        username,
        email: email || undefined, // solo enviar si tiene valor
        clock: Number(clock),
        roleIds: [],
        active: true,
      };

      this.authRepository.register(userData).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.success.set(true);
          
          // Redirigir al login después de 2 segundos
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.error.set(err.message || 'Registration failed. Please try again.');
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  clearError(): void {
    this.error.set(null);
  }

  cancel(): void {
    this.registerForm.reset();
    this.error.set(null);
    this.success.set(false);
    this.isLoading.set(false);
    this.router.navigate(['/auth/login']);
  }
}
