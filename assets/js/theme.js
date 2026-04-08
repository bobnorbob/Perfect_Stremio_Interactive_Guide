// Handles theme initialization and toggling

function setupThemeToggle() {
    var key = "stremio_docs_theme";
    var toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    // Always initialize to dark mode
    var theme = "dark";
    document.documentElement.setAttribute("data-theme", theme);

    function currentTheme() {
        return document.documentElement.getAttribute("data-theme") || "dark";
    }

    function apply(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
        try {
            localStorage.setItem(key, theme);
        } catch (_) {}
    }

    // Set the toggle button state based on the current theme
    toggle.setAttribute("aria-pressed", currentTheme() === "dark" ? "true" : "false");

    // Add click event listener to toggle the theme
    toggle.addEventListener("click", function () {
        apply(currentTheme() === "dark" ? "light" : "dark");
    });
}

document.addEventListener('DOMContentLoaded', setupThemeToggle);