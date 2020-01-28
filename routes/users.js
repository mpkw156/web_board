var express = require('express');
var router = express.Router();
var User = require('../models/User');
var util = require('../util');

// Index
router.get('/', function(req, res){
    User.find({})
    .sort({username:1})//1:오름차순,-1:내림차순
    .exec(function(err, users){
      if(err) return res.json(err);
      res.render('users/index', {users:users});
    });
});

// New
router.get('/new', function(req, res){
    var user = req.flash('user')[0]||{};
    var errors = req.flash('errors')[0]||{};
    res.render('users/new', { user:user, errors:errors });
{
/*user생성시에 에러가 있는 경우 new페이지에 에러와 기존에 입력했던 값들을 보여주게 되는데, 
이 값들은 create route에서 생성된 flash로부터 받아온다.*/
}
});
  
// create
router.post('/', function(req, res){
  User.create(req.body, function(err, user){
    if(err){
        req.flash('user', req.body);
        req.flash('errors', util.parseError(err));
        return res.redirect('/users/new');
    }
    res.redirect('/users');
  });
  {
    /*
    user 생성시에 오류가 있다면 user, error flash를 만들고 new페이지로 redirect한다.
    user 생성시에 발생할 수 있는 오류는 2가지로 첫번째는 User model의 userSchema에 설정해둔 validation을 통과하지 못한 경우와, mongoDB에서 오류를 내는 경우입니다.
    이때 발생하는 error 객체의 형식이 상이하므로parseError라는 함수를 따로 만들어서 err을 분석하고 일정한 형식으로 만들게 됩니다.
    */
  }
});
  
// show
router.get('/:username', function(req, res){
  User.findOne({username:req.params.username}, function(err, user){
    if(err) return res.json(err);
    res.render('users/show', {user:user});
  });
});
  
// edit
router.get('/:username/edit', function(req, res){
    var user = req.flash('user')[0];
    var errors = req.flash('errors')[0]||{};
    if(!user){
        User.findOne({username:req.params.username}, function(err, user){
        if(err) return res.json(err);
        res.render('users/edit', {username:req.params.username, user:user, errors:errors});
        });
    }
    else{
        res.render('users/edit', { username:req.params.username, user:user, errors:errors});
    }
    {
    /*edit은 처음 접속하는 경우에는 DB에서 값을 찾아 form에 기본값을 생성하고, update에서 오류가 발생해 돌아오는 경우에는 기존에 입력했던 값으로 form에 값들을 생성해야 합니다.
    이를 위해 user에는 || {} 를 사용하지 않았으며, user flash값이 있으면 오류가 있는 경우, user flash 값이 없으면 처음 들어온 경우로 가정하고 진행합니다.
    이제부터 render시에 username을 따로 보내주는데, 이전에는 user.username이 항상 해당 user의 username이였지만 이젠 user flash에서 값을 받는 경우 username이 달라 질 수도 있기 때문에 주소에서 찾은 username을 따로 보내주게됩니다.
    */
    }
});
  
// update
router.put('/:username', function(req, res, next){
  User.findOne({username:req.params.username}) //findone()으로 값을 찾은 후에 값을 수정하고 user.save함수로 값을 저장.
    .select('password') //select로 password를 읽어오게함. cf)변수앞에 -를 붙이면 읽어오지 않는다는 의미.
    .exec(function(err, user){
      if(err) return res.json(err);

    // update user object
    user.originalPassword = user.password;
    user.password = req.body.newPassword? req.body.newPassword : user.password; //password를 업데이트 하는 경우, 하지 않는 경우로 나뉘어서 값 전달.
    for(var p in req.body){ //user는 DB에서 읽어온 data이고, req.body가 실제 form으로 입력된 값이므로 각 항목을 덮어 쓰는 부분이다.
      user[p] = req.body[p];
    }

        // save updated user
    user.save(function(err, user){
      if(err) {
          req.flash('user', req.body);
          req.flash('errors', util.parseError(err));
          return res.redirect('/users/'+req.params.username+'/edit');
      }
      res.redirect('/users/'+user.username);
    });
  });
});
  
// destroy
router.delete('/:username', function(req, res){
  User.deleteOne({username:req.params.username}, function(err){
    if(err) return res.json(err);
    res.redirect('/users');
  });
});
  
// functions
function parseError(errors){
    var parsed = {};
    if(errors.name == 'VaildationError'){
        for(var name in errors.errors){
            var VaildationError = errors.errors[name];
            parsd[name] = { message:VaildationError.message};
        }
    }
    else if(errors.code == '11000' && errors.errmsg.indexOf('username') > 0){
        parsed.username = {message:'This username already exists!'};
    }
    else {
        parsed.unhandled = JSON.stringify(errors);
    }
    return parsed;
    {
    /*mongoose에서 내는 에러와 mongoDB에서 내는 에러의 형태가 다르기 때문에 이 함수를 통해 에러의 형태를
    { 항목이름: { message: "에러메세지" } 로 통일시켜주는 함수입니다.
    if 에서 mongoose의 model validation error를, else if 에서 mongoDB에서 username이 중복되는 error를, else 에서 그 외 error들을 처리합니다.
    함수 시작부분에 console.log("errors: ", errors")를 추가해 주면 원래 에러의 형태를 console 에서 볼 수 있습니다
    */
    }
}

module.exports = router;