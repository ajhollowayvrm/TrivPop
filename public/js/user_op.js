$(document).ready(function() {

    //Set up button functions.
    $('#Log_In_Btn').click(function() {
        login();
    });
    $('#Sign_Up_Btn').click(function() {
        signUp();
    });
})

function login() {
    moveToTile('login');
}

function signUp() {

}

function moveToTile(tile_name) {
    $(getCurrentTile()).hideTile();
    $("[tile='" + tile_name + "']").showTile()
}

function getCurrentTile() {
    return $('#main-container').each(function() {
        if($(this).tileview() == 'yes')
            return this
    })
}


//----------------------Utilities--------------------//

//Custom jQuery functions
(function($) {
    $.fn.tile = function() {
        return this.attr('tile');
    };
}(jQuery));

(function($) {
    $.fn.tileview = function() {
        return this.attr('tileview');
    };
}(jQuery));

(function($) {
    $.fn.showTile = function() {
        this.addClass('coming').attr({'tileview':'yes'});
    };
}(jQuery));

(function($) {
    $.fn.hideTile = function() {
        this.addClass('leaving').attr({'tileview':'no'}).fadeOut('slow');
    };
}(jQuery));