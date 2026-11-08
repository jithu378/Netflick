(() => {
    const form = document.getElementById("login-form");
    const email = document.getElementById("login-email");
    const password = document.getElementById("login-password");
    const feedback = document.getElementById("login-feedback");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    document.getElementById("forgot-password").addEventListener("click", (event) => {
        event.preventDefault();
        feedback.textContent = "Password recovery link has been sent to your email.";
        feedback.classList.add("is-success");
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const issues = [];

        if (!email.value.trim()) {
            issues.push("Enter your email address.");
        } else if (!emailPattern.test(email.value.trim())) {
            issues.push("Enter a valid email address.");
        }
        if (!password.value) {
            issues.push("Enter your password.");
        } else if (password.value.length < 8) {
            issues.push("Password must be at least 8 characters.");
        }

        email.setAttribute("aria-invalid", String(!email.value.trim() || !emailPattern.test(email.value.trim())));
        password.setAttribute("aria-invalid", String(!password.value || password.value.length < 8));

        if (issues.length) {
            feedback.textContent = issues.join(" ");
            feedback.classList.remove("is-success");
            return;
        }

        feedback.textContent = "Signing in. Opening NETFLICK…";
        feedback.classList.add("is-success");
        window.sessionStorage.setItem("netflickLoginSimulation", "true");
        window.setTimeout(() => window.location.assign("/netflick/"), 450);
    });
})();
