/**
 * @module Client_SideNav
 */

window.onload = (event) => { document.getElementById("sidenav").style.width = "0px"; };

/**
 * Open the sidenavigation and change the icon of the button
 */
function openSidenav() {
    var sidenav = document.getElementById("sidenav");
    if (sidenav.style.width == "0px") {
        sidenav.style.width = "250px";
        btn = document.getElementById("btn-sidenav");
        btn.innerHTML = "✖";
        btn.style.border = "1px solid #F7F3F6";
    } else {
        closeSidenav();
    }
}

/**
 * Close the sidenavigation and change the icon of the button
 */
function closeSidenav() {
    document.getElementById("sidenav").style.width = "0px";
    btn = document.getElementById("btn-sidenav");
    btn.innerHTML = "☰";
    btn.style.border = "1px solid #273d40";
}