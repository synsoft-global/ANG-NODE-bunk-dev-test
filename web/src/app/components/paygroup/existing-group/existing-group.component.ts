import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { LocaldataService } from 'src/app/services/localdata/localdata.service';

@Component({
  selector: 'app-existing-group',
  templateUrl: './existing-group.component.html',
  styleUrls: ['./existing-group.component.scss']
})
export class ExistingGroupComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: MatDialogContent,
  ) {

  }


}
