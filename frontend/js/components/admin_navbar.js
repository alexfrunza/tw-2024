const adminNavbarTemplate = document.createElement('template')

adminNavbarTemplate.innerHTML = `
<div class="users-panel__menu">
    <a href="/admin_panel/add_show.html" class="users-panel__menu--button">Add Show</a>
    <a href="/admin_panel/shows.html" class="users-panel__menu--button">See Shows</a>

    <a href="/admin_panel/add_actor.html" class="users-panel__menu--button">Add Actor</a>
    <a href="/admin_panel/actors.html" class="users-panel__menu--button">See Actors</a>

    <a href="/admin_panel/add_award.html" class="users-panel__menu--button">Add Award</a>
    <a href="/admin_panel/awards.html" class="users-panel__menu--button">See Awards</a>
    
    <a href="/admin_panel/import_actors.html" class="users-panel__menu--button">Import actors db</a>
    <a href="/admin_panel/export_actors.html" class="users-panel__menu--button">Export actors db</a>
</div>
`

class AdminNavbar extends HTMLElement {
    constructor() {
        super();
        this.appendChild(adminNavbarTemplate.content.cloneNode(true));
    }
}

export default AdminNavbar;
