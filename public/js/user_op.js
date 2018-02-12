$(document).ready(function() {

    //Set up button functions.
    $('#Log_In').click(function() {
        moveToTile('login');
    });
    $('#Log_In_Btn').click(function() {
        login();
    })
    $('#Sign_Up_Btn').click(function() {
        moveToTile('signUp');
    });
    $('#showBox').click(function() {
        togglePwdVisibility();
    })
    $('.backArrow').click(function() {
        moveToTile('main');
    })
})


class User {
    constructor(email, pwd, perf_obj, admin) {

        if(arguments.lenth > 2) {

        }
        this.auth_obj = {
            "email":email,
            "pwd":pwd
        }
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
                    alert(res.errorMessage);
                    return;
                }

            },
            error: function(e) {
                alert('Error: ' + e);
            }
        })
    }

    newUser(email, pwd, pref_obj, admin) {

    }
}


//Login Functions
function togglePwdVisibility() {
    var pwd_field = document.getElementById("pwd");
    if (pwd_field.type === "password") {
        pwd_field.type = "text";
    } else {
        pwd_field.type = "password";
    }
}

function login() {
    var user = new User($('#loginEmail').val(), $('#loginPwd').val())
    console.log(user);
    user.authenticate(); 
}


function moveToTile(tile_name) {
    $.getCurrentTile().hideTile();
    $.getTile(tile_name).showTile();
}


//----------------------Utilities--------------------//

tiles = $('div[tile]');

//Custom jQuery functions
(function($) {
    $.fn.getTileName = function() {
        return this.attr('tile');
    };
}(jQuery));

(function($) {
    $.fn.getTileView = function() {
        return this.attr('tileview');
    };
}(jQuery));

jQuery.getTile = function(tile_name) {
    return $($("div[tile='" + tile_name + "']")[0])
};

jQuery.getCurrentTile = function(tile_name) {
    return $($("div[tileview='yes']")[0])
}; 

(function($) {
    $.fn.showTile = function() {
        this.fadeIn('slow').attr({'tileview':'yes'});
    };
}(jQuery));

(function($) {
    $.fn.hideTile = function() {
        $(this).fadeOut('slow').attr({'tileview':'no'});
}
}(jQuery));