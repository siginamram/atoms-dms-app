import { Component } from '@angular/core';

@Component({
  selector: 'app-payments',
  standalone:false,
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent {
  activeTab: string = 'paymentcollection'; // Default active tab
}
