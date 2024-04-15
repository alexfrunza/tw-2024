const navBarTemplate = document.createElement('template')

navBarTemplate.innerHTML = `
<nav class="navbar">
        <div class="navbar--logo">
            <a href="./index.html">AcVis</a>
        </div>
        <div class="navbar__links" id="navbarLinks">
            <a href="#">Dummy 1</a>
            <a href="#">Dummy 2</a>
            <a href="#">Dummy 3</a>
            <a href="#">Login</a>
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