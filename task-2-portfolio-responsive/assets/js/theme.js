/**
 * JavaScript Theme Engine (Theme Switcher Module)
 * Handles UI interactions, accessibility aria states, and client-side syncing.
 */
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    if (!themeToggle) return;

    // Synchronize initial state with the pre-rendered document theme attribute
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateThemeUI(currentTheme);

    // Event listener for user theme choice
    themeToggle.addEventListener('click', () => {
        const activeTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';

        // Apply new theme state to the document element
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('theme', nextTheme);

        updateThemeUI(nextTheme);
    });

    /**
     * Updates the text, iconography, and accessibility aria roles of the theme trigger
     * @param {string} theme - 'light' or 'dark'
     */
    function updateThemeUI(theme) {
        if (theme === 'dark') {
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Light Mode';
            themeToggle.setAttribute('aria-pressed', 'true');
        } else {
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Dark Mode';
            themeToggle.setAttribute('aria-pressed', 'false');
        }
    }
});