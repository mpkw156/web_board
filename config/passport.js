var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User');

// serialize & deserialize User
passport.serializeUser(function(user, done){//로그인시에 DB에서 발견한 user를 어떻게 session에 저장할지 정하는 부분.
    done(null, user.id);//session에 user정보가 전부 저장되면 성능 저하, user.id만 저장
});
passport.deserializeUser(function(id, done){//request시에 session에서 어떻게  user object를 만들지 정하는 부분.
    User.findOne({_id:id}, function(err, user){
        done(err, user);
    });
});

// local strategy
passport.use('local-login',
new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true
    },
    function(req, username, password, done){
        User.findOne({username:username})
        .select({password:1})
        .exec(function(err, user){
            if(err) return done(err);

            if (user && user.authenticate(password)){
                return done(null, user);
            }
            else {
                req.flash('username', username);
                req.flash('errors', {login:'The username or password is incorrect.'});
                return done(null, false);
                
            }
        });
    }
));
//done함수의 첫번째 parameter는 항상 error를 담기 위한 것으로 error가 없다면 null을 담는다.

module.exports = passport;