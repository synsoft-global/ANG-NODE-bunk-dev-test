import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonService } from 'src/app/services/common/common.service';
import { addFormError } from 'src/app/services/global/app.constant';
import { Validator } from 'src/app/services/global/validator';
import { LocaldataService } from 'src/app/services/localdata/localdata.service';
import { PayoutsService } from 'src/app/services/payout/payouts.service';


@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent {

  addForm: FormGroup;
  addFormError = addFormError;
  groupId: any;
  participantName: string = '';
  editingIndex: number | null = null;
  edit: boolean = false;
  currencyList: any = [];
  participantsList: any = [];
  category: any = [];
  durationInSeconds = 1;
  details: any;
  selectedCategory: any;
  myName: any;
  constructor(private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: MatDialogContent,
    public route: ActivatedRoute,
    private _payService: PayoutsService,
    private _authService: AuthService,
    private _commonService: CommonService,
    private _localService: LocaldataService,
    public dialogRef: MatDialogRef<AddGroupComponent>,
  ) {
    this.addForm = this._fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      currencyId: ['', [Validators.required,]],
      categoryId: ['', [Validators.required]],
      participants: ['', [Validators.required]],


    });
  }


  ngOnInit() {
    this.groupId = this.data;
    this.getCountry();
    this.getCategory();
    if (this.groupId) {
      this.getGroupDataById();
    }
  }


  getCountry() {
    this._authService.countryList().subscribe({
      next: (res: any) => {
        this.currencyList = res.data;
      }, error: (err) => {
        console.log('err: ', err);

      }
    });
  }


  getCategory() {
    this._authService.category().subscribe({
      next: (res: any) => {
        this.category = res.data;
      }, error: (err) => {
        console.log('err: ', err);
      }
    });
  }


  get participant() {
    return this.addForm.get('participants');
  }


  onEnter(event: any) {
    event.preventDefault();
    this.addItem();
  }


  addItem(): void {
    if (this.participant?.valid) {
      const name = this.addForm.get('participants')?.value
      this.participantsList.push(this.groupId ? { "name": name } : name);
      this.participant.reset();
    }
  }


  removeItem(index: number): void {
    this.participantsList.splice(index, 1);
  }


  editItem(index: number) {
    this.edit = index === 0;
    if (this.edit) {
      const nameControl = this.participantsList[index];
      this.participantsList[index] = nameControl;
    }
  }


  saveEdit() {
    const editedValue = this.addForm.get('participants')!.value;
    if (this.groupId) {
      const updatedParticipant = {
        ...this.participantsList[0],
        name: editedValue
      };
      this.participantsList[0] = updatedParticipant;
    }
    else {
      this.participantsList[0] = this.groupId ? { 'name': editedValue } : editedValue
    }
    this.edit = false;
  }


  getGroupDataById() {
    this._payService.getGropById(this.groupId).subscribe({
      next: (res: any) => {
        this.details = res.data;
        let data = {
          title: this.details.title, description: this.details.description, currencyId: this.details.currencyId,
          categoryId: this.details.categoryId
        };
        this.participantsList = this.details.participants;
        this.addForm.patchValue(data);
      }, error: (error) => {
        console.log('error: ', error);
      }
    });
  }


  onSubmit() {
    if (this.groupId) {
      this.updateGroup(this.groupId);
    } else {
      this.addForm.patchValue({ participants: this.participantsList })
      if (this.addForm.valid) {
        let data = this.addForm.value;
        this.participant?.reset();
        this._payService.addPaygroup(data).subscribe({
          next: (res: any) => {
            this.dialogRef.close("Submitted");
            this._commonService.showSnackbar(res.message, true, this.durationInSeconds);
          }, error: (err) => {
            console.log('err: ', err);
            this._commonService.showSnackbar(err.error.error ? err.error.error : "Something went wrong", false, this.durationInSeconds);
          }
        });
      };
    };

  }


  updateGroup(id: any) {
    this.addForm.patchValue({ participants: this.participantsList })
    let data = this.addForm.value;
    this.participant?.reset();
    this._payService.editPayGroup(id, data).subscribe({
      next: (res: any) => {
        this.dialogRef.close("Submitted");
        this._commonService.showSnackbar(res.message, true, this.durationInSeconds);

      }, error: (error) => {
        this._commonService.showSnackbar(error.error.error ? error.error.error : "Something went wrong", false, this.durationInSeconds);
      }
    });
  }

}

