class User {
    constructor(email, auth_obj, pref_obj, admin) {
        pref_obj = pref_obj || null;
        admin = admin || null;

        this.admin = 0;
        this.authenticated = 0;
        this.email = null;
        this.pref_obj = null;
        this.auth_obj = null;

        if(pref_obj == null || admin == null) {
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
            url: config.authenticate_user,
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
                this.authenticated = true;
                console.log(this)
                this.email = this.auth_obj['email'];   
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
            "pref#ques":"$input.path('$.pref#ques')",
            "prefcat":"$input.path('$.prefcat')",
            "prefdiff":"$input.path('$.prefdiff')",
            "preftype":"$input.path('$.preftype')",
            "admin":"$input.path('$.admin')"
        }*/

        //TO DO: Check if email is unique. If not, return. 

        let register_obj = {
            "email":this.email,
            "pwd":this.auth_obj['pwd'],
            "pref#ques":this.pref_obj['pref#ques'],
            "prefcat":this.pref_obj['prefcat'],
            "prefdiff":this.pref_obj['prefdiff'],
            "preftype":this. pref_obj['preftype'],
            "admin":this.admin
        }

        $.ajax({
            type: "POST",
            url: config.create_user,
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
        if(this.authenticated) {
            setCookie('email',this.email, 3);
            setCookie('admin','0',3);
        }
    }

    logout() {
        eraseCookie('email');
        eraseCookie('admin');
    }
}