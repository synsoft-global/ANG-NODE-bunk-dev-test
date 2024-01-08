import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonService } from 'src/app/services/common/common.service';
import { addFormError } from 'src/app/services/global/app.constant';
import { Validator } from 'src/app/services/global/validator';
import { PayoutsService } from 'src/app/services/payout/payouts.service';


@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent {

  addForm: FormGroup;
  addFormError = addFormError;
  participantName: string = '';
  editingIndex: number | null = null;
  edit: boolean = false;
  currencyList: any = [];
  participantsList: any = [];
  category: any = [];
  durationInSeconds = 1;

  constructor(private _fb: FormBuilder,
    private router: Router,
    private _payService: PayoutsService,
    private _authService: AuthService,
    private _commonService: CommonService,
    public dialogRef: MatDialogRef<AddGroupComponent>,) {
    this.addForm = _fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      currencyId: ['', [Validators.required,]],
      categoryId: ['', [Validators.required]],
      participants: ['', [Validators.required]],


    });
  }


  ngOnInit() {
    this.getCountry();
    this.getCategory();
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


  addItem(): void {
    if (this.participant?.valid) {
      const name = this.addForm.get('participants')?.value
      this.participantsList.push(name);
      this.participant.reset();
    }
  }

  removeItem(index: number): void {
    this.participantsList.splice(index, 1);
  }

  editItem(index: number) {
    this.edit = index === 0;
    if (this.edit) {
      const nameControl = this.participantsList[index]
      this.participantsList[index] = nameControl;
    }
  }
  saveEdit() {
    const editedValue = this.addForm.get('participants')!.value;
    this.participantsList[0] = editedValue;
    this.edit = false;
  }

  onSubmit() {
    this.dialogRef.close();
    this.addForm.patchValue({ participants: this.participantsList })
    if (this.addForm.valid) {
      let data = this.addForm.value;
      this._payService.addPaygroup(data).subscribe({
        next: (res) => {
          this.dialogRef.close();
          this._commonService.showSnackbar('Added Successfully', true, this.durationInSeconds);
        }, error: (err) => {
          console.log('err: ', err);

        }
      });
    };

  }
}

