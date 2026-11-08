(() => {
    const form = document.getElementById("register-form");
    const name = document.getElementById("register-name");
    const email = document.getElementById("register-email");
    const password = document.getElementById("register-password");
    const confirmation = document.getElementById("confirm-password");
    const terms = document.getElementById("accept-terms");
    const feedback = document.getElementById("register-feedback");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    document.querySelectorAll("[data-password-toggle]").forEach((button) => {
        button.addEventListener("click", () => {
            const input = document.getElementById(button.dataset.passwordToggle);
            const showing = input.type === "password";
            input.type = showing ? "text" : "password";
            button.textContent = showing ? "Hide" : "Show";
            button.setAttribute("aria-label", showing ? "Hide password" : "Show password");
            button.setAttribute("aria-pressed", String(showing));
        });
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const issues = [];
        const emailValid = emailPattern.test(email.value.trim());
        const passwordValid = passwordPattern.test(password.value);

        if (!name.value.trim()) issues.push("Enter your full name.");
        if (!email.value.trim()) {
            issues.push("Enter your email address.");
        } else if (!emailValid) {
            issues.push("Enter a valid email address.");
        }
        if (!password.value) {
            issues.push("Create a password.");
        } else if (!passwordValid) {
            issues.push("Use at least 8 characters, including a letter and a number.");
        }
        if (!confirmation.value) {
            issues.push("Confirm your password.");
        } else if (password.value !== confirmation.value) {
            issues.push("Your passwords do not match.");
        }
        if (!terms.checked) issues.push("Accept the terms and conditions to continue.");

        name.setAttribute("aria-invalid", String(!name.value.trim()));
        email.setAttribute("aria-invalid", String(!emailValid));
        password.setAttribute("aria-invalid", String(!passwordValid));
        confirmation.setAttribute("aria-invalid", String(password.value !== confirmation.value || !confirmation.value));

        if (issues.length) {
            feedback.textContent = issues.join(" ");
            feedback.classList.remove("is-success");
            return;
        }

        feedback.textContent = "Your demo account is ready. Taking you to sign in…";
        feedback.classList.add("is-success");
        window.setTimeout(() => window.location.assign("/netflick/login"), 900);
    });
})();