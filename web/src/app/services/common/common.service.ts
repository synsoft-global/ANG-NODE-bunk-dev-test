import { Injectable } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { ToasterComponent } from 'src/app/helper/toaster/toaster.component';
import { AddGroupComponent } from 'src/app/paygroup/add-group/add-group.component';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(public dialog: MatDialog, private _snackBar: MatSnackBar) { }


  openDialog(data: any) {
    const dialogRef = this.dialog.open(data);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  showSnackbar(message: string, isSuccess: boolean, durationInSeconds: number) {
    this._snackBar.openFromComponent(ToasterComponent, {
      duration: durationInSeconds * 1000,
      data: {
        message: message,
        isSuccess: isSuccess,
      },
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }


  // handleErr(error: any) {
  //   this.isLoading.next(false);
  //   if ([400, 401, 404, 406, 500].indexOf(error.status) > -1) {
  //     return (error);
  //   }
  //   return (error.message || error);
  // }

}
