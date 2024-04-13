document.addEventListener('DOMContentLoaded', (event) => {
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarLinks = document.getElementById('navbarLinks');

    navbarToggle.addEventListener('click', () => {
        navbarLinks.classList.toggle('active');
    });
});