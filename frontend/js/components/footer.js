const footerTemplate = document.createElement('template')

footerTemplate.innerHTML = `
<footer class="footer">
    <section>
        <p class="footer--title">AcVis</p>
        <p class="footer--info-text">Made with ❤️ by Frunză Alexandru-Ioan and Ștefan Vlad</p>
        <div>
            <a href="#">
                <img src="./img/iconmonstr-facebook-4-240.png" alt="facebook" class="footer--social-icon">
            </a>
            <a href="#">
                <img src="./img/iconmonstr-instagram-11-240.png" alt="instagram" class="footer--social-icon">
            </a>
            <a href="#">
                <img src="./img/iconmonstr-youtube-6-240.png" alt="youtube" class="footer--social-icon">
            </a>
        </div>
        <p class="footer--info-text">2024 © All rights reserved</p>
    </section>
    <section class="footer__links-section">
        <a href="#" class="footer--link">About</a>
        <a href="#" class="footer--link">Contact</a>
        <a href="#" class="footer--link">Privacy Policy</a>
        <a href="#" class="footer--link">Terms of Service</a>
    </section>
    <section class="footer__links-section">
        <a href="#" class="footer--link">About</a>
        <a href="#" class="footer--link">Contact</a>
        <a href="#" class="footer--link">Privacy Policy</a>
        <a href="#" class="footer--link">Terms of Service</a>
    </section>
</footer>
`

class Footer extends HTMLElement {
    constructor() {
        super();
        this.appendChild(footerTemplate.content.cloneNode(true));
    }
}

export default Footer;
