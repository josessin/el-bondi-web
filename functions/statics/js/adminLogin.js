(function () {

    //get elements
    const txtEmail = document.getElementById("txtEmail");
    const txtPassword = document.getElementById("txtPassword");
    const btnLogin = document.getElementById("btnLogin");

    //add login event
    btnLogin.addEventListener("click", e => {
        console.log("Login Clicked");
        const email = txtEmail.value;
        const pass = txtPassword.value;
        const auth = firebase.auth();

        const promise = auth.signInWithEmailAndPassword(email, pass);
        promise.catch(function (e) {

            txtEmail.value = "";
            txtPassword.value = "";
            txtEmail.classList.add("error");
            txtPassword.classList.add("error");
            console.log("Falied:" + e.message);
        });

    });

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
                data = { token: idToken }
                post(window.location.href, data);
            });

        } else {
            console.log("no user")
        }
    });

    function post(path, params, method) {
        method = method || "post"; // Set method to post by default if not specified.

        // It can be made less wordy using jquery...
        var form = document.createElement("form");
        form.setAttribute("method", method);
        form.setAttribute("action", path);

        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                var hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute("value", params[key]);

                form.appendChild(hiddenField);
            }
        }

        document.body.appendChild(form);
        form.submit();
    }

}());