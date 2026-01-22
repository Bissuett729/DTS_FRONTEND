import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/application/services/auth.service';

@Component({
  selector: 'foxcode-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loginForm!: FormGroup;

  // Exponer signals del AuthService al template
  isLoading = this.authService.isLoading;
  error = this.authService.error;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      clock: ['', [Validators.required, Validators.min(1)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = {
        clock: Number(this.loginForm.value.clock),
        password: this.loginForm.value.password
      };
      this.authService.login(credentials);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  clearError(): void {
    this.authService.clearError();
  }
}
