import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      clock: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.error.set(null);

      // Simulación de registro (aquí conectarías con tu servicio)
      setTimeout(() => {
        this.isLoading.set(false);
        this.success.set(true);
        
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      }, 1500);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  clearError(): void {
    this.error.set(null);
  }
}
