import { Component } from '@angular/core';

@Component({
  selector: 'app-late-comming-apply',
  standalone: false,
  templateUrl: './late-comming-apply.component.html',
  styleUrls: ['./late-comming-apply.component.css']
})
export class LateCommingApplyComponent {
  date: Date | null = null;
  delayBy: string = '';
  delayReason: string = '';

  submit(): void {
    console.log({
      date: this.date,
      delayBy: this.delayBy,
      delayReason: this.delayReason
    });
    // Logic to handle submission
  }
}
