import { environment } from "src/environments/environment";

export class Configuration {
    constructor() { }
    public static apiURL = environment.apiUrl;
}


// Form validation messages...
export const registrationFormError = {
    username: {
        required: "Username is required.",
        usernameProtocol:
            "Username should be alphanumeric and of minimum 3 characters and maximum of 50 characters.",
    },
    email: {
        required: "Email is required.",
        invalid: "Invalid Email.",
    },
    password: {
        required: "Password is required.",
        passwordLength: "Password should be minimum 6 characters.",
    },
    confirm_password: {
        required: "Confirm password is required.",
        must_match: "Confirm Password Doesn't match with Password",
    },
    phone: {
        required: "Phone is required.",
        invalid: "Invalid phone number."
    }
};

export const loginFormError = {
    username: {
        required: "Username is required.",
    },
    email: {
        required: "Email is required.",
        invalid: "Invalid Email.",
    },
    password: {
        required: "Password is required.",
    },
};


export const addFormError = {
    title: {
        required: "Title is required."
    },
    description: {
        required: "Description is required."
    },
    currency: {
        required: "Currency is required."
    },
    Category: {
        required: "Category is required."
    },
    participent: {
        required: "Participent is required."
    }
}

export const addExpenseFormError = {
    title: {
        required: "Title is required."
    },
    amount: {
        required: "Amount is required."
    },
    paidBy: {
        required: "This is required."
    },
    paidAt: {
        required: "Date is required."
    },
    users: {
        required: "Select at least one participant"
    }
}
