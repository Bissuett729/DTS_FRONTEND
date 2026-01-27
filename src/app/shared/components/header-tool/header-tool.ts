import { Component, Input, signal, computed, HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'foxcode-header-tool',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-tool.html',
  styles: ``,
})
export class HeaderTool {

  @Input() toolName: string = 'HEADER TOOL';

  @Input() menus: Array<{ label: string; link?: string, childrens?: Array<{ label: string; link: string }> }> = [];

  @Input() options: Array<{ label: string; action: () => void }> = [];

  openOptionsDropdown = signal(false);
  currentUrl = signal<string>('');

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) {
    // Defer URL initialization to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.currentUrl.set(this.router.url);
    });
    
    // Track current URL
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl.set(event.url);
      });
  }

  /**
   * Close dropdown when clicking outside
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside && this.openOptionsDropdown()) {
      this.openOptionsDropdown.set(false);
    }
  }

  // Track which dropdowns should open to the left
  private dropdownPositions = new Map<number, 'left' | 'right'>();

  toggleOptions(): void {
    this.openOptionsDropdown.update(v => !v);
  }

  executeOption(action: () => void): void {
    action();
    this.openOptionsDropdown.set(false);
  }

  /**
   * Check if dropdown would overflow viewport and adjust position
   */
  checkDropdownPosition(index: number, menuElement: HTMLElement): void {
    const rect = menuElement.getBoundingClientRect();
    const dropdownWidth = 256; // w-64 = 16rem = 256px
    const viewportWidth = window.innerWidth;
    const spaceOnRight = viewportWidth - rect.right;
    
    // If there's not enough space on the right, open to the left
    if (spaceOnRight < dropdownWidth) {
      this.dropdownPositions.set(index, 'right');
    } else {
      this.dropdownPositions.set(index, 'left');
    }
  }

  /**
   * Get dropdown positioning classes based on available space
   */
  getDropdownClasses(index: number): string {
    const position = this.dropdownPositions.get(index) || 'left';
    return position === 'left' ? 'left-0' : 'right-0';
  }

  /**
   * Check if any child of a menu is currently active
   */
  isMenuActive(menu: any): boolean {
    if (!menu.childrens || menu.childrens.length === 0) {
      return false;
    }
    
    const currentUrl = this.currentUrl();
    // Remove query params and normalize the URL
    const normalizedCurrentUrl = currentUrl.split('?')[0].split('#')[0];
    
    // Check if menu has a link and it matches
    if (menu.link && menu.link !== '') {
      const normalizedMenuLink = menu.link.split('?')[0].split('#')[0];
      // Handle both absolute and relative paths
      if (normalizedCurrentUrl === normalizedMenuLink || 
          normalizedCurrentUrl.startsWith(normalizedMenuLink + '/') ||
          normalizedCurrentUrl.endsWith('/' + normalizedMenuLink)) {
        return true;
      }
    }
    
    // Check if any child is active
    return menu.childrens.some((child: any) => {
      const normalizedChildLink = child.link.split('?')[0].split('#')[0];
      // Check if URL ends with the child link (for relative paths)
      // or if URL contains the child link as a segment
      return normalizedCurrentUrl === normalizedChildLink ||
             normalizedCurrentUrl.endsWith('/' + normalizedChildLink) ||
             normalizedCurrentUrl.includes('/' + normalizedChildLink + '/') ||
             normalizedCurrentUrl.startsWith(normalizedChildLink + '/') ||
             normalizedCurrentUrl.startsWith(normalizedChildLink);
    });
  }
}
