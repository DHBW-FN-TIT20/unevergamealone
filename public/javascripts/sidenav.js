window.onload = (event) => { document.getElementById("sidenav").style.width = "0px"; };

function openSidenav() {
    var sidenav = document.getElementById("sidenav");
    if (sidenav.style.width == "0px") {
        sidenav.style.width = "250px";
        btn = document.getElementById("btn-sidenav");
        btn.innerHTML = "X";
        btn.style.border = "1px solid #F7F3F6";
    } else {
        closeSidenav();
    }
}

function closeSidenav() {
    document.getElementById("sidenav").style.width = "0px";
    btn = document.getElementById("btn-sidenav");
    btn.innerHTML = "☰";
    btn.style.border = "1px solid #273d40";
}