import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { SignalsSupportReport } from '../../../shared/storage/signals.signal';
import { environment } from '../../../../../../../../environments/environment';
import { HttpService } from '../../../../../../../core/application';
import { AlertService, FoxcodeButton } from '../../../../../../../shared';

@Component({
  selector: 'foxcode-add-images',
  standalone: true,
  imports: [CommonModule, FoxcodeButton],
  templateUrl: './add-images.html'
})
export class AddImagesComponent {

  private readonly http = inject(HttpService)
  readonly signals = inject(SignalsSupportReport)
  private readonly alert = inject(AlertService)

  images: any[] = [];
  uploadingImages: boolean = false

  constructor(public dialogRef: MatDialogRef<AddImagesComponent>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  /** When selecting manually from input */
  onFileSelect(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.processFiles(files);
  }

  /** Drag & drop */
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = Array.from(event.dataTransfer?.files || []) as File[];
    this.processFiles(files);
  }

  /** Convert files to preview objects */
  processFiles(files: File[]) {
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;

      const reader = new FileReader();
      reader.onload = () => {
        this.images.push({
          name: file.name,
          type: file.type,
          size: file.size,
          preview: reader.result // base64
        });
      };
      reader.readAsDataURL(file);
    }
  }

  /** Remove image */
  removeImage(index: number) {
    this.images.splice(index, 1);
  }

  async uplaodImages() {
    if (this.uploadingImages) return;
    this.uploadingImages = true;
    const id = this.signals?.$report()?._id
    console.log('images:', this.images);
    this.http.post<any>(`${environment.SUPPORT_REPORT}/bug-tracking/images/${id}`, {images: this.images})
      .pipe(finalize(() => this.uploadingImages = false))
      .subscribe({
        next: () => {
          this.alert.success(`The images were loaded correctly.`)
          this.onNoClick()
        },
        error: (err) => {
          this.alert.error(err)
        }
      })
  }

}