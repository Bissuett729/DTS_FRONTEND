import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'foxcode-auth',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './auth.html',
})
export class Auth {

}
