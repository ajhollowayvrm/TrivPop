$(document).ready(function() {

    //Set up button functions.
    $('#Log_In').click(function() {
        moveToTile('login');
    });
    $('#Log_In_Btn').click(function() {
        login();
    })
    $('#Sign_Up').click(function() {
        moveToTile('signUp');
    });
    $('#Sign_Up_Btn').click(function() {
        signUp();
    });
    $('#showBox').click(function() {
        togglePwdVisibility();
    })
    $('.backArrow').click(function() {
        moveToTile('main');
    })
})

//Login Functions
function togglePwdVisibility() {
    var pwd_field = document.getElementById("loginPwd");
    if (pwd_field.type === "password") {
        pwd_field.type = "text";
    } else {
        pwd_field.type = "password";
    }
}

function login() {
    var user = new User($('#loginEmail').val(), getAuthObj()) 
    if(user.authenticated) {
        $.moveToTile('mainGame');
    }
}

function signUp() {
    $('#Sign_Up_Btn').startLoading();
    var user = new User($('#signUpEmail').val(),getAuthObj(), getPrefObj(), 'false');
    //TO DO: Make sure email is unique. 
    setTimeout(() => {$('#Sign_Up_Btn').stopLoading();}, 5000)

    
}


function moveToTile(tile_name) {
    $.getCurrentTile().hideTile();
    $.getTile(tile_name).showTile();
}

function getPrefObj() {
    var vals = $('#signUpForm').children().map(function() {if(this.value != "") return this.value })

    return {
        "pref#ques":vals[2],
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

(function($) {
    $.fn.startLoading = function() {
        $(this).attr('name',$(this).html());
        $(this).html('<i class="fas fa-cog fa-spin"></i>');
}
}(jQuery));

(function($) {
    $.fn.stopLoading = function() {
        $(this).html($(this).attr('name'));

}
}(jQuery));

function setCookie(name,value,hours) {
    var expires = "";
    if (hours) {
        var date = new Date();
        date.setTime(date.getTime() + (hours*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}