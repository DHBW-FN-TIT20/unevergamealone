const modal_el = document.getElementById('info-modal');
const modal_obj = new bootstrap.Modal(modal_el);


function show_modal(header, msg){
    document.getElementById("info-msg-header").innerHTML = header;
    document.getElementById("info-msg").innerHTML = msg;
    modal_obj.show();
}