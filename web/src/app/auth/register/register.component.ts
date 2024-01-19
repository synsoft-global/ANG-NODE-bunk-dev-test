import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Validator } from 'src/app/services/global/validator';
import { registrationFormError } from 'src/app/services/global/app.constant';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword: boolean = false;
  registrationFormError = registrationFormError;
  durationInSeconds = 1;
  constructor(private _fb: FormBuilder,
    private _authService: AuthService,
    private _commonService: CommonService,
    private router: Router) {
    this.registerForm = _fb.group({
      userName: ['', [Validators.required]],
      email: ['', [Validators.required, Validator.emailValidator]],
      phone: ['', Validators.compose([Validators.required, Validator.mobileValidator])],
      password: [null, [Validators.required, Validator.passwordValidator]],


    });
  }

  ngOnInit() {

  }

  toggleVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      let data = this.registerForm.value;
      this._authService.register(data).subscribe({
        next: (res: any) => {
          this._commonService.showSnackbar(res.message, true, this.durationInSeconds);
          this.router.navigate(['/login'])
        }, error: (err) => {
          console.log('err: ', err);
          this._commonService.showSnackbar(err.error.errors ? err.error.errors : "Something went wrong", false, this.durationInSeconds)
        }
      })
    }

  }
}
