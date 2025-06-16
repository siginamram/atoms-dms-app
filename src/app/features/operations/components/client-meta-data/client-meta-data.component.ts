import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { OperationsService } from '../../services/operations.service';
import { ClientMetaDataEditComponent } from '../client-meta-data-edit/client-meta-data-edit.component';

@Component({
  selector: 'app-client-meta-data',
  standalone:false,
  templateUrl: './client-meta-data.component.html',
  styleUrl: './client-meta-data.component.css'
})
export class ClientMetaDataComponent implements OnInit, AfterViewInit {
  clients: any[] = [];
  filteredClients: any[] = [];
  selectedClientId: number | null = 0;
  selectedClientName: string = '';
  userId: number = parseInt(localStorage.getItem('UserID') || '0', 10);

  displayedColumns = [
    'id',
    'organizationName',
    'facebookPageId',
    'instagramPageId',
    'facebookPageToken',
    'youtubeRefreshTokenuage',
    'postTime',
    'specialDayPostTime',
    'actions'
  ];

  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('fullTextDialog') fullTextDialog: any;
  constructor(private dialog: MatDialog, private operationsService: OperationsService) {}

  ngOnInit(): void {
    this.fetchAllClients();
    this.fetchListOfClientsMeta();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  fetchAllClients(): void {
    this.operationsService.getClientsByUser(this.userId).subscribe({
      next: (response: any[]) => {
        this.clients = response;
        this.filteredClients = response;
      },
      error: (error) => {
        console.error('Error fetching clients:', error);
      },
    });
  }

  filterClients(event: Event): void {
    const input = event.target as HTMLInputElement;
    const search = input.value.toLowerCase();
    this.filteredClients = this.clients.filter((client) =>
      client.organizationName.toLowerCase().includes(search)
    );
  }

  onClientSelected(event: any): void {
    const selectedOrganizationName = event.option.value;
    const selectedClient = this.clients.find(
      (client) => client.organizationName === selectedOrganizationName
    );

    if (selectedClient) {
      this.selectedClientId = selectedClient.clientId || 0;
      this.selectedClientName = selectedClient.organizationName;
      this.fetchListOfClientsMeta();
    }
  }

 fetchListOfClientsMeta(): void {
  const clientIdToUse = this.selectedClientId ?? 0;

  this.operationsService.GetClientMetadata(clientIdToUse).subscribe({
    next: (response: any[]) => {
      const mappedData = response.map((item, index) => ({
        id: index + 1,
        clientId: item.clientId,
        organizationName: item.organizationName,
        facebookPageId: item.facebookPageId?.toString() || '',
        instagramPageId: item.instagramPageId?.toString() || '',
        facebookPageToken: item.facebookPageToken,
        instagramPageToken: item.instagramPageToken,
        youtubeRefreshTokenuage: item.youtubeRefreshToken,
        postTime: item.postTime,
        specialDayPostTime: item.specialDayPostTime,
        updateOn: item.updateOn,
        updateBy: item.updateBy,
      }));

      this.dataSource.data = mappedData;
    },
    error: (error) => {
      console.error('Error fetching client metadata:', error);
      this.dataSource.data = [];
    }
  });
}


  openDialog(editData: any = null): void {
    const dialogRef = this.dialog.open(ClientMetaDataEditComponent, {
      width: '600px',
      data: editData
        ? {
            clientId: editData.clientId,
            facebookPageId: editData.facebookPageId || 0,
            instagramPageId: editData.instagramPageId || 0,
            facebookPageToken: editData.facebookPageToken || '',
            instagramPageToken: editData.instagramPageToken || '',
            youtubeRefreshToken: editData.youtubeRefreshTokenuage || '',
            postTime: editData.postTime || '',
            specialDayPostTime: editData.specialDayPostTime || '',
            updateBy: this.userId || 0,
          }
        : {
            clientId: this.selectedClientId || 0,
            facebookPageId: 0,
            instagramPageId: 0,
            facebookPageToken: '',
            instagramPageToken: '',
            youtubeRefreshToken: '',
            postTime: '',
            specialDayPostTime: '',
            updateBy: this.userId || 0,
          },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchListOfClientsMeta();
      }
    });
  }
    showFullText(text: string, title: string): void {
    this.dialog.open(this.fullTextDialog, {
      width: '400px',
      data: {
        text: text,
        title: title,
      },
    });
  }
}