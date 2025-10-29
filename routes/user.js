//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function (req, res) {
    message = "";
    if (req.method == "POST") {
        var post = req.body;
        var name = post.user_name;
        var pass = post.password;
        var fname = post.first_name;
        var lname = post.last_name;
        var mob = post.mob_no;

        var sql =
            "INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`user_name`, `password`) VALUES ('" +
            fname +
            "','" +
            lname +
            "','" +
            mob +
            "','" +
            name +
            "','" +
            pass +
            "')";

        var query = db.query(sql, function (err, result) {
            message = "Account has been successfuly created!.";
            res.render("signup.ejs", {message: message});
        });
    } else {
        res.render("signup");
    }
};

//-----------------------------------------------login page call------------------------------------------------------
exports.login = function (req, res) {
    var message = "";
    var sess = req.session;

    if (req.method === "POST") {
        var post = req.body;
        var name = post.user_name;
        var pass = post.password;

        db.query( 'SELECT * FROM users WHERE user_name = ? AND password = ?',
            [name, pass], function (err, results) {
            if (results.length) {
                req.session.userId = results[0].id;
                req.session.user = results[0];
                console.log(results[0].id);
                res.redirect("/home/dashboard");
            } else {
                message = "Incorrect Username/Password.";
                res.render("index.ejs", {message: message});
            }
        });
    } else {
        res.render("index.ejs", {message: message});
    }
};
//-----------------------------------------------dashboard page functionality----------------------------------------------

exports.dashboard = function (req, res, next) {
    var user = req.session.user,
        userId = req.session.userId;
    console.log("UserID=" + userId);
    if (userId == null) {
        res.redirect("/login");
        return;
    }

    var sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";

    db.query(sql, function (err, results) {
        var sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";
    });
    db.query(sql, function (err, result) {
        res.render("dashboard.ejs", {data: result});
    });
};

//-----------------------------------------------recents page functionality----------------------------------------------

exports.recents = function (req, res, next) {
    var user = req.session.user,
        userId = req.session.userId;
    console.log("UserID=" + userId);
    if (userId == null) {
        res.redirect("/login");
        return;
    }
    var zero_query = function (callback) {
        var sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";
        db.query(sql, function (err, results) {
            if (err) throw err;
            return callback;
        });
    };

    var first_query = function (callback) {
        var sql = "SELECT time, sanitiser, temp FROM userdata ORDER BY time DESC";
        db.query(sql, function (err, data, fields) {
            if (err) throw err;
            return callback(data);
        });
    };
    var second_query = function (callback) {
        var sql =
            "SELECT dayname(`time`) AS 'day', COUNT(*) AS 'number_of_users' FROM `userdata` GROUP BY DAY(`time`) ORDER BY DAY DESC";
        db.query(sql, function (err, data, fields) {
            if (err) throw err;
            return callback(data);
        });
    };
    var third_query = function (callback) {
        var sql =
            "SELECT monthname(`time`) AS 'day', COUNT(*) AS 'number_of_users' FROM `userdata` GROUP BY MONTH(`time`) ORDER BY time DESC";
        db.query(sql, function (err, data, fields) {
            if (err) throw err;
            return callback(data);
        });
    };
    var fourth_query = function (callback) {
        var sql =
            "SELECT weekday(`time`) AS 'week', COUNT(*) AS 'number_of_users' FROM `userdata` GROUP BY WEEK(`time`) ORDER BY WEEK DESC";
        db.query(sql, function (err, data, fields) {
            if (err) throw err;
            return callback(data);
        });
    };
    zero_query;
    first_query(function (data) {
        second_query(function (data2) {
            third_query(function (data3) {
                fourth_query(function (data4) {
                    res.render("recents", {
                        title: "Entries",
                        userData: data,
                        userData2: data2,
                        userData3: data3,
                        userData4: data4,
                    });
                });
            });
        });
    });
};
//------------------------------------logout functionality----------------------------------------------
exports.logout = function (req, res) {
    req.session.destroy(function (err) {
        res.redirect("/login");
    });
};
//--------------------------------render user details after login--------------------------------
exports.profile = function (req, res) {
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }

    var sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";
    db.query(sql, function (err, result) {
        res.render("profile.ejs", {data: result});
    });
};

//-----------------------------------------------charts page functionality----------------------------------------------

exports.charts = function (req, res, next) {
    var user = req.session.user,
        userId = req.session.userId;
    console.log("UserID=" + userId);
    if (userId == null) {
        res.redirect("/login");
        return;
    }

    var sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";

    db.query(sql, function (err, results) {
        res.render("charts.ejs", {user: user});
    });
};

//-----------------------------------------------export page functionality----------------------------------------------

exports.export = function (req, res, next) {
    var user = req.session.user,
        userId = req.session.userId;
    console.log("UserID=" + userId);
    if (userId == null) {
        res.redirect("/login");
        return;
    }

    var sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";

    db.query(sql, function (err, results) {
        res.render("export.ejs", {user: user});
    });
};
//---------------------------------edit users details after login----------------------------------
exports.editprofile = function (req, res) {
    var userId = req.session.userId;
    if (userId == null) {
        res.redirect("/login");
        return;
    }

    var sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";
    db.query(sql, function (err, results) {
        res.render("edit_profile.ejs", {data: results});
    });
};
