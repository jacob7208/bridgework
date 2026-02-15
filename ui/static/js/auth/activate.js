import {activateUser} from "../api.js";
import {handleAPIError} from "../utils/helpers.js";

const activateBtn = document.getElementById('activate-btn');
const activateMsg = document.getElementById('msg');


activateBtn.addEventListener("click", async () => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
        activateMsg.textContent = "No activation token. Check URL";
        return;
    }

    try {
        await activateUser(token);

        activateMsg.textContent = "Success! Redirecting to login...";

        setTimeout(() => {
            window.location.href = '/login';
        }, 2000);
    } catch (error) {
        handleAPIError(error);
        activateMsg.textContent = error;
    }
})