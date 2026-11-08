(() => {
    const form = document.getElementById("register-form");
    const name = document.getElementById("register-name");
    const email = document.getElementById("register-email");
    const phone = document.getElementById("register-phone");
    const password = document.getElementById("register-password");
    const confirmation = document.getElementById("confirm-password");
    const feedback = document.getElementById("register-feedback");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    // International phone validation: allows optional +, digits, spaces, hyphens, parens, dots (7 to 15 digits)
    const phoneFormatPattern = /^\+?[\d\s\-().]{7,20}$/;

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

        const rawPhone = phone.value.trim();
        const phoneDigits = rawPhone.replace(/\D/g, "");
        const phoneValid = phoneFormatPattern.test(rawPhone) && phoneDigits.length >= 7 && phoneDigits.length <= 15;

        if (!name.value.trim()) {
            issues.push("Enter your full name.");
        }

        if (!email.value.trim()) {
            issues.push("Enter your email address.");
        } else if (!emailValid) {
            issues.push("Enter a valid email address.");
        }

        if (!rawPhone) {
            issues.push("Enter your phone number.");
        } else if (!phoneValid) {
            issues.push("Enter a valid phone number.");
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

        name.setAttribute("aria-invalid", String(!name.value.trim()));
        email.setAttribute("aria-invalid", String(!emailValid));
        phone.setAttribute("aria-invalid", String(!phoneValid));
        password.setAttribute("aria-invalid", String(!passwordValid));
        confirmation.setAttribute("aria-invalid", String(password.value !== confirmation.value || !confirmation.value));

        if (issues.length) {
            feedback.textContent = issues.join(" ");
            feedback.classList.remove("is-success");
            return;
        }

        feedback.textContent = "Your account has been created. Taking you to sign in…";
        feedback.classList.add("is-success");
        window.setTimeout(() => window.location.assign("/netflick/login"), 900);
    });

})();
