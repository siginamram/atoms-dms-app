import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home/home.component';
import { LeftMenuComponent } from './components/left-menu/left-menu.component';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    LeftMenuComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule ,// Add RouterModule here
    MatButtonModule,
    MatIconModule,
  ],
  exports: [
    HomeComponent,
    HeaderComponent,
    LeftMenuComponent,
    FooterComponent
  ] // Export components for use in other modules
})
export class CoreModule { }
