const checkboxes = document.querySelectorAll('.form-check input[type=checkbox]');

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            let inputUsername = document.getElementById(this.id + "_uName");
            inputUsername.className = "visible";
        } else {
            document.getElementById(this.id + "_uName").className = "invisible";
        }
    })
});

function sign_up(form) {
    const formData = new FormData(form);
    let resultMessage = validateRegister(formData);
    if (resultMessage == "success") {

        $.ajax('/users/sign-up', {
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            enctype: 'multipart/form-data',
            success: (data, textStatus, jqXHR) => {
                window.location.replace("/users/sign-in");
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.error('Upload error');
                console.error(`${textStatus}: ${jqXHR.responseText} => ${errorThrown}`);
                alert(`Etwas ist schief gelaufen :(\n${jqXHR.responseText}`);
            },
        });

    } else {
        document.getElementById("info-msg").innerHTML = resultMessage;
        document.getElementById("info-msg-header").innerHTML = "Fehler bei der Erstellung eines Benutzers.";
        let modal = new bootstrap.Modal(document.getElementById('info-modal'));
        modal.show();
    }
    return false;
}

function validateRegister(formData) {
    // username min length 4
    if (!formData.get("username") || formData.get("username").length < 4) {
        return "Benutzername muss mindestens 4 Zeichen lang sein.";
    }

    //Passwort muss zwischen 6 und 20 Zeichen lang sein
    //Muss eins folgender Sonderzeichen enthalten !#,+-?_
    //Muss eine Zahl enthalten
    if (formData.get("password").length < 8) {
        return "Das Passwort muss mindestens 8 Zeichen lang sein.";
    }

    // password (repeat) does not match
    if (!formData.get("password_repeat") ||
        formData.get("password") != formData.get("password_repeat")
    ) {
        return "Die Passwörter stimmen nicht überein.";
    }

    return "success";
}