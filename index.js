const dotenv = require ('dotenv');
dotenv.config();

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('./config/passport');
var app = express();

// DB setting
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })

var db = mongoose.connection;
db.once('open', function(){
  console.log('Successfully connected to mongoDB');
});
db.on('error', function(err){
  console.log('DB ERROR : ', err);
});

// Other settings
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(flash());//req.flash(문자열, 저장할_값)의 형태로 문자열을 저장한다.
app.use(session({secret:'MySecret', resave:true, saveUninitialized:true}));//서버 접속자들을 구분하기 위한 역활. session({옵션}) secret은 접속자의 정보를 암호화한다.

// Passport
app.use(passport.initialize());//passport를 초기화 시켜주는 함수.
app.use(passport.session());//passport와 session를 연결해주는 함수.
app.use(function(req, res, next){
  res.locals.isAuthenticated = req.isAuthenticated();//isAuthenticated()는 passport에서 제공하는 함수로 현재 로그인상태를 ture,false로 리턴해줌.
  res.locals.currentUser= req.user;//req.user 로그인이 되면 session으로부터 user를 deserialize하여 생성
  next();
  {
  /*
  res.locals에 담겨진 변수들은 ejs가 사용가능함.
  res.locals.isAuthenticated는 ejs에서 user가 로그인이 되어 있는지 아닌지를 확인하는데 사용되고, 
  res.locals.currentUser는 로그인된 user의 정보를 불러오는데 사용됩니다.*/
  }
});

// Routes
app.use('/', require('./routes/home'));
app.use('/posts', require('./routes/posts'));
app.use('/users', require('./routes/users'));

// Port setting
var port = 3000;
app.listen(port, function(){
  console.log('server on! http://localhost:'+port);
});
