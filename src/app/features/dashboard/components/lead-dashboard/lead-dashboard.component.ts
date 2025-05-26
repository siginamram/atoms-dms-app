import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from '../../services/dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-lead-dashboard',
  standalone:false,
  templateUrl: './lead-dashboard.component.html',
  styleUrl: './lead-dashboard.component.css'
})
export class LeadDashboardComponent implements OnInit {
  deliverablesColumns: string[] = [
    'name',
    'total',
    'noOfPendingPosts',
    'noOfPromotedPosts',
    'noOfOnTimePosts',
    'noOfEarlyPosts',
    'noOfLatePosts',
    'noOfRejectedPosts',
    'noOfFailedPosts'
  ];

  displayedColumns: string[] = [
    'empName',
    'roleName',
    'sentForApprovalCount',
    'approvedCount',
    'pendingApprovalCount',
    'changesRecommenedCount',
    'manager',
  ];

  fromDateValue: Date | null = null;
  toDateValue: Date | null = null;

  filteredDeliverables = new MatTableDataSource<any>([]);
  filteredApprovalStatus = new MatTableDataSource<any>([]);
  dataStats: any[] = [];
  showSpinner: boolean = false; // Default value
  constructor(
    private dashboardService: DashboardService,
    private router: Router,
     private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      console.log('From Date:', this.fromDateValue);
     console.log('To Date:', this.toDateValue);
      if (params['fromDateValue'] && params['toDateValue']) {
        // Parse queryParams and set them as valid Date objects
        this.fromDateValue = new Date(params['fromDateValue']);
        this.toDateValue = new Date(params['toDateValue']);
      } else {
        // Default to today's date
        const today = new Date();
        this.fromDateValue = today;
        this.toDateValue = today;
      }
    });
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.showSpinner = true;
    const userId = +localStorage.getItem('UserID')!; 
    const fdate = this.formatDate(this.fromDateValue);
    const tdate = this.formatDate(this.toDateValue);

    this.dashboardService.getManagerDashboardData(userId, fdate, tdate).subscribe(
      (data) => {
        this.showSpinner = false;
        this.updateDeliverables(data.deliverableStatus);
        this.updateApprovalStatus(data.approvalStatus);
        this.updateDataStats(data);
      },
      (error) => {
        this.showSpinner = false;
        console.error('Error fetching dashboard data:', error);
      }
    );
  }

  applyDateFilter(): void {
    this.fetchDashboardData();
  }

  updateDeliverables(deliverableStatus: any[]): void {
    this.filteredDeliverables.data = deliverableStatus.map((item) => ({
      name: item.creativeTypeName,
      noOfPendingPosts: item.noOfPendingPosts,
      noOfPromotedPosts: item.noOfPromotedPosts,
      noOfOnTimePosts: item.noOfOnTimePosts,
      noOfEarlyPosts: item.noOfEarlyPosts,
      noOfLatePosts: item.noOfLatePosts,
      noOfRejectedPosts:item.noOfRejectedPosts,
      noOfFailedPosts:item.noOfFailedPosts,
      creativeTypeId:item.creativeTypeId,
    }));
  }

  updateApprovalStatus(approvalStatus: any[]): void {
    this.filteredApprovalStatus.data = approvalStatus.map((item) => ({
      empName: item.empName,
      roleName: item.roleName,
      sentForApprovalCount: item.sentForApprovalCount,
      approvedCount: item.approvedCount,
      pendingApprovalCount: item.pendingApprovalCount,
      changesRecommenedCount: item.changesRecommenedCount,
      manager: item.manager || 'N/A',
    }));
  }

  updateDataStats(data: any): void {
    const userCounts = data.usersCount
      .filter((user: any) => user.roleName !== 'Team Lead') // Exclude 'Team Lead'
      .map((user: any) => ({
        label: user.roleName,
        value: user.noOfUsers,
      }));
  
    this.dataStats = [
      { label: 'Number of Clients', value: data.clientSCount.clientCount },
      { label: 'K.T Sessions', value: data.clientSCount.ktPendingCount },
      ...userCounts,
      { label: 'Statistics', value: 'View' },
    ];
  }

  formatDate(date: Date | null): string {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  getStatIcon(label: string): string {
    const icons: { [key: string]: string } = {
      'Number of Clients': 'group',
      'K.T Sessions':'event',
      'Content Writer': 'create',
      'Poster Designer': 'brush',
      'Video Editor': 'movie',
      'DMA': 'settings',
      'Videographer': 'videocam',
      'Statistics':'bar_chart',
    };
    return icons[label] || 'info';
  }

  getStatColor(label: string): string {
    const colors: { [key: string]: string } = {
      'Number of Clients': '#4caf50',
      'K.T Sessions':'#ff9800',
      'Content Writer': '#3f51b5',
      'Poster Designer': '#9c27b0',
      'Video Editor': '#f44336',
      'DMA': '#00bcd4',
      'Videographer': '#00bcd4',
      'Statistics':'#795548',
    };
    return colors[label] || '#607d8b';
  }

  editRow(lead: any): void {
  console.log(lead);
  const userId = +localStorage.getItem('UserID')!;
  const formattedFromDate = this.formatDate(this.fromDateValue);
  const formattedToDate = this.formatDate(this.toDateValue); 
  this.router.navigate(['/home/dashboard/pending-posts'],{
    queryParams: {
      fromDateValue: formattedFromDate,
       toDateValue:formattedToDate,
       type:'lead',
       userId:userId,
       creativeTypeId:lead.creativeTypeId
      },
  });
} 

editRownew(lead: any): void {
  console.log(lead);
  const userId = +localStorage.getItem('UserID')!;
  const formattedFromDate = this.formatDate(this.fromDateValue);
  const formattedToDate = this.formatDate(this.toDateValue); 
  this.router.navigate(['/home/dashboard/promoted-posts'],{
    queryParams: {
      fromDateValue: formattedFromDate,
       toDateValue:formattedToDate,
       type:'lead',
       userId:userId,
       creativeTypeId:lead.creativeTypeId
      },
  });
} 

early(lead: any): void {
  console.log(lead);
  const userId = +localStorage.getItem('UserID')!;
  const formattedFromDate = this.formatDate(this.fromDateValue);
  const formattedToDate = this.formatDate(this.toDateValue); 
  this.router.navigate(['/home/dashboard/promoted-posts'],{
    queryParams: {
      fromDateValue: formattedFromDate,
       toDateValue:formattedToDate,
       type:'lead',
       userId:userId,
       creativeTypeId:lead.creativeTypeId,
       postStatus:2,
      },
  });
}

OnTime(lead: any): void {
  console.log(lead);
  const userId = +localStorage.getItem('UserID')!;
  const formattedFromDate = this.formatDate(this.fromDateValue);
  const formattedToDate = this.formatDate(this.toDateValue); 
  this.router.navigate(['/home/dashboard/promoted-posts'],{
    queryParams: {
      fromDateValue: formattedFromDate,
       toDateValue:formattedToDate,
       type:'lead',
       userId:userId,
       creativeTypeId:lead.creativeTypeId,
       postStatus:3,
      },
  });
}

Late(lead: any): void {
  console.log(lead);
  const userId = +localStorage.getItem('UserID')!;
  const formattedFromDate = this.formatDate(this.fromDateValue);
  const formattedToDate = this.formatDate(this.toDateValue); 
  this.router.navigate(['/home/dashboard/promoted-posts'],{
    queryParams: {
      fromDateValue: formattedFromDate,
       toDateValue:formattedToDate,
       type:'lead',
       userId:userId,
       creativeTypeId:lead.creativeTypeId,
       postStatus:4,
      },
  });
}
Rejected(lead: any): void {
  console.log(lead);
  const userId = +localStorage.getItem('UserID')!;
  const formattedFromDate = this.formatDate(this.fromDateValue);
  const formattedToDate = this.formatDate(this.toDateValue); 
  this.router.navigate(['/home/dashboard/promoted-posts'],{
    queryParams: {
      fromDateValue: formattedFromDate,
       toDateValue:formattedToDate,
       type:'lead',
       userId:userId,
       creativeTypeId:lead.creativeTypeId,
       postStatus:5,
      },
  });
}
   Failed(lead: any): void {
  console.log(lead);
  const userId = +localStorage.getItem('UserID')!;
  const formattedFromDate = this.formatDate(this.fromDateValue);
  const formattedToDate = this.formatDate(this.toDateValue); 
  this.router.navigate(['/home/dashboard/promoted-posts'],{
    queryParams: {
      fromDateValue: formattedFromDate,
       toDateValue:formattedToDate,
       type:'lead',
       userId:userId,
       creativeTypeId:lead.creativeTypeId,
       postStatus:6,
      },
  });
}

getRow(lead: any): void {
  console.log(lead);
  if(lead.label=='Number of Clients'){
    this.router.navigate(['/home/dashboard/clients-list'],{
      queryParams: {type:'lead'},
    });
  }
  else if(lead.label=='Statistics'){
    const userId = +localStorage.getItem('UserID')!;
    const formattedFromDate = this.formatDate(this.fromDateValue);
    const formattedToDate = this.formatDate(this.toDateValue); 
    this.router.navigate(['/home/dashboard/statistics'],{
      queryParams: {
        fromDateValue: formattedFromDate,
         toDateValue:formattedToDate,
         type:'lead',
         userId:userId
        },
    });
  }
  else if(lead.label=='Content Writer'){
    console.log(lead.label);
    this.router.navigate(['/home/dashboard/resource-list'],{
      queryParams: {
        roleid:10,
        creativeTypeId:1,
        name:'Content Writer',
        type:'lead'
      },
    });
  }
  else if(lead.label=='Poster Designer'){
    this.router.navigate(['/home/dashboard/resource-list'],{
      queryParams: {
        roleid:11,
        creativeTypeId:2,
        name:'Poster Designer',
        type:'lead'
      },
    });
  }
  else if(lead.label=='Video Editor'){
    this.router.navigate(['/home/dashboard/resource-list'],{
      queryParams: {
        roleid:12,
        creativeTypeId:3,
        name:'Video Editor',
        type:'lead'
      },
    });
  }
  else if(lead.label=='DMA'){
    this.router.navigate(['/home/dashboard/resource-list'],{
      queryParams: {
        roleid:9,
        creativeTypeId:1,
        name:'DMA',
        type:'lead'
      },
    });
  }
  else if(lead.label=='Videographer'){
    this.router.navigate(['/home/dashboard/resource-list'],{
      queryParams: {
        roleid:13,
        creativeTypeId:1,
        name:'Videographer',
        type:'lead'
      },
    });
  }
  else if(lead.label=='K.T Sessions'){
    this.router.navigate(['/home/dashboard/kt-sessions'],{
      queryParams: {
        userId:+localStorage.getItem('UserID')!,
        name:'K.T Sessions',
        type:'lead'
      },
    });
  }
 }
}


