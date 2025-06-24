document.addEventListener("DOMContentLoaded", () => {
    const lengthSlider = document.getElementById("length");
    const lengthValue = document.getElementById("lengthValue");
    const passwordOutput = document.getElementById("password");
    const generateBtn = document.getElementById("generate");
    const copyBtn = document.getElementById("copy");
    const toggleThemeBtn = document.getElementById("toggle-theme");

    const customInput = document.getElementById("custom-password");
    // Écoute l'entrée utilisateur
    customInput.addEventListener("input", () => {
        const customPassword = customInput.value.trim();
        if (customPassword.length > 0) {
            passwordOutput.textContent = customPassword;
            evaluateStrength(customPassword);
        } else {
            passwordOutput.textContent = "Votre mot de passe ici";
            resetStrengthDisplay();
        }
    });
    function resetStrengthDisplay() {
        document.getElementById("strength-bar").style.width = "0%";
        document.getElementById("strength-bar").style.backgroundColor = "#ccc";
        document.getElementById("strength-score").textContent = "---";
        document.getElementById("strength-icon").textContent = "⚠️";
        document.getElementById("strength-feedback").textContent = "";
    }

    const options = {
        uppercase: document.getElementById("uppercase"),
        lowercase: document.getElementById("lowercase"),
        numbers: document.getElementById("numbers"),
        symbols: document.getElementById("symbols"),
    };

    const chars = {
        uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        lowercase: "abcdefghijklmnopqrstuvwxyz",
        numbers: "0123456789",
        symbols: "!@#$%^&*()_+{}[]<>/.,",
    };

    function generatePassword() {
        const length = parseInt(lengthSlider.value);
        let charset = "";
        Object.keys(options).forEach(key => {
            if (options[key].checked) charset += chars[key];
        });

        if (!charset) return (passwordOutput.textContent = "Veuillez cocher au moins une option");

        let password = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }

        passwordOutput.textContent = password;
        animatePassword();
        evaluateStrength(password);

    }

    function animatePassword() {
        passwordOutput.style.transition = "transform 0.3s ease";
        passwordOutput.style.transform = "scale(1.1)";
        setTimeout(() => {
            passwordOutput.style.transform = "scale(1)";
        }, 300);
    }

    function evaluateStrength(password) {
        const result = zxcvbn(password);
        const score = result.score;
        const crackTime = result.crack_times_display.offline_fast_hashing_1e10_per_second;

        const bar = document.getElementById("strength-bar");
        const scoreText = document.getElementById("strength-score");
        const feedback = document.getElementById("strength-feedback");
        const icon = document.getElementById("strength-icon");

        const labels = ["Très faible", "Faible", "Moyenne", "Bonne", "Excellente"];
        const colors = ["#ff4d4f", "#ff7a45", "#ffd666", "#69c0ff", "#52c41a"];
        const icons = ["❌", "⚠️", "⚖️", "✅", "🛡️"];
        const widths = ["20%", "40%", "60%", "80%", "100%"];

        // Visuel
        bar.style.width = widths[score];
        bar.style.backgroundColor = colors[score];
        icon.textContent = icons[score];
        scoreText.textContent = `${labels[score]} – ${crackTime}`;

        // Feedback texte
        let feedbackText = result.feedback.suggestions.join(" ");
        if (!feedbackText && result.feedback.warning) {
            feedbackText = result.feedback.warning;
        }

        feedback.textContent = feedbackText ? `Conseils : ${feedbackText}` : "";
    }


    generateBtn.addEventListener("click", generatePassword);

    copyBtn.addEventListener("click", () => {
        const text = passwordOutput.textContent;
        navigator.clipboard.writeText(text).then(() => {
            copyBtn.textContent = "Copié !";
            setTimeout(() => (copyBtn.textContent = "Copier"), 1500);
        });
    });

    lengthSlider.addEventListener("input", () => {
        lengthValue.textContent = lengthSlider.value;
    });

    toggleThemeBtn.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        toggleThemeBtn.textContent = newTheme === "dark" ? "☀️" : "🌙";
    });

    // Initial theme
    document.documentElement.setAttribute("data-theme", "light");
});



