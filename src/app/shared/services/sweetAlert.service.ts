import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal, { SweetAlertIcon, SweetAlertPosition } from 'sweetalert2';

@Injectable({ providedIn: 'root' })

export class SweetAlertService {

  constructor(private readonly router: Router,) { }

  public simpleFireAlert(
    position: SweetAlertPosition = 'center',
    icon: SweetAlertIcon = 'question',
    title: string = 'Unknown Error',
    showConfirmButton: boolean = false,
    timer?: number
  ) {

    Swal.fire({ position, icon, title, showConfirmButton, timer });

  }

  public simpleFireAlertLogin() {

    let timerInterval: any;
    Swal.fire({
      title: 'Token expired!', html: 'You have to sing In again in <b></b> milliseconds.', timer: 2500, timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        const b: any = Swal.getHtmlContainer()!.querySelector('b')
        timerInterval = setInterval(() => {
          b.textContent! = Swal.getTimerLeft()
        }, 100)
      },
      willClose: () => { clearInterval(timerInterval) }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.router.navigateByUrl('/auth');
      }

    })

  }

  public simpleMixinAlert(

    position: SweetAlertPosition = 'top-end',
    icon: SweetAlertIcon = 'success',
    title: string = 'Unkknow message',
    showConfirmButton: boolean = false,
    timer?: number

  ) {

    const Toast = Swal.mixin({ toast: true, position, showConfirmButton, timer, timerProgressBar: true });
    Toast.fire({ icon, title });

  }


  public async confirmAlert(

    title: string = 'Unknown message',
    text: string = 'Unknown question',
    icon: SweetAlertIcon = 'info',
    showCancelButton: boolean = false,
    confirmButtonColor: string = '#3085d6',
    cancelButtonColor: string = '#d33',
    showConfirmButton: boolean = false,
    confirmButtonText: string = 'Yes, do it!',
    timer?: number,

  ): Promise<boolean> {

    return Swal.fire({
      toast: true,
      title: title,
      text: text,
      icon: icon,
      showCancelButton: showCancelButton,
      confirmButtonColor: confirmButtonColor,
      cancelButtonColor: cancelButtonColor,
      showConfirmButton: showConfirmButton,
      confirmButtonText: confirmButtonText,
    }).then((result) => {
      return result.isConfirmed;
    });

  }

}
