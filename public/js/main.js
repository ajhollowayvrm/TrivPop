/*

AJ Holloway
May 2018


This file defines all of the functionality of
basic site operations.


*/

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
    $('.backArrow:not(.other)').click(function() {
        moveToTile('main');
    })
    $('.logoutButton').click(function() {
        eraseCookie('admin');
        eraseCookie('email');
        moveToTile('main')
    })
    $('#already_yes').click(function() {
        $(this).startLoading();
        getUser(getCookie('email'));
        moveToTile('mainGame');
    })
    $('#already_no').click(function() {
        eraseCookie('admin');
        eraseCookie('email');
        moveToTile('main')
    })
    $('#quick').click(function() {
        startGame('quick');
    })
    $('#custom').click(function() {
        moveToTile('custom');
    })
    $('#startCust').click(function() {
        $(this).startLoading();
        startGame('custom');
        $(this).stopLoading();
    })
    $('#scores').click(function() {
        getScores();
        moveToTile('scores')
    })
    $('#pref').click(function() {
        populatePreferences();
        moveToTile('preferences')
    })
    
    isUserLoggedIn();

})


function moveToTile(tile_name) {
    if($.getTile(tile_name)) {
        $.getCurrentTile().hideTile();
        $.getTile(tile_name).showTile();
    } else {
        console.error(tile_name + " does not exist.")
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
    if($("div[tile='" + tile_name + "']")[0] != undefined) {
        return $($("div[tile='" + tile_name + "']")[0])
    } else {
        return false;
    }
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
        //$(this).attr('name',$(this).html());
        $(this).html('<i class="fas fa-cog fa-spin"></i>');
}
}(jQuery));

(function($) {
    $.fn.stopLoading = function(type) {
        type = type || null;
        $(this).html($(this).attr('name'));
        if(type == "positive") {
            $(this).html('<i class="fas fa-check"></i>').css('background','green');
        } else if(type == "negative") {
            $(this).html('<i class="fas fa-exclamation-circle"></i>').css('background','red');
        } else {
            $(this).html($(this).attr('name'));
        }
}
}(jQuery));

(function($) {
    $.fn.mark = function(type) {
        type = type || null;
        if(type == "positive") {
            $(this).css('background','green');
        } else if(type == "negative") {
            $(this).css('background','red');
        } else if(type == "none") {
            $(this).css('background','#444').css('color','lightskyblue');
        } else {
            $(this).css('background','white').css('color','black');
        }
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
    return false;
}
function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function doubleToSingleParse(item) {
    return item.replace(/"/g, "'")
}

function singleToDoubleParse(input) { //Replaces a single quote with double. 
    return input.replace(/'/g, "\"")
}