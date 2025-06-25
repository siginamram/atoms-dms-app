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
  empId: any;
  empName: any;

  constructor(
        private router: Router,
        private route: ActivatedRoute
  ){}
  ngOnInit(): void {

    this.route.queryParams.subscribe((params) => {
      this.empId = +params['empid'] ;
      this.empName=params['empName'];

       // If empid is not passed in query params, check localStorage
       if (!this.empId) {
        const storedId = localStorage.getItem('EmployeeData');
        this.empId = storedId ? parseInt(storedId, 10) : 0;
      }
    });

  this.dataStats = [
    { label: 'General Details', value: 'View' },
    { label: 'Education Details', value: 'View' },
    { label: 'Work Experience', value:'View' },
    { label: 'Other Details', value: 'View' },
     { label: 'Salary Details', value: 'View' },
    // { label: 'Learning Tracker', value:'View' },
  ];
  
}


getStatColor(label: string): string {
  const colors: { [key: string]: string } = {
    'General Details': '#1976D2',        // Blue - Personal info
    'Education Details': '#388E3C',      // Green - Academic background
    'Work Experience': '#F57C00',        // Orange - Career highlights
    'Other Details': '#7B1FA2',          // Purple - Additional info
    'Salary Details': '#0288D1',           // Light Blue - Company role
    'Learning Tracker': '#C2185B',       // Pink - Training progress
  };
  return colors[label] || '#607d8b';      // Default grey-blue
}


getRow(lead: any): void {
  console.log(lead);
  if(lead.label=='General Details'){
    this.router.navigate([`/home/employees/AddComponent`], {
      queryParams: {
        empid:this.empId,
        empName:this.empName
      }
    });
  }
  else if(lead.label=='Education Details'){
    this.router.navigate([`/home/employees/employee-education`], {
      queryParams: {
        empid:this.empId,
        empName:this.empName
      }
    });
  }
  else if(lead.label=='Work Experience'){
    this.router.navigate([`/home/employees/employee-workexperience`], {
      queryParams: {
        empid:this.empId,
        empName:this.empName
      }
    });
  }
  else if(lead.label=='Other Details'){
    this.router.navigate([`/home/employees/employee-others-doc`], {
      queryParams: {
        empid:this.empId,
        empName:this.empName
      }
    });
  }
    else if(lead.label=='Salary Details'){
    this.router.navigate([`/home/employees/employee-salary-detailes`], {
      queryParams: {
        empid:this.empId,
        empName:this.empName
      }
    });
  }
}

getStatIcon(label: string): string {
  const icons: { [key: string]: string } = {
    'General Details': 'person',
    'Education Details':'school',
    'Work Experience': 'work',
    'Other Details': 'portrait',
    'Salary Details': 'person_add',
    'Learning Tracker': 'important_devices',
  };
  return icons[label] || 'info';
}
goBack(): void {
  this.router.navigate(['/home/employees/listofemployees']); 
}

}
