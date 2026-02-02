import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'foxcode-view-image-support',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-image-support.html'
})
export class ViewImageSupport {

  constructor(
    public dialogRef: MatDialogRef<ViewImageSupport>,
    @Inject(MAT_DIALOG_DATA) public receiveData: { imgB64: string, title: string }
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
