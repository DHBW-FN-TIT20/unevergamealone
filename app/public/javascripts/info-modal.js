/**
 * @module Client_InfoModal
 */
const modal_el = document.getElementById('info-modal');
const modal_obj = new bootstrap.Modal(modal_el);


/**
 * Show the info_modal with the given params
 * @param {string} header HTML-Text that will be inserted in the header
 * @param {string} msg HTML-Text that will be inserted in the body
 */
function show_modal(header, msg) {
    document.getElementById("info-msg-header").innerHTML = header;
    document.getElementById("info-msg").innerHTML = msg;
    modal_obj.show();
}