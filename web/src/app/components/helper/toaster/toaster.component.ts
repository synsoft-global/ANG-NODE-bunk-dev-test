import { Component, Inject, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss']
})
export class ToasterComponent {
  snackBarRef = inject(MatSnackBarRef);
  constructor(private _snackBar: MatSnackBar, @Inject(MAT_SNACK_BAR_DATA) public data: any) { }

}


