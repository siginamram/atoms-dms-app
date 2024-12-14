import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


// Import Angular Material modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatOptionModule } from '@angular/material/core';
import { NgIf, NgFor } from '@angular/common';

// Animation module
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { FeaturesModule } from './features/features.module';
import { AdminLayoutModule } from './layouts/admin-layout/admin-layout.module';
import { UserLayoutModule } from './layouts/user-layout/user-layout.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    // Import Material modules here
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatTooltipModule,
    BrowserAnimationsModule,  // Essential for Material Design animations
    MatSnackBarModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    MatOptionModule,
    NgIf, NgFor,
    MatDatepickerModule,
    MatNativeDateModule,
    CoreModule,
    SharedModule,
    FeaturesModule,
    AdminLayoutModule,
    UserLayoutModule,
    NgxMaterialTimepickerModule,
    MatDialogModule,
  ],
  providers: [
    provideAnimationsAsync(), // Ensure async animations support
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
