import {registerUser} from "../api.js";

const form = document.forms['signup-form'];

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formMsg = document.getElementById('form-msg');
    const name = form.name.value;
    const nameErr = document.getElementById('name-err');
    const email = form.email.value;
    const emailErr = document.getElementById('email-err');
    const password = form.password.value;
    const passwordErr = document.getElementById('password-err');

    nameErr.textContent = "";
    emailErr.textContent = "";
    passwordErr.textContent = "";

    try {
        await registerUser(name, email, password);

        formMsg.textContent = "Please check your email to activate your account";
        form.reset();
    } catch (error) {
        if (error.status === 422) {
            nameErr.textContent = error.data.name || "";
            emailErr.textContent = error.data.email || "";
            passwordErr.textContent = error.data.password || "";
        } else {
            formMsg.textContent = error.data || "";
        }
    }
})