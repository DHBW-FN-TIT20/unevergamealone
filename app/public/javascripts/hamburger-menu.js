/**
 * @module Client_Nav
 */

/**
 * Make the links from the ham
 * @param {object} form 
 * @returns {Boolean} False to not reload the page
 */
function toggleHamburgerMenu() {
    var x = document.getElementById("hamburger-links");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
    var y = document.getElementById("hamburger-menu-btn");
    if (y.innerHTML === "✖") {
        y.innerHTML = "☰";
        y.style.borderRadius = "15px";
    } else {
        y.innerHTML = "✖";
        y.style.borderRadius = "15px 15px 0px 0px";
    }
}