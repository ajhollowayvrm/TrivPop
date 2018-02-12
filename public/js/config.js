config = [];

roots = {
    "user":"https://jtyhkyx6pk.execute-api.us-west-2.amazonaws.com/prod/user"
};

config.create_user = roots['user'] + "/create";
config.authenticate_user = roots['user'] + "/auth";