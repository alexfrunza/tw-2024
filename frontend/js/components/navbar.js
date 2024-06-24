import {parseJwt} from "../utils/jwt_decode.js";

const navBarTemplate = document.createElement('template')

navBarTemplate.innerHTML = `
<nav class="navbar">
        <div class="navbar--logo">
            <a href="/index.html">AcVis</a>
        </div>
        <div class="navbar__links" id="navbarLinks">
            <a href="/admin_panel/admin_buttons.html">Admin Dash</a>
            <a href="/about.html">About</a>
            <a href="/actors.html">Actors</a>
            <a href="/shows.html">Shows</a>
            <a href="/awards.html">Awards</a>
            <a href="/select-statistics.html">Statistics</a>
            <a href="/edit_profile.html">Edit Profile</a>
            <a href="/register.html">Register</a>
            <a href="/login.html">Login</a>
            <a href="#" id="logout">Logout</a>
        </div>
        <button class="navbar--toggle" id="navbarToggle">☰</button>
</nav>
`

class Navbar extends HTMLElement {
    constructor() {
        super();
        this.appendChild(navBarTemplate.content.cloneNode(true));

        const navbarLinks = this.querySelector('#navbarLinks');
        const token = localStorage.getItem('token');
        const isLoggedIn = localStorage.getItem('token') !== null;
        const jwtBody = token ? parseJwt(localStorage.getItem('token')) : null;

        if (!(isLoggedIn && jwtBody.admin)) {
            const adminDashLink = navbarLinks.querySelector('a[href="/admin_panel/admin_buttons.html"]');
            adminDashLink.remove();
        }

        if (isLoggedIn) {
            const registerLink = navbarLinks.querySelector('a[href="/register.html"]');
            const loginLink = navbarLinks.querySelector('a[href="/login.html"]');
            registerLink.remove();
            loginLink.remove();
            const logoutButton = this.querySelector('#logout');
            logoutButton.addEventListener('click', () => {
                localStorage.removeItem('token');
                location.reload();
            });
        } else {
            const editProfileLink = navbarLinks.querySelector('a[href="/edit_profile.html"]');
            const logoutLink = navbarLinks.querySelector('#logout');
            logoutLink.remove();
            editProfileLink.remove();
        }
    }
}

export default Navbar;