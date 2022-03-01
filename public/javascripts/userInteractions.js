const checkboxes = document.querySelectorAll('.form-checkbox input[type=checkbox]');

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            let inputUsername = document.getElementById(this.id + "_uName");
            inputUsername.className = "visible";
        } else {
            document.getElementById(this.id + "_uName").className = "invisible";
        }
    })
});