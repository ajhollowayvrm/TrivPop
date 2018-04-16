class User {
    constructor(email, auth_obj, pref_obj, admin, option) {
        pref_obj = pref_obj || null;
        admin = admin || null;
        option = option || null;

        //Define the User's attributes. 
        this.admin = 0;
        this.isAuthenticated = 0;
        this.email = null;
        this.pref_obj = null;
        this.auth_obj = null;

        //Based on given args, determine if initUser or authenticate needs to be called.
        if(option == 'false') {
            //Skip authentication or init. 
            this.isAuthenticated = true; 
            this.admin = admin
            this.email = email
            this.auth_obj = null;
            this.pref_obj = pref_obj;
        }
        else if(pref_obj == null || admin == null) {
            this.auth_obj = auth_obj;
            this.authenticate();
        } else {
            this.email = email;
            this.pref_obj = pref_obj;
            this.auth_obj = auth_obj;
            this.admin = admin || 0;
            this.initUser()
        }


    }


    authenticate() {
        if(this.auth_obj.email == "" || this.auth_obj.email == undefined) {
            console.error("User is missing an email.");
            return;
        }
        else if(this.auth_obj.pwd == "" || this.auth_obj.pwd == undefined) {
            console.error("User is missing a password.");
            return;
        }

        $.ajax({
            type: "POST",
            url: user_config.authenticate_user,
            headers: {
                'Content-type':"application/json"
            },
            data: JSON.stringify(this.auth_obj),
            crossOrgin: true,
            success: (res) => {
                if(res.errorMessage) {
                    console.error("Error in Authenticate: " + res.errorMessage);
                    return;
                }

                if(res == "Incorrect Email") {
                    alert("Incorrect Email");
                    return;
                }

                if(res == "Incorrect Password") {
                    alert("Incorrect Password");
                    return;
                }

                this.isAuthenticated = true;
                this.pref_obj = res['pref_obj'];
                this.email = this.auth_obj['email'];   
                this.admin = res['admin'];
                this.createAuthCookie();             
            },
            error: function(e) {
                console.error('Error in Authenticate: ' + e);
            }
        })
    }

    initUser() {
        if(this.email == "" || this.email == undefined) {
            console.error("User is missing an email.");
            return;
        }
        else if(this.auth_obj['pwd'] == "" || this.auth_obj['pwd'] == undefined) {
            console.error("User is missing a Password.");
            return;
        }
        
        /*
        Create_User Body Mapping
        {
            "email":"$input.path('$.email')",
            "pwd":"$input.path('$.pwd')",
            "prefNoQues":"$input.path('$.prefNoQues')",
            "prefcat":"$input.path('$.prefcat')",
            "prefdiff":"$input.path('$.prefdiff')",
            "preftype":"$input.path('$.preftype')",
            "admin":"$input.path('$.admin')"
        }*/

        if(!this.emailIsUnique) {
            console.error("Email is not unique.")
        }
        

        let register_obj = {
            "email":this.email,
            "pwd":this.auth_obj['pwd'],
            "prefNoQues":this.pref_obj['prefNoQues'],
            "prefcat":this.pref_obj['prefcat'],
            "prefdiff":this.pref_obj['prefdiff'],
            "preftype":this. pref_obj['preftype'],
            "admin":this.admin
        }

        $.ajax({
            type: "POST",
            url: user_config.create_user,
            headers: {
                'Content-type':"application/json"
            },
            data: JSON.stringify(register_obj),
            crossOrgin: true,
            success: (res) => {
                if(res.errorMessage) {
                    console.error("Error in InitUser: " + res.errorMessage);
                    return;
                }
                this.authenticate();
            },
            error: function(e) {
                console.error('Error in InitUser: ' + e);
            }
        })
    }

    createAuthCookie() {
        if(this.isAuthenticated) {
            setCookie('email',this.email, 3);
            setCookie('admin','0',3);
        }
    }

    logout() {
        eraseCookie('email');
        eraseCookie('admin');
    }

    //Utilities

    emailIsUnique() {
        $.get(user_config.isEmailUnique + this.email, (res) => {
            return res;
        })
    }
}