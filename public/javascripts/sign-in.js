/**
 * @module Client_SignIn
 */

/**
 * Do the post request to sign in
 * @param {object} form
 * @returns {Boolean} False to not reload the page
 */
function sign_in(form) {
    const formData = new FormData(form);
    let data = {};

    for (var pair of formData.entries()) {
        data[pair[0]] = pair[1];
    }

    $.ajax('/users/sign-in', {
        method: 'POST',
        data: data,
        success: (data, textStatus, jqXHR) => {
            window.location.replace("/gaming");
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error('Wrong credetials');
            console.error(`${textStatus}: ${jqXHR.responseText} => ${errorThrown}`);
            show_modal("Fehler", jqXHR.responseJSON.msg);
        },
    });

    return false;
}