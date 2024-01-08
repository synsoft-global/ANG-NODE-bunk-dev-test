import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Location } from '@angular/common';
import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { loginFormError } from 'src/app/services/global/app.constant';

@Component({
  selector: 'app-expense-detail',
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.scss']
})
export class ExpenseDetailComponent {
  @ViewChild('shareGroup')
  shareGroup!: TemplateRef<any>;
  loginFormError = loginFormError;
  shareForm: FormGroup;
  id: string = '';
  selectedTabIndex: any = 0;
  shareUrl: string = 'https://example.com'; // Replace with your actual share URL


  announcer = inject(LiveAnnouncer);
  keywords: any = [];

  chips: string[] = [];
  constructor(private location: Location,
    private _commonService: CommonService,
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
    // public dialogRef: MatDialogRef<ExpenseDetailComponent>
  ) {

    this.shareForm = _fb.group({
      url: [this.shareUrl, [Validators.required]],
      email: ['', [Validators.required]],
    });

  }
  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

  }

  back() {
    this.location.back();
  }


  openDialog() {
    this._commonService.openDialog(this.shareGroup);
  }

  trackKeyword(index: number, keyword: string): string {
    return keyword; // Replace with a unique identifier for each keyword
  }

  removeKeyword(keyword: string) {
    const index = this.keywords.indexOf(keyword);
    if (index >= 0) {
      this.keywords.splice(index, 1);

      this.announcer.announce(`removed ${keyword}`);
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value) {
      this.keywords.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  sendEmail() {
    this.shareForm.markAllAsTouched();
    if (this.shareForm.valid) {

    }

  }
}
