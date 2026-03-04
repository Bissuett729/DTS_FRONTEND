import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DtsCard, DtsButton, DtsInput } from '../../shared';
import { GlobalStateService } from '../../core/application';
import { AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'dts-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DtsCard, DtsButton, DtsInput],
  templateUrl: './profile.html',
  styles: ``,
})
export class Profile {
  private readonly globalState = inject(GlobalStateService);
  private readonly alert        = inject(AlertService);

  user     = this.globalState.currentUser;
  isDark   = this.globalState.isDarkMode;

  activeTab = signal<'info' | 'security' | 'tools'>('info');
  editMode  = signal(false);

  // Avatar initials
  initials = computed(() => {
    const u = this.user();
    if (!u) return '?';
    return (u.username ?? u.email ?? '?').slice(0, 2).toUpperCase();
  });

  // Role label
  roleLabel = computed(() => {
    const roles = this.user()?.roleIds;
    if (!roles?.length) return 'Sin rol';
    return roles.map((r: any) => r.name ?? r).join(', ');
  });

  // Status
  isActive = computed(() => this.user()?.active ?? false);
  isAuthorized = computed(() => this.user()?.authorized ?? false);

  // Last login
  lastLogin = computed(() => {
    const d = this.user()?.lastLogin;
    if (!d) return 'N/A';
    return new Date(d).toLocaleString('es-MX', {
      dateStyle: 'medium', timeStyle: 'short'
    });
  });

  // Member since
  memberSince = computed(() => {
    const d = this.user()?.createdAt;
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('es-MX', { dateStyle: 'long' });
  });

  // Edit form
  infoForm = new FormGroup({
    username: new FormControl(''),
    email:    new FormControl(''),
  });

  // Password form
  pwForm = new FormGroup({
    current:  new FormControl(''),
    newPw:    new FormControl(''),
    confirm:  new FormControl(''),
  });

  // Tools grouped by business unit
  toolsByBu = computed(() => {
    const tools = this.user()?.tools ?? [];
    const map = new Map<string, any[]>();
    tools.forEach((t: any) => {
      const bu = t.businessUnitId?.name ?? t.businessUnit ?? 'General';
      if (!map.has(bu)) map.set(bu, []);
      map.get(bu)!.push(t);
    });
    return Array.from(map.entries()).map(([bu, items]) => ({ bu, items }));
  });

  startEdit(): void {
    const u = this.user();
    this.infoForm.patchValue({ username: u?.username ?? '', email: u?.email ?? '' });
    this.editMode.set(true);
  }

  cancelEdit(): void { this.editMode.set(false); }

  saveInfo(): void {
    // TODO: call update service
    this.alert.success('Perfil actualizado');
    this.editMode.set(false);
  }

  changePassword(): void {
    const { newPw, confirm } = this.pwForm.value;
    if (newPw !== confirm) {
      this.alert.error('Las contraseñas no coinciden');
      return;
    }
    // TODO: call change-password service
    this.alert.success('Contraseña actualizada exitosamente');
    this.pwForm.reset();
  }
}
