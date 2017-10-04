(function () {
    var config = {
        apiKey: "AIzaSyD_FuI6e9zDwsKtzJAgy9OsYsswPjPB6NU",
        authDomain: "el-bondi-server.firebaseapp.com",
        databaseURL: "https://el-bondi-server.firebaseio.com"
        /*,storageBucket: "<BUCKET>.appspot.com",
        messagingSenderId: "<SENDER_ID>",*/
    };
   

    firebase.initializeApp(config);
    //get elements
    const txtEmail = document.getElementById("txtEmail");
    const txtPassword = document.getElementById("txtPassword");
    const btnLogin = document.getElementById("btnLogin");
    const btnLogout = document.getElementById("btnLogout");

    //add login event

    btnLogin.addEventListener("click", e => {
        const email = txtEmail.value;
        const pass = txtPassword.value;
        const auth = firebase.auth();

        const promise = auth.signInWithEmailAndPassword(email, pass);
        promise.catch(e=>console.log("Falied:" + e.message));
    });

    btnLogout.addEventListener("click",e=>{
        firebase.auth().signOut();
    })

    firebase.auth().onAuthStateChanged(user=>{
        if(user){
            console.log(user);
            btnLogout.classList.remove("hide");
        }else{
            console.log("Not logged in");
        }
    });

     // function addNewAdmin(){
    //     var email = "elbondi.cerveceria@gmail.com";
    //     var pass = "17ebcn17";
        
    //     firebase.auth().createUserWithEmailAndPassword(email,pass);
    // };
    
    // addNewAdmin();

}());