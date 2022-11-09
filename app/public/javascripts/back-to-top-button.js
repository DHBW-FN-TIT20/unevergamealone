/**
 * @module Client_Index
 */
var btn = document.getElementById("btt-btn");
window.onscroll = function() { detectScroll() };

/**
 * Detect scrolling to make back-to-top button visible
 */
function detectScroll() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
}

/**
 * Scroll to the top of the site
 */
function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}