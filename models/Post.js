// models/Post.js

var mongoose = require('mongoose');

// schema
var postSchema = mongoose.Schema({
  title:{type:String, required:[true, 'Title is required!']},
  body:{type:String, required:[true, 'Body is required']},
  author:{type:mongoose.Schema.Types.ObjectId, ref:'user', require:true},//ref:'user'를 통해 이 항목의 데이터가 user collextion의 id와 연결됨을 mongoose에 알림
  createdAt:{type:Date, default:Date.now},
  updatedAt:{type:Date},
});

// model & export
var Post = mongoose.model('post', postSchema);

module.exports = Post;