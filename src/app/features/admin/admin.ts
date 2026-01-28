import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderTool } from '../../shared/components/header-tool/header-tool';

@Component({
  selector: 'foxcode-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderTool],
  templateUrl: './admin.html',
  styles: ``,
})
export class Admin {

  menus = [
    { label: 'Users', link: 'users' },
    { label: 'Tools', link: 'tools' },
    { label: 'Departments', link: 'departments' },
    { label: 'Business Units', link: 'business-units' },
    { label: 'Roles', link: 'roles' },
    { label: 'Shifts', link: 'shifts' },
  ];
}
