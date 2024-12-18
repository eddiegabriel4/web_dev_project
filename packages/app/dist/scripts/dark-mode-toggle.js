document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    // Applies dark mode based on stored value
    function applyDarkMode(isDarkMode) {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        } else {
            document.body.classList.remove('dark-mode');
            darkModeToggle.checked = false;
        }
    }

    // Checking localStorage for dark mode status on page load
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    applyDarkMode(isDarkMode);

    // Listening for change, then saving and applying change
    darkModeToggle.addEventListener('change', (event) => {
        const isChecked = event.target.checked;
        localStorage.setItem('darkMode', isChecked); 
        applyDarkMode(isChecked);
    });
});
