(function () {

    var user = firebase.auth().currentUser;
    if(user){
        
    }

    firebase.auth().signOut();
    //get elements
    const txtEmail = document.getElementById("txtEmail");
    const txtPassword = document.getElementById("txtPassword");
    const btnLogin = document.getElementById("btnLogin");
    const btnLogout = document.getElementById("btnLogout");

    //add login event

    btnLogin.addEventListener("click", e => {
        console.log("Login Clicked");
        const email = txtEmail.value;
        const pass = txtPassword.value;
        const auth = firebase.auth();

        const promise = auth.signInWithEmailAndPassword(email, pass);
        promise.catch(e => console.log("Falied:" + e.message));

    });

    btnLogout.addEventListener("click", e => {
        firebase.auth().signOut();
        console.log("logged out")
    })

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            btnLogout.classList.remove("hide");
            post(window.location.href, firebase.auth().currentUser);
        } else {
            console.log("no user")
        }
    });

    // function addNewAdmin(){
    //     var email = "elbondi.cerveceria@gmail.com";
    //     var pass = "17ebcn17";

    //     firebase.auth().createUserWithEmailAndPassword(email,pass);
    // };


    function post(path, params, method) {
        method = method || "post"; // Set method to post by default if not specified.

        // The rest of this code assumes you are not using a library.
        // It can be made less wordy if you use one.
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