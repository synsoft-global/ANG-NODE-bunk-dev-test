import { Component } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { AddDialogComponent } from './dialogs/add/add.dialog.component';

type Payout = {
  name: string;
  expenses: number;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'payout-management';

  constructor(
    // public dialog: MatDialog,
    ) {}
  
}
