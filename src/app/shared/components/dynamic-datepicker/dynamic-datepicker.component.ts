import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dynamic-datepicker',
  standalone:false,
  templateUrl: './dynamic-datepicker.component.html',
  styleUrls: ['./dynamic-datepicker.component.css'],
})
export class DynamicDatepickerComponent {
  @Input() monthOnly: boolean = false; // Toggle between month/year and full date
  @Output() dateChange = new EventEmitter<Date>(); // Emit the selected date

  selectedDate: Date | null = null; // Selected date

  onDateChange(event: any): void {
    if (event?.value) {
      this.dateChange.emit(event.value); // Emit full date
    }
  }

  onMonthSelected(event: Date, datepicker: any): void {
    if (this.monthOnly) {
      this.selectedDate = event; // Store selected month/year
      this.dateChange.emit(event); // Emit month/year
      datepicker.close();
    }
  }
}
