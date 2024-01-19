import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Validator } from 'src/app/services/global/validator';
import { loginFormError } from 'src/app/services/global/app.constant';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LocaldataService } from 'src/app/services/localdata/localdata.service';
import { CommonService } from 'src/app/services/common/common.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword: boolean = false;
  loginFormError = loginFormError;
  durationInSeconds = 1;

  constructor(private _fb: FormBuilder,
    private router: Router,
    private _authService: AuthService,
    private _localService: LocaldataService,
    private _commonService: CommonService) {

    this.loginForm = this._fb.group({
      email: ["", [Validators.required, Validator.emailValidator]],
      password: [null, [Validators.required, Validator.passwordValidator]],

    });
  }

  ngOnInit() {

  }

  /**
     * Toggle password visibility
    **/
  toggleVisibility() {
    this.showPassword = !this.showPassword;
  }


  onSubmit() {
    if (this.loginForm.valid) {
      let data = this.loginForm.value;
      this._authService.login(data).subscribe({
        next: (res: any) => {
          if (res.data) {
            this._commonService.showSnackbar('Login Successfully', true, this.durationInSeconds);
            this._localService.set("userToken", res.token);
            this._localService.set('userData', JSON.stringify(res.data));
            this.router.navigate(['/group/list'])
          } else {
            this._commonService.showSnackbar('Invalid Email', false, this.durationInSeconds)
          }
        }, error: (error) => {
          this._commonService.showSnackbar(error.error.error ? error.error.error : "Something went wrong", false, this.durationInSeconds)
        }
      })
    }
  }

}



