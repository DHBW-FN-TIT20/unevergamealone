const checkboxes = document.querySelectorAll('input[type=checkbox]');
const submit_btn = document.querySelector('input[type=submit]');
const search = document.getElementById("searching");

/* ####### Textbox Bindings ####### */
search.addEventListener("input", filter_games);


/* ####### Functions ####### */

/**
 * Do the Post request to the server
 * @param {object} form 
 * @returns {Boolean} False to not reload the page
 */
function save_games(form) {
    const checked_games_obj = document.querySelectorAll('input[type=checkbox]:checked');
    const not_checked_games_obj = document.querySelectorAll('input[type=checkbox]:not(:checked)');

    const checked_games = [];
    const not_checked_games = [];

    checked_games_obj.forEach(game => {
        checked_games.push(game.value);
    });

    not_checked_games_obj.forEach(game => {
        not_checked_games.push(game.value);
    });

    const games = {
        add_game: checked_games,
        removed_games: not_checked_games
    }

    $.ajax({
        method: "POST",
        url: "/gaming/manage",
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(games),
        success: (data, textStatus, jqXHR) => {
            console.log(`Data reviced: ${JSON.stringify(data)}`);

            added_games_html = get_list_from_games(data.games.added_games);
            removed_games_html = get_list_from_games(data.games.removed_games);

            show_modal("Gespeichert!", `Folgende Spiele hinzugefügt:<br>${added_games_html} <br> Folgende Spiele entfernt:<br>${removed_games_html}`);
            modal_el.addEventListener("hide.bs.modal", (event) => {
                window.location.replace("/gaming");
            })
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error(`${textStatus}: ${jqXHR.responseText} => ${errorThrown}`);
            show_modal("Error", "Etwas ist schief gelaufen :(<br>Versuche es spaeter nochmal :)");
        }
    });
    return false;
}

/**
 * 
 * @param {Array.<object>} games Games need to habe .name property
 * @returns string html string for <ul>
 */
function get_list_from_games(games) {
    list = "<ul>";

    games.forEach(game => {
        list += `<li>${game.name}</li>`;
    });

    list += "</ul>";

    return list;
}

function delete_game(btn) {
    const game_id = btn.getAttribute("data-gameId");

    const data = {
        game_id: game_id
    }

    $.ajax({
        method: "POST",
        url: "/gaming/delete",
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(data),
        success: (data, textStatus, jqXHR) => {
            if (data.status != "error") {
                console.log(`Data reviced: ${JSON.stringify(data)}`);
                alert("Spiele erfolgreich gelöscht!");
                location.reload();
            } else {
                console.error(`${textStatus}: ${data.msg}`);
                alert("Da ist etwas schief gelaufen :(");
            }
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error(`${textStatus}: ${jqXHR.responseText} => ${errorThrown}`);
            alert("Etwas ist schief gelaufen :(\nversuche es spaeter nochmal :)");
        }
    });
}


/**
 * Only show the matched game titles insert in the "search" text
 */
function filter_games() {
    all_games = document.querySelectorAll(`.manage-game-panel`);
    all_games.forEach(game => {
        if (game.getAttribute("name").includes(search.value)) {
            game.classList.remove('invisible');
        } else {
            game.classList.add('invisible');
        }
    });
}