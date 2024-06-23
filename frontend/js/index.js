import Navbar from './components/navbar.js';
import Footer from './components/footer.js';
import AdminNavbar from "./components/admin_navbar.js";

customElements.define('app-navbar', Navbar);
customElements.define('app-footer', Footer);
customElements.define('admin-navbar', AdminNavbar);

const root = document.getElementById('root');


