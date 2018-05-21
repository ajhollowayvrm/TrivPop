/*

AJ Holloway
May 2018


This file defines the User class. Every new user creates 
a new instance of this class. From this new instance, all 
of the game functionalities are available.


*/

class User {
    constructor(email, auth_obj, pref_obj, option) {
        pref_obj = pref_obj || null;
        option = option || null;

        //Define the User's attributes. 
        this.isAuthenticated = 0;
        this.email = null;
        this.pref_obj = null;
        this.auth_obj = null;
        this.token = null

        //Based on given args, determine if initUser or authenticate needs to be called.

        /*
        This option is for users returning to the same browser 
        who don't need to go through the processes of being authenticated or initialized.
        */
        if(option == 'false') { 

            this.isAuthenticated = true; 
            this.email = email
            this.auth_obj = null;
            this.pref_obj = pref_obj;
        }
        /*
        This option is for logging in (authenticating).
        */
        else if(pref_obj == null) {
            this.auth_obj = auth_obj;
            this.authenticate();
        } 
        /*
        This option is for registering (initializing) users.
        */
        else {
            this.email = email;
            this.pref_obj = pref_obj;
            this.auth_obj = auth_obj;
            this.initUser()
        }


    }


    authenticate() {
        if(this.auth_obj.email == "" || this.auth_obj.email == undefined) {
            alertify.alert("Uh Oh!","User is missing an email.");
            return;
        }
        else if(this.auth_obj.pwd == "" || this.auth_obj.pwd == undefined) {
            alertify.alert("Uh Oh!","User is missing a password.");
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
                    alertify.alert("Uh Oh!","Error in Authenticate: " + res.errorMessage);
                    return;
                }

                if(res == "Incorrect Email") {
                    alertify.alert("Uh Oh!","Incorrect Email");
                    return;
                }

                if(res == "Incorrect Password") {
                    alertify.alert("Uh Oh!","Incorrect Password");
                    return;
                }

                this.isAuthenticated = true;
                this.pref_obj = res['pref_obj'];
                this.email = this.auth_obj['email'];   
                this.createAuthCookie();             
            },
            error: function(e) {
                alertify.alert("Uh Oh!",'Error in Authenticate: ' + e);
            }
        })
    }

    initUser() {
        if(this.email == "" || this.email == undefined) {
            alertify.alert("Uh Oh!","User is missing an email.");
            return;
        }
        else if(this.auth_obj['pwd'] == "" || this.auth_obj['pwd'] == undefined) {
            alertify.alert("Uh Oh!","User is missing a Password.");
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
            "preftype":"$input.path('$.preftype')"
        }*/

        if(!this.emailIsUnique()) {
            alertify.alert("Uh Oh!","Email is not unique.")
            return;
        }
        

        let register_obj = {
            "email":this.email,
            "pwd":this.auth_obj['pwd'],
            "prefNoQues":this.pref_obj['prefNoQues'],
            "prefcat":this.pref_obj['prefcat'],
            "prefdiff":this.pref_obj['prefdiff'],
            "preftype":this. pref_obj['preftype'],
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
                    alertify.alert("Uh Oh!","Error in InitUser: " + res.errorMessage);
                    return;
                }
                this.authenticate();
            },
            error: function(e) {
                alertify.alert("Uh Oh!",'Error in InitUser: ' + e);
            }
        })
    }

    createAuthCookie() {
        if(this.isAuthenticated) {
            setCookie('email',this.email, 3);
        }
    }

    logout() {
        eraseCookie('email');
    }

    //Utilities

    emailIsUnique() {
        $.get(user_config.isEmailUnique + this.email, (res) => {
            return res;
        })
    }
}