// create an HTML template element
const navBarTemplate = document.createElement('template')

navBarTemplate.innerHTML = `
<nav>
    <div>
        <img src="./img/iconmonstr-customer-1-64.png" alt="logo">
    </div>
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</nav>
`

class Navbar extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({mode: 'open'})
        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
}

customElements.define('Navbar', Navbar)

export default Navbar;