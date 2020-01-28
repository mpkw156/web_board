var express = require('express');
var router = express.Router();
var Post = require('../models/Post');
var util = require('../util');

// Index
router.get('/', function(req, res){
    Post.findByIdAndRemove({})
    .populate('author')
    .sort('-createAt')//.sort()함수는 string,object를 받아서 덷이터 정렬방법을 정의.
    .exec(function(err, posts){       
        if(err) return('posts/index', {post:posts});
    });
    //exec함수 앞에 DB에서 데이터를 어떻게 찾을지, 어떻게 정렬할지 등등을 함수로 표현하고,
    //exec안의 함수에서 해당 data를 받아와서 할일을 정하는 구조. 
});

// New
router.get('/new', function(req, res){
    var post = req.flash('post')[0] || {};
    var errors = req.flash('errors')[0] || {};
    res.render('posts/new', { post:post, errors:errors });
  });

//create
router.post('/', function(req, res){
    req.body.author = req.user._id;
    Post.create(req.body, function(err, post){
      if(err){
        req.flash('post', req.body);
        req.flash('errors', util.parseError(err));
        return res.redirect('/posts/new');
      }
      res.redirect('/posts');
    });
  });

//show
router.get('/:id', function(req, res){
    Post.findOne({_id:req.params.id}) 
    .populate('author')            
    .exec(function(err, post){
        if(err) return res.json(err);
        res.render('posts/show', {post:post});
    });
});

//edit
router.get('/:id/edit', function(req, res){
    var post = req.flash('post')[0];
    var errors = req.flash('errors')[0] || {};
    if(!post){
      Post.findOne({_id:req.params.id}, function(err, post){
          if(err) return res.json(err);
          res.render('posts/edit', { post:post, errors:errors });
        });
    }
    else {
      post._id = req.params.id;
      res.render('posts/edit', { post:post, errors:errors });
    }
  });

//update
router.put('/:id', function(req, res){
    req.body.updatedAt = Date.now();
    Post.findOneAndUpdate({_id:req.params.id}, req.body, {runValidators:true}, function(err, post){
      if(err){
        req.flash('post', req.body);
        req.flash('errors', util.parseError(err));
        return res.redirect('/posts/'+req.params.id+'/edit');
      }
      res.redirect('/posts/'+req.params.id);
    });
  });

//destroy
router.delete('/:id', function(req, res){
    Post.deleteOne({_id:req.params.id}, function(err){
        if(err) return res.json(err);
        res.redirect('/posts');
    });
});

module.exports = router;