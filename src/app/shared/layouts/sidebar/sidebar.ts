import { Component, EventEmitter, inject, Input, OnInit, Output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/application';
import { ToolsApiRepository } from '../../../core/infrastructure/repositories/tools-api.repository';
import { Tool } from '../../../core/domain/interfaces/tool.interface';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'foxcode-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styles: [
  ]
})
export class Sidebar implements OnInit {

  @Input() collapsed: boolean = false;
  @Input() businessUnit: string = 'MICROSOFT';
  @Output() onClose = new EventEmitter<void>();

  private authService = inject(AuthService);
  private toolsRepository = inject(ToolsApiRepository);

  isVisible = signal(false);
  allTools = signal<Tool[]>([]);
  isLoading = signal(false);

  // Filter tools based on business unit and mode
  filteredTools = computed(() => {
    const currentBU = this.businessUnit.toUpperCase();
    const currentMode = environment.environmentName.toLowerCase();
    
    return this.allTools().filter(tool => 
      tool.active && 
      tool.businessUnitId.name.toUpperCase() === currentBU &&
      tool.toolMode.some(mode => mode.toLowerCase() === currentMode)
    );
  });

  ngOnInit(): void {
    console.log('Usuario:', this.authService.user());
    const user = this.authService.user();
    if (user) {
      console.log('Usuario cargado en sidebar:', user.username);
    }
    this.allTools.set(user?.tools || []);
    // Trigger animation on init
    setTimeout(() => this.isVisible.set(true), 10);
  }

  close(): void {
    this.isVisible.set(false);
    setTimeout(() => this.onClose.emit(), 300);
  }

}
