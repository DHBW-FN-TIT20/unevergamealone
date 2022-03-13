const form = document.querySelector("form");
const submit_btn = document.querySelector('input[type=submit]');
const image = document.getElementById('cropper-image');
const gameName_txt = document.getElementById("game-name");
const gameExists_txt = document.getElementById("game-exists");
const cropper = new Cropper(image, {
    viewMode: 1,
    aspectRatio: 5 / 7,
});


/* ####### Bindings ####### */
gameName_txt.addEventListener("input", check_values);


/* ####### Functions ####### */
function check_values() {
    const valid = check_game_name();
    if (valid) {
        submit_btn.disabled = false;
    } else {
        submit_btn.disabled = true;
    }
}

/**
 * Check if the Game already exist
 * @returns Boolean True if name does not exist
 */
function check_game_name() {
    valid = true;
    $.ajax(`/gaming/game/${gameName_txt.value.trim()}`, {
        method: "GET",
        async: false,
        success: (data, textStatus, jqXHR) => {
            gameExists_txt.classList.remove("invisible");
            valid = false;
        },
        error: (jqXHR, textStatus, errorThrown) => {
            gameExists_txt.classList.add("invisible");
            valid = true;
        }
    });
    return valid;
}

function changeCover() {
    const file = document.querySelector('input[type=file]').files[0];
    const reader = new FileReader();

    reader.addEventListener("load", function() {
        // convert image file to base64 string
        cropper.replace(reader.result);
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}


function create_game(form) {
    const gameName = gameName_txt.value.trim();

    // Upload cropped image to server if the browser supports `HTMLCanvasElement.toBlob`.
    // The default value for the second parameter of `toBlob` is 'image/png', change it if necessary.
    cropper.getCroppedCanvas().toBlob((blob) => {
        const formData = new FormData(form);

        // Pass the image file name as the third parameter if necessary.
        formData.set('cover', blob, gameName);

        // Use `jQuery.ajax` method for example
        $.ajax('/gaming/new', {
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            enctype: 'multipart/form-data',
            success: (data, textStatus, jqXHR) => {
                show_modal("Gespeichert!", `${data.name} erfolgreich hinzugefügt<br>`);
                modal_el.addEventListener("hide.bs.modal", (event) => {
                    window.location.replace("/gaming");
                })
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.error('Upload error');
                console.error(`${textStatus}: ${jqXHR.responseText} => ${errorThrown}`);
                show_modal("Error", "Etwas ist schief gelaufen :(<br>Versuche es spaeter nochmal :)");
            },
        });
    });
    return false;
}