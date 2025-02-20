import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employee-dashboard',
  standalone: false,
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css'
})
export class EmployeeDashboardComponent {

  dataStats: any[] = [];

  constructor(
        private router: Router,
        private route: ActivatedRoute
  ){}
  ngOnInit(): void {
  this.dataStats = [
    { label: 'General Details', value: 'View' },
    { label: 'Education Details', value: 'View' },
    { label: 'Work Experience', value:'View' },
    { label: 'Other Details', value: 'View' },
    { label: 'Role Details', value: 'View' },
    { label: 'Learning Tracker', value:'View' },
  ];
  
}


getStatColor(label: string): string {
  const colors: { [key: string]: string } = {
    'General Details': '#2E71C3',
    'Education Details':'#454241',
    'Work Experience': '#454241',
    'Other Details': '#454241',
    'Role Details': '#454241',
    'Learning Tracker': '#454241',
  };
  return colors[label] || '#607d8b';
}

getRow(lead: any): void {
  console.log(lead);
  if(lead.label=='General Details'){
    this.router.navigate(['/home/employees/AddComponent'])
  
  }
}

getStatIcon(label: string): string {
  const icons: { [key: string]: string } = {
    'General Details': 'person',
    'Education Details':'school',
    'Work Experience': 'work',
    'Other Details': 'portrait',
    'Role Details': 'person_add',
    'Learning Tracker': 'important_devices',
  };
  return icons[label] || 'info';
}


}
