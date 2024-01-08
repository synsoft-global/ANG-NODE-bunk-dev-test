import { AbstractControl, UntypedFormGroup } from "@angular/forms";

export class Validator {
    static getValidatorErrorMessage(code: string) {
        let config: { [key: string]: string } = {
            required: "Required",
            invalidCreditCard: "Is invalid credit card number",
            invalidEmailAddress: "Invalid email address",
            invalidPassword:
                "Invalid password. Password must be at least 6 characters long, and contain a number.",
        };
        return config[code];
    }

    static emailValidator(control: AbstractControl) {
        if (control.value && control.value.length > 0) {
            if (control.value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
                return null;
            } else {
                return { invalidEmailAddress: true };
            }
        }
        // Add a default return value
        return null;
    }

    static mobileValidator(control: AbstractControl) {
        if (control.value.length > 0) {
            if (control.value.match(/^(\+\d{1,3}[- ]?)?\d{8,15}$/)) {
                return null;
            } else {
                return { invalidPhoneNumber: true };
            }
        }
        // Add a default return value
        return null;
    }
    static passwordValidator(control: AbstractControl) {
        if (control.value && control.value.length > 0) {
            if (control.value.match(/^(?=.*).{6,}$/)) {
                return null;
            } else {
                return { invalidPassword: true };
            }
        }
        return null;
    }
}