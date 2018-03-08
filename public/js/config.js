user_config = [];

roots = {
    "user":"https://jtyhkyx6pk.execute-api.us-west-2.amazonaws.com/prod/user"
};

user_config.create_user = roots['user'] + "/create";
user_config.authenticate_user = roots['user'] + "/auth";
user_config.isEmailUnique = roots['user'] + "/unique_email?email="