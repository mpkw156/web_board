var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');


// schema
var userSchema = mongoose.Schema({
  username:{
    type:String,
    required:[true,'Username is required!'],
    match:[/^.{4,12}$/,'Should be 4-12 characters!'],
    //match에는 regex(Regular Expression, 정규표현식)이 들어가서 값이 regex에 부합하지 않으면 에러메세지를 내게 된다.
    trim:true,//문자열 앞뒤에 빈칸이 있는 경우 빈칸을 제거해 주는 옵션
    unique:true
  },
  password:{
    type:String,
    required:[true,'Password is required!'],
    select:false//select부분을 false로 설정하면 DB에서 해당 모델을 읽어 올 때 해당 항목값을 읽어오지 않는다.
  },
  name:{
    type:String,
    required:[true,'Name is required!'],
    match:[/^.{4,12}$/,'Should be 4-12 characters!'],
    trim:true
  },
  email:{
    type:String,
    match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'Should be a vaild email address!'],
    trim:true
  }
},
{
  toObject:{virtuals:true}
});

// virtuals
{/*
  DB에 저장되는 값 이외의 항목이 필요할 땐 virtual로 설정.
회원가입, 회원정보 수정을 위해 필요한 항목이지만, DB에 저장할 필요는 없는 값들
*/}
userSchema.virtual('passwordConfirmation')
  .get(function(){ 
    return this._passwordConfirmation; 
})
  .set(function(value){ 
    this._passwordConfirmation=value; 
});

userSchema.virtual('originalPassword')
  .get(function(){ 
    return this._originalPassword; 
})
  .set(function(value){ 
    this._originalPassword=value; 
});

userSchema.virtual('currentPassword')
  .get(function(){ 
    return this._currentPassword; 
  })
  .set(function(value){ 
    this._currentPassword=value; 
});

userSchema.virtual('newPassword')
  .get(function(){ 
    return this._newPassword; 
})
  .set(function(value){ 
    this._newPassword=value; 
});


// password validation
//password를 DB에 생성, 수정하기 전에 값이 유효(valid)한지 확인(validate)하는 코드.
var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
var passwordRegexErrorMessage = 'Should be minimum 8 characters of alphabet and number combination!';
userSchema.path('password').validate(function(v) {
  var user = this;
  {/*
  this는 user model를 의미.
  password값이 password confirmatione값과 다른 경우에 유효하지 않음 처리(invalidate)
  'model.isNew 항목은 해당 모델이 생성되는 경우에 true, 아니면 false의 값을 가진다.
  */}
  // create user 
  if(user.isNew){
    if(!user.passwordConfirmation){
      user.invalidate('passwordConfirmation', 'Password Confirmation is required.');
    }
    if(!passwordRegex.test(user.password)){//정규표현식.test(문자열)은 문자열에 정규표현식을 통과하는 부분이 있다면 true, 아니면 false를 반홥함
      user.invalidate('password', passwordRegexErrorMessage);//만약, false가 반환되는 경우에 passwordRegexErrorMessage가 호출.
    }
    else if(user.password !== user.passwordConfirmation) {
      user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
    }
  }

  // update user
  if(!user.isNew){ 
    {/*
    current password값이 없는 경우
    current password값이 original password값과 다른 경우
    new password값과 password confirmation값이 다른 경우 invalidate.
    */}
    if(!user.currentPassword){
       user.invalidate('currentPassword', 'Current Password is required!');
    }
    else if(!bcrypt.compareSync(user.currentPassword, user.originalPassword)){
      user.invalidate('currentPassword', 'Current Password is invalid!');
    }
    if(user.newPassword && !passwordRegex.test(user.newPassword)){
      user.invalidate("newPassword", passwordRegexErrorMessage);
    }
    if(user.newPassword !== user.passwordConfirmation) {
      user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
    }
  }
  //current password: 현재 입력하고 있는 password
  //original password: DB상에 저장되어 있는 password
});

// hash password
userSchema.pre('save', function(next){
  var user = this;
  if(!user.isModified('password')){
    return next();
  }
  else{
    user.password = bcrypt.hashSync(user.password);
    return next();
  }
});

// model methods
userSchema.methods.authenticate = function(password){
  var user = this;
  return bcrypt.compareSync(password,user.password);
};

var User = mongoose.model('user',userSchema);
module.exports = User;