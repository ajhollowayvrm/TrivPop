/*

AJ Holloway
May 2018


This file defines all of the functionality of
user operations.


*/


current_user = null;
custom_game_pref_obj = {};

function isUserLoggedIn() {
    if(getCookie('email') && getCookie('admin')) {
        var msg = "You are logged in as " + getCookie('email') + ". <br> Would you like to continue as this user?";
        $('.alreadyAuthMsg').html(msg);
        moveToTile('alreadyAuthenticated');
    }
}

//Login Functions
function login() {
    $('#Log_In_Btn').startLoading();
    current_user = new User($('#loginEmail').val(), getAuthObj()) 

    setTimeout(() => {
        if(current_user.isAuthenticated) {
            $('#Log_In_Btn').stopLoading("positive");
            setTimeout(() => {
                moveToTile('mainGame');
                $('#Log_In_Btn').stopLoading();
                $('#Log_In_Btn').css('background','#444');
                $('#loginEmail').val("");
                $('#loginPwd').val("");
            }, 1500)
        } else {
            $('#Log_In_Btn').stopLoading("negative");
        }
    }, 1000)

}

function signUp() {
    $('#Sign_Up_Btn').startLoading();
    current_user = new User($('#signUpEmail').val(),getAuthObj(), getPrefObj(), 0, 'false');
        setTimeout(() => {
            if(current_user.isAuthenticated) {
                $('#Sign_Up_Btn').stopLoading("positive");
                setTimeout(() => {
                    moveToTile('mainGame');
                    $('#Sign_Up_Btn').stopLoading();
                    $('#Sign_Up_Btn').css('background','#444');
                    $('#signUpEmail').val("");
                    $('#signUpPwd').val("");
                }, 1500)
            } else {
                $('#Sign_Up_Btn').stopLoading("negative");
            }
        }, 1000)  
}

function togglePwdVisibility() {
    var pwd_field = document.getElementById("loginPwd");
    if (pwd_field.type === "password") {
        pwd_field.type = "text";
    } else {
        pwd_field.type = "password";
    }
}


function getPrefObj() {
    var vals = $('#signUpForm').children().map(function() {if(this.value != "") return this.value })

    return {
        "prefNoQues":vals[2],
        "prefcat":vals[3],
        "prefdiff":vals[4],
        "preftype":vals[5]
    }
}

function getAuthObj() {

    switch($.getCurrentTile().getTileName()) {
        case 'login':
            return {"email":$('#loginEmail').val(), "pwd":$('#loginPwd').val()};
            break;

        case 'signUp':
            return {"email":$('#signUpEmail').val(), "pwd":$('#signUpPwd').val()}
            break;

        default:
            console.error('Specified Tile does not have defined auth object.');
            break;
    }

}

function getUser(email, btn) {
    btn = btn || null;

    $.get(user_config.get_user + email, (res) => {
        current_user = new User(res['email'], null, res['pref_obj'], res['admin'], 'false')
        $(btn).stopLoading('positive');
    })
    .fail((msg) => {
        $(btn).stopLoading('nagative');
    })


}

// function getToken(option) {
//     option = false || null;

//     if(getCookie('token')) {
//         return getCookie('token')
//     } else if(option == true) {
//         $.get(trivia_api.getToken, (res) => {
//             setCookie('token', res['token'], 4)
//         })
//     } else {
//         {
//             $.get(trivia_api.getToken, (res) => {
//                 setCookie('token', res['token'], 4)
//             })
//             return getCookie('token');
//         }
//     }
// }

function populatePreferences() {
    x = current_user['pref_obj']
    $('#pref_noOfQues').val(x['prefNoQues']);
    $('#pref_cat').val(x['prefcat']);
    $('#pref_diff').val(x['prefdiff']);
    $('#pref_type').val(x['preftype']);
}

function updatePreferences(btn) {
    $(btn).startLoading();
    var pref_obj = getPrefUpdateObj();
    pref_obj.email = current_user['email'];

    $.ajax({
        type: "POST",
        url: user_config.update_preferences,
        headers: {
            'Content-type':"application/json"
        },
        data: JSON.stringify(pref_obj),
        crossOrigin: true,
        success: function() {
            getUser(current_user['email']);
            setTimeout(() => {$(btn).stopLoading('positive'); setTimeout(() => {moveToTile('mainGame'); $(btn).stopLoading(); $(btn).css('background','#444');},2000)},2000)
        },
        error: function(e) {
            $(btn).stopLoading('negative')
            console.error('Error in updatePreferences: ' + e['errorMessage']);
        }
    })
}

function getPrefUpdateObj() {
    var vals = $('#prefForm').children().map(function() {if(this.value != "") return this.value })

    return {
        "prefNoQues":vals[0],
        "prefcat":vals[1],
        "prefdiff":vals[2],
        "preftype":vals[3]
    }
}
