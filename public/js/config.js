user_config = {};
trivia_api = {};
scores_api = {};

roots = {
    "user":"https://jtyhkyx6pk.execute-api.us-west-2.amazonaws.com/prod/user",
    "scores":"https://jtyhkyx6pk.execute-api.us-west-2.amazonaws.com/prod/scores",
    "trivia": "https://opentdb.com/api.php?",
    "trivia_token":"https://opentdb.com/api_token.php?command=request"
};

//------------------------------- Scores API ------------------------//

scores_api.record_score = roots['scores'] + "/record_score"
scores_api.get_scores = roots['scores'] + "/get_scores"

//------------------------------- User API ------------------------//

user_config.create_user = roots['user'] + "/create";
user_config.get_user = roots['user'] + "/get_user?email=";
user_config.authenticate_user = roots['user'] + "/auth";
user_config.isEmailUnique = roots['user'] + "/unique_email?email=";
user_config.update_preferences = roots['user'] + "/update_preferences";

//------------------------------- Opent DB Trivia API ------------------------//

trivia_api.getQuestions = roots['trivia'] + "amount="
trivia_api.getToken = roots['trivia_token']