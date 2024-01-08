import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-existing-group',
  templateUrl: './existing-group.component.html',
  styleUrls: ['./existing-group.component.scss']
})
export class ExistingGroupComponent {


  constructor(@Inject(MAT_DIALOG_DATA) public data: MatDialogContent) {

  }
}
