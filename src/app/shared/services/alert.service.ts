import { inject, Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';
import { GlobalStateService } from '../../core/application';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly globalState = inject(GlobalStateService);

  private readonly defaultConfig: SweetAlertOptions = {
    confirmButtonColor: '#006699', // Foxcode color
    cancelButtonColor: '#6b7280', // Gray
    customClass: {
      popup: 'rounded-2xl',
      confirmButton: 'px-5 py-2.5 text-sm font-medium rounded-lg',
      cancelButton: 'px-5 py-2.5 text-sm font-medium rounded-lg',
      title: 'text-xl font-bold',
    },
    buttonsStyling: false,
  };

  /**
   * With Material dialog animations disabled (enterAnimationDuration: 0ms),
   * no GPU compositing layers are created and a simple z-index is sufficient.
   * We inject a one-time <style> tag so the override survives CDK re-renders.
   */
  private setupSwal(): void {
    if (!document.getElementById('swal2-cdk-override')) {
      const style = document.createElement('style');
      style.id = 'swal2-cdk-override';
      style.textContent = '.cdk-overlay-container { z-index: 0 !important; }';
      document.head.appendChild(style);
    }
  }

  /** Removes the override so the CDK restores its default z-index. */
  private restoreCdk(): void {
    document.getElementById('swal2-cdk-override')?.remove();
  }

  /** Base config with didOpen/didClose hooks applied to every Swal.fire() call. */
  private get cfg(): SweetAlertOptions {
    return {
      ...this.defaultConfig,
      didOpen:  () => this.setupSwal(),
      didClose: () => this.restoreCdk(),
    };
  }

  /**
   * Show a success alert
   */
  success(title: string, message?: string): Promise<any> {
    return Swal.fire({
      ...this.cfg,
      icon: 'success',
      title,
      theme: this.globalState.theme() === 'light' ? 'dark' : 'light',
      text: message,
      confirmButtonText: 'OK',
    });
  }

  /**
   * Show an error alert
   */
  error(title: string, message?: string): Promise<any> {
    return Swal.fire({
      ...this.cfg,
      icon: 'error',
      title,
      theme: this.globalState.theme() === 'light' ? 'dark' : 'light',
      text: message,
      confirmButtonText: 'OK',
    });
  }

  /**
   * Show a warning alert
   */
  warning(title: string, message?: string): Promise<any> {
    return Swal.fire({
      ...this.cfg,
      icon: 'warning',
      title,
      theme: this.globalState.theme() === 'light' ? 'dark' : 'light',
      text: message,
      confirmButtonText: 'OK',
    });
  }

  /**
   * Show an info alert
   */
  info(title: string, message?: string): Promise<any> {
    return Swal.fire({
      ...this.cfg,
      icon: 'info',
      title,
      theme: this.globalState.theme() === 'light' ? 'dark' : 'light',
      text: message,
      confirmButtonText: 'OK',
    });
  }

  /**
   * Show a confirmation dialog
   */
  confirm(
    title: string,
    message?: string,
    confirmText: string = 'Yes, confirm',
    cancelText: string = 'Cancel',
  ): Promise<any> {
    return Swal.fire({
      ...this.cfg,
      icon: 'question',
      title,
      text: message,
      theme: this.globalState.theme() === 'light' ? 'dark' : 'light',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      reverseButtons: true,
    });
  }

  /**
   * Show a delete confirmation dialog
   */
  confirmDelete(itemName: string = 'this item', message?: string): Promise<any> {
    return Swal.fire({
      ...this.cfg,
      icon: 'warning',
      title: 'Are you sure?',
      text: message || `You won't be able to revert this action on ${itemName}!`,
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      theme: this.globalState.theme() === 'light' ? 'dark' : 'light',
      confirmButtonColor: '#dc2626', // Red for delete
      reverseButtons: true,
    });
  }

  /**
   * Show a loading alert
   */
  loading(title: string = 'Loading...', message?: string): void {
    Swal.fire({
      ...this.cfg,
      title,
      text: message,
      theme: this.globalState.theme() === 'light' ? 'dark' : 'light',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        this.setupSwal();
        Swal.showLoading();
      },
      didClose: () => this.restoreCdk(),
    });
  }

  /**
   * Close the current alert
   */
  close(): void {
    Swal.close();
  }

  /**
   * Show a toast notification
   */
  toast(
    icon: SweetAlertIcon,
    title: string,
    position:
      | 'top'
      | 'top-end'
      | 'top-start'
      | 'center'
      | 'center-start'
      | 'center-end'
      | 'bottom'
      | 'bottom-start'
      | 'bottom-end' = 'top-end',
    timer: number = 3000,
  ): Promise<any> {
    return Swal.fire({
      toast: true,
      position,
      icon,
      title,
      theme: this.globalState.theme() === 'light' ? 'dark' : 'light',
      showConfirmButton: false,
      timer,
      timerProgressBar: true,
      customClass: {
        popup: 'rounded-lg shadow-lg',
      },
      didOpen:  () => this.setupSwal(),
      didClose: () => this.restoreCdk(),
    });
  }

  /**
   * Show a custom alert with full control
   */
  custom(options: SweetAlertOptions): Promise<any> {
    return Swal.fire({
      ...this.defaultConfig,
      ...options,
    } as SweetAlertOptions);
  }

  /**
   * Specific alert for authorization actions
   */
  confirmAuthorization(username: string, currentStatus: boolean): Promise<any> {
    const action = currentStatus ? 'unauthorize' : 'authorize';
    const actionText = currentStatus ? 'Unauthorize' : 'Authorize';

    return Swal.fire({
      ...this.cfg,
      icon: 'question',
      title: `${actionText} User?`,
      html: `Are you sure you want to <strong>${action}</strong> user <strong>${username}</strong>?`,
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: 'Cancel',
      confirmButtonColor: currentStatus ? '#dc2626' : '#006699',
      reverseButtons: true,
      theme: this.globalState.theme() === 'light' ? 'dark' : 'light',
    });
  }

  /**
   * Show success toast
   */
  successToast(message: string): Promise<any> {
    return this.toast('success', message);
  }

  /**
   * Show error toast
   */
  errorToast(message: string): Promise<any> {
    return this.toast('error', message);
  }

  /**
   * Show warning toast
   */
  warningToast(message: string): Promise<any> {
    return this.toast('warning', message);
  }

  /**
   * Show info toast
   */
  infoToast(message: string): Promise<any> {
    return this.toast('info', message);
  }
}
