import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-content-writers-clients',
  templateUrl: './content-writers-clients.component.html',
  styleUrls: ['./content-writers-clients.component.css'],
})
export class ContentWritersClientsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  leads: any[] = [];
  searchTerm: string = '';
  formattedMonthYear: string = ''; // To store the displayed date
  selectedMonthYear: { month: number; year: number } | null = null; // For filtering logic

  displayedColumns: string[] = [
    'id',
    'organizationName',
    'cityName',
    'isKTCompleted',
    'noOfReels',
    'reelsPer',
    'noOfGraphicReels',
    'graphicReelsPer',
    'actions',
  ];

  dataSource1 = new MatTableDataSource<any>([
    {
      id: 1,
      organizationName: 'Client A',
      cityName: 'Hyderabad',
      isKTCompleted: 'Completed',
      isAdvReceived: '50%',
      noOfReels: 20,
      reelsPer: '75%',
      noOfGraphicReels: 5,
      graphicReelsPer: '25%',
      clientId: 101,
      date: '2024-12-01',
    },
    {
      id: 2,
      organizationName: 'Client B',
      cityName: 'Bangalore',
      isKTCompleted: 'Pending',
      isAdvReceived: '30%',
      noOfReels: 15,
      reelsPer: '50%',
      noOfGraphicReels: 10,
      graphicReelsPer: '50%',
      clientId: 102,
      date: '2024-11-10',
    },
    {
      id: 3,
      organizationName: 'Client C',
      cityName: 'Chennai',
      isKTCompleted: 'Completed',
      isAdvReceived: '70%',
      noOfReels: 25,
      reelsPer: '85%',
      noOfGraphicReels: 10,
      graphicReelsPer: '15%',
      clientId: 103,
      date: '2024-10-05',
    },
  ]);

  constructor() {}

  ngOnInit(): void {
    this.dataSource1.paginator = this.paginator; // Attach paginator
  }

  // Filter leads for autocomplete
  filterSearch(): void {
    const searchTerm = this.searchTerm.toLowerCase();
    this.leads = this.leads.filter((lead) =>
      lead.organizationName.toLowerCase().includes(searchTerm)
    );
  }

  // Filter leads by selected client ID
  filterLeads(selectedLeadId: number): void {
    const selectedLead = this.leads.find((lead) => lead.leadId === selectedLeadId);
    if (selectedLead) {
      this.searchTerm = selectedLead.organizationName;
      this.dataSource1.data = [selectedLead];
    } else {
      this.dataSource1.data = this.leads;
    }
  }

  // Handle month selection
  onMonthYearSelected(event: Date, datepicker: any): void {
    const selectedMonth = event.getMonth() + 1; // Month is zero-based
    const selectedYear = event.getFullYear();

    // Format the selected date as MM/YYYY
    this.formattedMonthYear = this.formatMonthYear(selectedMonth, selectedYear);

    console.log('Selected Month/Year:', this.formattedMonthYear);

    // Filter table data by selected month and year
    this.filterTableByMonthYear(selectedMonth, selectedYear);

    // Close the datepicker after selection
    datepicker.close();
  }

  // Filter table data by month and year
  private filterTableByMonthYear(month: number, year: number): void {
    this.dataSource1.data = this.dataSource1.data.filter((item: any) => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getMonth() + 1 === month && itemDate.getFullYear() === year
      );
    });
  }

  // Helper function to format month and year
  private formatMonthYear(month: number, year: number): string {
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    return `${formattedMonth}/${year}`;
  }

  // Reset table data to the original dataset
  resetTableData(): void {
    this.dataSource1.data = [
      {
        id: 1,
        organizationName: 'Client A',
        cityName: 'Hyderabad',
        isKTCompleted: 'Completed',
        isAdvReceived: '50%',
        noOfReels: 20,
        reelsPer: '75%',
        noOfGraphicReels: 5,
        graphicReelsPer: '25%',
        clientId: 101,
        date: '2024-12-01',
      },
      {
        id: 2,
        organizationName: 'Client B',
        cityName: 'Bangalore',
        isKTCompleted: 'Pending',
        isAdvReceived: '30%',
        noOfReels: 15,
        reelsPer: '50%',
        noOfGraphicReels: 10,
        graphicReelsPer: '50%',
        clientId: 102,
        date: '2024-11-10',
      },
      {
        id: 3,
        organizationName: 'Client C',
        cityName: 'Chennai',
        isKTCompleted: 'Completed',
        isAdvReceived: '70%',
        noOfReels: 25,
        reelsPer: '85%',
        noOfGraphicReels: 10,
        graphicReelsPer: '15%',
        clientId: 103,
        date: '2024-10-05',
      },
    ];
  }

  // Navigate to edit page
  editRow(lead: any): void {
    console.log('Edit:', lead);
  }
}
