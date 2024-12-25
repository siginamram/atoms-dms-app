import { Component } from '@angular/core';

@Component({
  selector: 'app-operations',
  standalone:false,
  templateUrl: './operations.component.html',
  styleUrl: './operations.component.css'
})
export class OperationsComponent {
  onDateSelected(date: Date): void {
    console.log('Full date selected:', date);
  }

  onMonthYearSelected(date: Date): void {
    console.log('Month and year selected:', date);
  }
}
