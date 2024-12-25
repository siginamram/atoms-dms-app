import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DynamicDatepickerComponent } from './components/dynamic-datepicker/dynamic-datepicker.component'; 

@NgModule({
  declarations: [AlertDialogComponent,DynamicDatepickerComponent], // Declare AlertDialogComponent
  imports: [
    CommonModule,
    MatDialogModule, // Required for MatDialog
    MatButtonModule, // Required for MatButtons
    MatIconModule, // Required for MatIcon
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,

  ],
  exports: [AlertDialogComponent,DynamicDatepickerComponent], // Export to use in other modules
})
export class SharedModule {}
