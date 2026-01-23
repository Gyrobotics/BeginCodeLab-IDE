// ===============================
// LOCAL LOGIN CONFIG (TEMP)
// ===============================
const LOCAL_USERNAME = "bcd_user";
const LOCAL_PASSWORD = "user@123";

// ===============================
// GLOBALS (UNCHANGED)
// ===============================
let pyodideReadyPromise;
let currentUser = null;

// ===============================
// PYODIDE INIT (UNCHANGED)
// ===============================
async function initPyodide() {
    const pyodide = await loadPyodide();
    pyodide.globals.set("__kidlang_input", (msg) => {
        const r = prompt(msg);
        return r === null ? "" : r;
    });
    const translatorCode = await fetch('translator.py').then(r => r.text());
    pyodide.runPython(translatorCode);
    return pyodide;
}

// ===============================
// DOM ELEMENTS (UNCHANGED)
// ===============================
const loginScreen = document.getElementById('login-screen');
const accessDeniedScreen = document.getElementById('access-denied');
const ideScreen = document.getElementById('ide-screen');

const googleLoginBtn = document.getElementById('google-login');
const emailLoginBtn = document.getElementById('email-login');
const emailForm = document.getElementById('email-form');
const backBtn = document.getElementById('back-btn');

const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const logoutBtn = document.getElementById('logout-btn');
const ideLogoutBtn = document.getElementById('ide-logout-btn');

const userDisplay = document.getElementById('user-display');
const errorMessage = document.getElementById('error-message');

// ===============================
// UI HELPERS (UNCHANGED)
// ===============================
function showElement(el) { el.classList.remove('hidden'); }
function hideElement(el) { el.classList.add('hidden'); }

function showError(msg) {
    errorMessage.textContent = msg;
    showElement(errorMessage);
    setTimeout(() => hideElement(errorMessage), 4000);
}

// ===============================
// LOGIN UI FLOW (UNCHANGED)
// ===============================
emailLoginBtn.addEventListener('click', () => {
    showElement(emailForm);
    hideElement(googleLoginBtn);
    hideElement(emailLoginBtn);
});

backBtn.addEventListener('click', () => {
    hideElement(emailForm);
    showElement(googleLoginBtn);
    showElement(emailLoginBtn);
});

// ===============================
// GOOGLE LOGIN DISABLED
// ===============================
googleLoginBtn.addEventListener('click', () => {
    showError("Google login disabled");
});

// ===============================
// LOGIN LOGIC (UPDATED ONLY)
// ===============================
loginBtn.addEventListener('click', async () => {
    const username = emailInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
        showError("Enter username and password");
        return;
    }

    if (username === LOCAL_USERNAME && password === LOCAL_PASSWORD) {
        currentUser = { email: username };
        userDisplay.textContent = username;

        if (!pyodideReadyPromise) {
            pyodideReadyPromise = initPyodide();
        }

        hideElement(loginScreen);
        hideElement(accessDeniedScreen);
        showElement(ideScreen);
    } else {
        showError("Invalid username or password");
    }
});

// ===============================
// SIGNUP DISABLED
// ===============================
signupBtn.addEventListener('click', () => {
    showError("Signup disabled");
});

// ===============================
// LOGOUT (LOCAL)
// ===============================
logoutBtn.addEventListener('click', resetLogin);
ideLogoutBtn.addEventListener('click', resetLogin);

function resetLogin() {
    currentUser = null;
    hideElement(ideScreen);
    hideElement(accessDeniedScreen);
    showElement(loginScreen);
}

// ===============================
// DEV TOOLS RESTRICTION
// ===============================
document.addEventListener('keydown', (e) => {
    if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
        (e.ctrlKey && e.key === "U")
    ) {
        e.preventDefault();
        return false;
    }
});
