import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/application/services/auth.service';
import { StorageUseCase } from '../../../core/application';

@Component({
  selector: 'foxcode-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css']
})
export class ChangePassword implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private storageRepository = inject(StorageUseCase);

  changePasswordForm!: FormGroup;

  // Local state
  isLoading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);
  successNotAuthorized = signal(false);
  showOldPassword = signal(false);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  ngOnInit(): void {
    // Resetear estado local al cargar change-password
    this.isLoading.set(false);
    this.error.set(null);
    this.success.set(false);
    this.successNotAuthorized.set(false);
    this.showOldPassword.set(false);
    this.showNewPassword.set(false);
    this.showConfirmPassword.set(false);
    this.initForm();
  }

  private initForm(): void {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  toggleOldPasswordVisibility(): void {
    this.showOldPassword.set(!this.showOldPassword());
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword.set(!this.showNewPassword());
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      this.isLoading.set(true);
      this.error.set(null);

      const { currentPassword, newPassword } = this.changePasswordForm.value;

      // Obtener el ID del usuario del servicio
      const userId = this.authService.user()?.id;
      const currentToken = this.storageRepository.getItem('accessToken');
      const userAuthorized = this.authService.user()?.authorized;

      if (!userId) {
        this.error.set('User ID not found. Please log in again.');
        this.isLoading.set(false);
        return;
      }

      this.authService.changePassword(userId, currentPassword, newPassword).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.authService.markPasswordChanged();

          // Verificar si el usuario está autorizado
          if (!userAuthorized) {
            this.successNotAuthorized.set(true);
            // Cerrar sesión y redirigir al login después de 4 segundos
            setTimeout(() => {
              this.authService.logout(currentToken!);
            }, 4000);
          } else {
            this.success.set(true);
            // Redirigir a foxcode después de 2 segundos
            setTimeout(() => {
              this.router.navigate(['/foxcode']);
            }, 2000);
          }
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Error changing password. Please try again.');
          this.isLoading.set(false);
        }
      });
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }

  clearError(): void {
    this.error.set(null);
  }

  cancelChange(): void {
    this.changePasswordForm.reset();
    this.error.set(null);
    this.success.set(false);
    this.successNotAuthorized.set(false);
    this.isLoading.set(false);
    this.showOldPassword.set(false);
    this.showNewPassword.set(false);
    this.showConfirmPassword.set(false);
    this.router.navigate(['/auth/login']);
  }
}
