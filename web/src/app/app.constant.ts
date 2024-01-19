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
        required: "Phone is required."
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
