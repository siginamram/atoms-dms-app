import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username: string = "Krish"; // Replace with your actual username
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['position', 'name', 'weight'];

  // Sample data for table
  tableData = [
    { position: 1, name: 'Hydrogen', weight: 1.0079 },
    { position: 2, name: 'Helium', weight: 4.0026 },
    { position: 3, name: 'Lithium', weight: 6.941 },
    { position: 4, name: 'Beryllium', weight: 9.0122 },
    { position: 5, name: 'Boron', weight: 10.81 },
    { position: 6, name: 'Carbon', weight: 12.011 },
    { position: 7, name: 'Nitrogen', weight: 14.007 }
  ];

  // Dummy data for messages
  messages = [
    { sender: 'Alice', text: 'Hello, how are you?', bgColor: '#d1f7d1' },
    { sender: 'Bob', text: 'Good job on the project!', bgColor: '#d1e4f7' },
    { sender: 'Charlie', text: 'Do you need help with your task?', bgColor: '#f7e0d1' }
  ];

  constructor() {
    this.dataSource = new MatTableDataSource(this.tableData);
  }

  ngOnInit(): void {
    this.initLineChart();
  }

  // Initialize Line Chart
  initLineChart(): void {
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'Dataset 1',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Function to alternate row colors
  getRowColor(position: number): string {
    return position % 2 === 0 ? '#e0f7fa' : '#f9f9f9'; // Alternating colors
  }
}
