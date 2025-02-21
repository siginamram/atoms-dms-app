import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OperationsService } from '../../services/operations.service';
import { AlertDialogComponent } from 'src/app/shared/components/alert-dialog/alert-dialog.component'; 
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-client-videos-emergrncy-request',
 standalone:false,
  templateUrl: './add-client-videos-emergrncy-request.component.html',
  styleUrl: './add-client-videos-emergrncy-request.component.css'
})
export class AddClientVideosEmergrncyRequestComponent implements OnInit {
  emergencyRequestForm: FormGroup;
  showSpinner: boolean = false;
  userId: number = parseInt(localStorage.getItem('UserID') || '0', 10);
  clientId: number = 0; // Set from params
  // Regular expression for URL validation
  urlPattern = '(https?://)?(www\\.)?[a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)';

  creativeTypes = [
    { id: 3, name: 'Youtube Videos' },
    { id: 4, name: 'Educational Reels' },
  ];

  emergencyType = [
    { id: 1, name: 'Add' },
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private operationsService: OperationsService,
    private route: ActivatedRoute,
    private dialogRef: MatDialogRef<AddClientVideosEmergrncyRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { clientId: number }
  ) {
    this.emergencyRequestForm = this.fb.group({
      date: ['', Validators.required],
      creativeTypeId: ['', Validators.required],
      emergencyType: [1],
      title: ['', Validators.required],
      description: ['', Validators.required],
      thumbNail: ['', [
        Validators.pattern(
          '^(https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)?)$'
        ),
      ]],
      editorLink: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)?)$'
          ),
        ]
      ],
      shootLink: ['', [
        Validators.pattern(
          '^(https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)?)$'
        ),
      ]],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.clientId = params['clientId'] ? parseInt(params['clientId'], 10) : 0;
    });
  }

  saveDraft() {
    this.submitRequest(2, 'Draft Saved Successfully!');
  }

  sendForApproval() {
    this.submitRequest(3, 'Sent for Approval Successfully!');
  }

  submitRequest(status: number, successMessage: string) {
    if (this.emergencyRequestForm.valid) {
      this.showSpinner = true;
      const payload = {
        clientId: this.clientId, // From params
        date: this.formatDate(new Date(this.emergencyRequestForm.value.date)),
        creativeTypeId: this.emergencyRequestForm.value.creativeTypeId,
        status: status, // 2 = Draft, 3 = Approval
        title: this.emergencyRequestForm.value.title,
        description: this.emergencyRequestForm.value.description,
        thumbNail: this.emergencyRequestForm.value.thumbNail || '',
        editorLink: this.emergencyRequestForm.value.editorLink || '',
        shootLink: this.emergencyRequestForm.value.shootLink || '',
        createdBy: this.userId, // From localStorage
      };

      this.operationsService.AddClientVideoEmergencyRequest(payload).subscribe(
        (response: string) => {
          this.showSpinner = false;
          if (response === 'Success') {
            this.openAlertDialog('Success', successMessage);
          } else {
            this.openAlertDialog('Error', response || 'Unexpected response. Please try again.');
          }
          this.dialogRef.close(true);
        },
        (error: any) => {
          this.showSpinner = false;
          console.error('Error:', error);
          this.openAlertDialog('Error', error.error?.message || 'An unexpected error occurred.');
        }
      );
    } else {
      this.openAlertDialog('Error', 'Please fill all required fields correctly.');
    }
  }

  close() {
    this.dialogRef.close();
  }

  openAlertDialog(title: string, message: string): void {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: { title, message, type: title.toLowerCase() },
    });
  }

  private formatDate(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }
}