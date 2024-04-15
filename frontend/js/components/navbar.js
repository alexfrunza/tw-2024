const navBarTemplate = document.createElement('template')

navBarTemplate.innerHTML = `
<nav class="navbar">
        <div class="navbar--logo">
            <a href="./index.html">AcVis</a>
        </div>
        <div class="navbar__links" id="navbarLinks">
            <a href="about.html">About</a>
            <a href="actors.html">Actors</a>
            <a href="actor.html">Actor</a>
            <a href="edit_profile.html">Edit Profile</a>
            <a href="register.html">Register</a>
            <a href="login.html">Login</a>
        </div>
        <button class="navbar--toggle" id="navbarToggle">☰</button>
</nav>
`

class Navbar extends HTMLElement {
    constructor() {
        super();
        this.appendChild(navBarTemplate.content.cloneNode(true));
    }
}

export default Navbar;