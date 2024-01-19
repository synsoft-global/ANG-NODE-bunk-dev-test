import { Injectable } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ToasterComponent } from 'src/app/components/helper/toaster/toaster.component';
import { AddGroupComponent } from 'src/app/components/paygroup/add-group/add-group.component';
import { LocaldataService } from '../localdata/localdata.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);



  constructor(public dialog: MatDialog, private _snackBar: MatSnackBar,
    private _localService: LocaldataService,
    private router: Router) { }

  logout() {
    this.closeDialog();
    this._localService.del('userToken');
    this._localService.del('userData');
    this.router.navigate(['/login']);
  }

  openDialog(component: any, backdrop: boolean, dialogData: any) {
    const dialogRef = this.dialog.open(component, {
      data: dialogData,
      hasBackdrop: backdrop,
    });

    return dialogRef.afterClosed();
  }


  closeDialog() {
    this.dialog.closeAll();
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
