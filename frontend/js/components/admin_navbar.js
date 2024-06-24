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
    <button onClick="(async function downloadExportActors() {
    const response = await fetch('http://localhost:5001/export-actors-csv')
    const data = await response.text();

    const csvContent = 'data:text/csv;charset=utf-8,' + data;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = 'exportActors.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
})()" class="users-panel__menu--button">Export actors db</button>
</div>
`

class AdminNavbar extends HTMLElement {
    constructor() {
        super();
        this.appendChild(adminNavbarTemplate.content.cloneNode(true));
    }
}

export default AdminNavbar;
