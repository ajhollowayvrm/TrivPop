current_user = null;
correct_answers = [];
answers = [];
custom_game_pref_obj = {};

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

function isUserLoggedIn() {
    if(getCookie('email') && getCookie('admin')) {
        var msg = "You are logged in as " + getCookie('email') + ". <br> Would you like to continue as this user?";
        $('.alreadyAuthMsg').html(msg);
        moveToTile('alreadyAuthenticated');
    }
}

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
    current_user = new User($('#signUpEmail').val(),getAuthObj(), getPrefObj(), 'false');
    //TO DO: Make sure email is unique. 
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


function moveToTile(tile_name) {
    if($.getTile(tile_name)) {
        $.getCurrentTile().hideTile();
        $.getTile(tile_name).showTile();
    } else {
        console.error(tile_name + " does not exist.")
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

function startGame(type) {
    formQuestions(type);
    $('#' + type).startLoading();
    setTimeout(() => {
        moveToTile('game0');
        $('#' + type).stopLoading();
    }, 2000);
}

function formQuestions(type) {
    if(type == "quick") {
        for (let i = 0; i < parseInt(current_user['pref_obj']['prefNoQues']); i++) {
            answers.push(" ");
        }
        url = makeUrl(type, current_user['pref_obj'])
    } else if(type == "custom") {
        for (let i = 0; i < parseInt($('#cust_numQues').val()); i++) {
            answers.push(" ");
        }
        custom_game_pref_obj = {'prefNoQues':$('#cust_numQues').val(), 'prefcat':$('#cust_cat').val(), 'prefdiff':$('#cust_diff').val(), 'preftype':$('#cust_type').val()}
        url = makeUrl(type, custom_game_pref_obj)
    }



    $.get(url, (res) => {

        if(res['response_code'] == "1") {
            alert("There aren't enough questions in the database to fulfil your request! Please change your preferences.");
            populatePreferences();
            moveToTile('preferences');
            return;
        }

        if(res['response_code'] != "0") {
            alert("There has been an error");
            return;
        }

        res['results'].forEach((element, index) => {
            if(index == 0) {
                var append_str = `
                <div class='main-container prehide' tile='game` + index + `' tileview='no'>
                    <p class='forwardArrow' style='display: inline;' onclick="moveToTile('game1')"><i class="fas fa-arrow-right fa-2x"></i>    </p>
                    <h2 style='color: white; font-size: 30px;' class='question'>` + element['question'] + `</h2>
                    <br><br>
                `
            }
            // else if(index == ((res['results']).length - 1)) {
            //     var append_str = `
            //     <div class='main-container prehide' tile='game` + index + `' tileview='no'>
            //         <p class='backArrow' style='display: inline;'>   <i class="fas fa-arrow-left fa-2x" onclick="moveToTile('game` + (index - 1) + `')"></i></p>
            //         <h2 style='color: white; font-size: 30px;' class='question'>` + element['question'] + `</h2>
            //         <br><br>
            //     `
            // }
            else {
                var append_str = `
                <div class='main-container prehide' tile='game` + index + `' tileview='no'>
                    <p class='backArrow' style='display: inline;'>   <i class="fas fa-arrow-left fa-2x" onclick="moveToTile('game` + (index - 1) + `')"></i>  </p>  <p class='forwardArrow' style='display: inline;' onclick="moveToTile('game` + (index + 1) + `')">  <i class="fas fa-arrow-right fa-2x"></i>    </p>
                    <h2 style='color: white; font-size: 30px;' class='question'>` + element['question'] + `</h2>
                    <br><br>
                `
            }


            if(element['type'] == "multiple") {
                element['incorrect_answers'].push(element['correct_answer']);
                correct_answers.push({'answer': element['correct_answer'], 'difficulty':element['difficulty']});
                var answers = shuffle(element['incorrect_answers']);
                var answers_str = `<div class="main-game-wrapper four-box">`;
                var count = ['one', 'two', 'three', 'four'];

                for (let i = 0; i < (element['incorrect_answers']).length; i++) {
                    answers_str = answers_str + `
                        <div class="box ` + count[i] + ` hover" id='` + answers[i] + `' onclick="answers[` + index + `] = ($(this).attr('id')); $(this).parent().find('.box').each(function() { $(this).mark('none'); });  $(this).mark();">` + answers[i] + `</div>
                    `
                }

                append_str = append_str + answers_str + `
                    </div>
                    <br><br>
                    </div>
                `;
            }
            else {
                var answers = ['True','False'];
                correct_answers.push({'answer': element['correct_answer'], 'difficulty':element['difficulty']});
                append_str = append_str + `
                        <div class="main-game-wrapper two-box">
                            <div></div>
                            <div class="box hover" id="True" onclick="answers[` + index + `] = ($(this).attr('id')); $(this).parent().find('.box').each(function() { $(this).mark('none'); }); $(this).mark();">True</div>
                            <div class="box hover" id="False" onclick="answers[` + index + `] = ($(this).attr('id')); $(this).parent().find('.box').each(function() { $(this).mark('none'); });  $(this).mark();">False</div>
                            <div></div>
                        </div>
                        <br><br><br>
                    </div>
                `
                
            }

            $('body').append(append_str);
        });

        if(type == 'quick') {
            var append_str = `
            <div class='main-container prehide' tile='game` + (res['results']).length + `' tileview='no'>
                <p class='backArrow' style='display: inline;'>   <i class="fas fa-arrow-left fa-2x" onclick="moveToTile('game` + ((res['results']).length - 1) + `')"></i></p>
                <h2 style='color: white; font-size: 30px;' class='question'>You've reached the end!</h2>
                <br><br>
                <div class="login-wrapper">
                <div class="box login-box" id="submit" onclick="getScore();">See My Results!</div>
                </div>
                <br><br>
            </div>
            `
        } else {
            var append_str = `
            <div class='main-container prehide' tile='game` + (res['results']).length + `' tileview='no'>
                <p class='backArrow' style='display: inline;'>   <i class="fas fa-arrow-left fa-2x" onclick="moveToTile('game` + ((res['results']).length - 1) + `')"></i></p>
                <h2 style='color: white; font-size: 30px;' class='question'>You've reached the end!</h2>
                <br><br>
                <div class="login-wrapper">
                <div class="box login-box" id="submit" onclick="getScore(custom_game_pref_obj);">See My Results!</div>
                </div>
                <br><br>
            </div>
            `
        }


        $('body').append(append_str);
    })

}

function makeUrl(type, pref) {
    var url = "";

        url = trivia_api.getQuestions + pref['prefNoQues'];

        if(pref['prefcat'] != '0') {
            url = url + "&category=" + pref['prefcat']
        }
        if(pref['prefdiff'] != 'all') {
            url = url + "&difficulty=" + pref['prefdiff']
        }
        if(pref['preftype'] != 'both') {
            url = url + "&type=" + pref['preftype']
        }

    return url
}

function getScore(pref_obj) {
    pref_obj = pref_obj || null;

    if(pref_obj) {
        var obj = {
            "user_pref":doubleToSingleParse(JSON.stringify(pref_obj)),
            "email":current_user['email'],
            "answers":doubleToSingleParse(JSON.stringify(answers)),
            "correct_answers":doubleToSingleParse(JSON.stringify(correct_answers))
        };
    } else {
        var obj = {
            "user_pref":doubleToSingleParse(JSON.stringify(current_user['pref_obj'])),
            "email":current_user['email'],
            "answers":doubleToSingleParse(JSON.stringify(answers)),
            "correct_answers":doubleToSingleParse(JSON.stringify(correct_answers))
        };
    }


    $.ajax({
        type: "POST",
        url: scores_api.record_score,
        headers: {
            'Content-type':"application/json"
        },
        data: JSON.stringify(obj),
        crossOrigin: true,
    success: (res) => {
        if(res.errorMessage) {
            console.error("Error in getScores: " + res.errorMessage);
            return;
        }

        if(res['high_score']) {
            $('.final_score').html(res['final_score'] + " <br><br><h2 style='color: cyan'>NEW HIGH SCORE!</h2>")
        } else {
            $('.final_score').html(res['final_score']);
        }

        moveToTile('results');
        
    },
    error: function(e) {
        console.error('Error in getScores: ' + e);
    }
})
}

function endGame() {
    $("[tile*='game']:not(mainGame)").remove();
    moveToTile('mainGame');
}

function getScores() {
    individual = [];
    overall = [];

    var indiv_table = `
        <h2 style='color: white'>Individual Scores</h2><br>
        <table style='width: 105%;'>
            <thead style='font-weight: bold;'>
                <tr>
                    <td>Score</td>
                    <td>Number of Questions</td>
                    <td>Difficulty</td>
                    <td>Type</td>
                    <td>Category</td>
                </tr>
            </thead>
            <tbody>
    ` 
    var overall_table = `
        <h2 style='color: white'>Overall Scores</h2><br>
        <table style='width: 105%;'>
            <thead style='font-weight: bold;'>
                <tr>
                    <td>Score</td>
                    <td>Player</td>
                    <td>Number of Questions</td>
                    <td>Difficulty</td>
                    <td>Type</td>
                    <td>Category</td>
                </tr>
            </thead>
        <tbody>
    `

    var indiv_append_str = "";
    var overall_append_str = "";

    $.get(scores_api.get_scores, (res) => {
        res.forEach((element) => {
            parsed = (element['id']['S']).split('|');
            email = parsed[0];
            numberOfQuestions = parsed[1]
            difficulty = parsed[4]
            type = parsed[3]
            category = parsed[2]
            score = element['score']['N']

            if(difficulty == "0") {
                difficulty = "any"
            }

            var aggr = {
                "email":email,
                "numberOfQuestions":numberOfQuestions,
                "difficulty":difficulty,
                "type":type,
                "category":category,
                "score":score
            }

            overall.push(aggr);

            if(aggr['email'] == current_user['email']) {
                individual.push(aggr);
            }
        })

        individual.forEach((elem) => {
            indiv_append_str = indiv_append_str + `
                <tr>
                    <td>` + elem['score'] + `</td>
                    <td>` + elem['numberOfQuestions'] + `</td>
                    <td>` + elem['difficulty'] + `</td>
                    <td>` + elem['type'] + `</td>
                    <td>` + elem['category'] + `</td>
                </tr>
            `
        })
        
        overall.forEach((elem) => {
            overall_append_str = overall_append_str + `
            <tr>
                <td>` + elem['score'] + `</td>
                <td>` + elem['email'] + `</td>
                <td>` + elem['numberOfQuestions'] + `</td>
                <td>` + elem['difficulty'] + `</td>
                <td>` + elem['type'] + `</td>
                <td>` + elem['category'] + `</td>
            </tr>
        `
        })

        indiv_table = indiv_table + indiv_append_str + `
                </tbody>
            </table>
        `
        overall_table = overall_table + overall_append_str + `
                </tbody>
            </table>
        `

        $('#individualScores').html(indiv_table);
        $('#overallScores').html(overall_table);
    })
}

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