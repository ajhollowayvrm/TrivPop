/*

AJ Holloway
May 2018


This file contains all of the functionality for 
starting, finishing and scoring a game. 

TO DO:
    1. Incorporate tokens to ensure different questions for each game. 
    2. Handle not having enough questions in a particular category.

*/


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
    answers.length = 0;
    correct_answers.length = 0;
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