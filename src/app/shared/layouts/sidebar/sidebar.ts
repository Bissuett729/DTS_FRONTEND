import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GlobalStateService } from '../../../core/application';
import { SettingsDtsIcon } from "../../icons";
import { LoaderDts } from "../../components/loader-dts/loader-dts";

@Component({
  selector: 'foxcode-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, SettingsDtsIcon, LoaderDts],
  templateUrl: './sidebar.html',
  styles: [],
})
export class Sidebar implements OnInit {
  @Input() collapsed: boolean = false;
  @Input() businessUnit: string = 'MICROSOFT';
  @Output() onClose = new EventEmitter<void>();

  private globalState = inject(GlobalStateService);

  isVisible = signal(false);
  isLoading = signal(false);

  // Access user from global state
  user = this.globalState.currentUser;

  // Derive allTools reactively from the user signal
  allTools = computed(() => this.user()?.tools || []);

  // Filter tools based on business unit and mode
  filteredTools = computed(() => {
    return this.allTools()
      .filter(tool => tool.active )
      .sort((a, b) => {
        const aIsAdmin = a?.businessUnitId?.name.toUpperCase() === 'DEVELOPMENT';
        const bIsAdmin = b?.businessUnitId?.name.toUpperCase() === 'DEVELOPMENT';
        if (aIsAdmin === bIsAdmin) return 0;
        return aIsAdmin ? -1 : 1;
      });
  });

  ngOnInit(): void {
    const user = this.user();
    if (user) {
      console.log('Usuario cargado en sidebar:', user.username);
    }
    // Trigger animation on init
    setTimeout(() => this.isVisible.set(true), 10);
  }

  close(): void {
    this.isVisible.set(false);
    setTimeout(() => this.onClose.emit(), 300);
  }
}
