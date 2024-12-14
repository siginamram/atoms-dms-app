import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [AlertDialogComponent], // Declare AlertDialogComponent
  imports: [
    CommonModule,
    MatDialogModule, // Required for MatDialog
    MatButtonModule, // Required for MatButtons
    MatIconModule, // Required for MatIcon
  ],
  exports: [AlertDialogComponent], // Export to use in other modules
})
export class SharedModule {}
