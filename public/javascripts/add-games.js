const checkboxes = document.querySelectorAll('input[type=checkbox]');
const submit_btn = document.querySelector('input[type=submit]');
const search = document.getElementById("searching");


/* ####### Checkbox Bindigns ####### */
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        // Enable submit btn if at least one Checkbox is checked
        const checked = document.querySelectorAll('input[type=checkbox]:checked');
        if (checked.length != 0) {
            submit_btn.disabled = false;
        }
        else {
            submit_btn.disabled = true;
        }
    })
});

/* ####### Textbox Bindings ####### */
search.addEventListener("input", filter_games);


/* ####### Functions ####### */

function save_games (form) {
    const checked_games = document.querySelectorAll('input[type=checkbox]:checked');
    games = {games: []};
    checked_games.forEach(game => {
        games.games.push({game_id: game.value});
    });
    $.ajax({
        method: "POST",
        url: "/gaming/add",
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(games),
        success: (data, textStatus, jqXHR ) => {
            console.log(`Data reviced: ${JSON.stringify(data)}`);
            alert("Spiele erfolgreich hinzugefügt!");
            window.location.replace("/gaming/");
        },
        error: (jqXHR, textStatus, errorThrown ) => {
            console.error(`${textStatus}: ${jqXHR.responseText} => ${errorThrown}`);
            alert("Etwas ist schief gelaufen :(\nversuche es spaeter nochmal :)");
        }
    });
    return false;
}

function filter_games(){
    all_games = document.querySelectorAll(`.game-panel`);
    all_games.forEach(game => {
        if (game.getAttribute("name").includes(search.value)) {
            game.classList.remove('invisible');
        }
        else {
            game.classList.add('invisible');
        }
    });
}