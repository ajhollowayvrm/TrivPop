class User {
    constructor() {
        this.authenticated = 0;
        this.email = null;
        this.pref_obj = null;
        this.auth_obj = null;
    }


    authenticate() {
        if(this.auth_obj.email == "" || this.auth_obj.email == undefined) {
            alert("Please enter your email");
            return;
        }
        else if(this.auth_obj.pwd == "" || this.auth_obj.pwd == undefined) {
            alert("Please enter your password");
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
            success: function(res) {
                if(res.errorMessage) {
                    alert("Error in Authenticate: " + res.errorMessage);
                    return;
                }
                this.authenticated = true;
                this.email = auth_obj.email;   
                this.createAuthCookie();             
            },
            error: function(e) {
                alert('Error in Authenticate: ' + e);
            }
        })
    }

    initUser(email, pwd, pref_obj, admin) {
        if(email == "" || email == undefined) {
            alert("Please enter your email");
            return;
        }
        else if(pwd == "" || pwd == undefined) {
            alert("Please enter your password");
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
            "email":email,
            "pwd":pwd,
            "pref#ques":pref_obj['pref#ques'],
            "prefcat":pref_obj['prefcat'],
            "prefdiff":pref_obj['prefdiff'],
            "preftype":pref_obj['preftype'],
            "admin":admin
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
                    alert("Error in InitUser: " + res.errorMessage);
                    return;
                }

                this.email = email;
                this.pref_obj = pref_obj;
                this.auth_obj = {
                    "email":email,
                    "pwd":pwd
                }

                this.authenticate();
            },
            error: function(e) {
                alert('Error in InitUser: ' + e);
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