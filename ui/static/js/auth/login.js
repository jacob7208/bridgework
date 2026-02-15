import {fetchAuthenticationToken} from "../api.js";

const form = document.forms['login-form'];

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formMsg = document.getElementById('form-msg');
    const email = form.email.value;
    const emailErr = document.getElementById('email-err');
    const password = form.password.value;
    const passwordErr = document.getElementById('password-err');

    emailErr.textContent = "";
    passwordErr.textContent = "";

    try {
        const result = await fetchAuthenticationToken(email, password);

        localStorage.setItem('authToken', result.authentication_token.token);
        window.location.href = '/app'

    } catch (error) {
        if (error.status === 422) {
            emailErr.textContent = error.data.email || "";
            passwordErr.textContent = error.data.password || "";
        } else {
            formMsg.textContent = error.data || "";
        }
    }
})