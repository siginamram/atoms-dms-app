import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone:false,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  currentYear: any;
  constructor() { }



  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
  }

}
