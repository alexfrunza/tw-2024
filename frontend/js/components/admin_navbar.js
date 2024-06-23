const adminNavbarTemplate = document.createElement('template')

adminNavbarTemplate.innerHTML = `
<div class="users-panel__menu">
    <button class="users-panel__menu--button">Add User</button>
    <button class="users-panel__menu--button">Delete Users</button>
    <button class="users-panel__menu--button">Export Users</button>

    <a href="/admin_panel/add_show.html" class="users-panel__menu--button">Add Show</a>
    <a href="/admin_panel/shows_list.html" class="users-panel__menu--button">See Shows</a>

    <a href="/admin_panel/add_actor.html" class="users-panel__menu--button">Add Actor</a>
    <a href="/admin_panel/actors.html" class="users-panel__menu--button">See Actors</a>

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
