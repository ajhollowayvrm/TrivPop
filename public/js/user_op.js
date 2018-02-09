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
    $(getCurrentTile()).fadeOut().attr({'tileview':'no'});
    $("[tile='" + tile_name + "']").fadeIn().attr({'tileview':'yes'})
}

function getCurrentTile() {
    $('#main-container').each(function() {
        if($(this).tileview() == 'yes')
            return this;
    })
}


//----------------------Utilities--------------------//

//Custom jQuery function to get the tile and tileview values.
jQuery.fn.extend({
    tile: function() {
        return this.attr('tile');
    },
    tileview: function() {
        return this.attr('tileview');
    }
})