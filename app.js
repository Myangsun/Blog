//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "This is Mia Sun's blog about Tech, Web and Design ideas.";
const aboutContent = "Mia Sun is a web developer and uxui designer.";
const contactContent = "Email: myangsun@outlook.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB");

const postSchema={
  title:String,
  content:String
}
const Post = mongoose.model("Post",postSchema);

app.get("/", function(req, res){
  Post.find({},(err,foundPosts)=>{
    if(err){
      console.log(err);
    }else{
      res.render("home", {
        startingContent: homeStartingContent,
        posts: foundPosts
        });
    }
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save((err)=>{
    if(err){
      console.log(err);
    }else{
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){
  const requestedId = req.params.postId;

  Post.findOne({_id:requestedId},(err,foundPost)=>{
    res.render("post", {
      title: foundPost.title,
      content: foundPost.content
    });
  });

});

app.get("/delete/:postId", (req, res)=>{
  const requestedId = req.params.postId;

    Post.findByIdAndRemove(requestedId , (err)=>{
      if(err){
        console.log(err);
      }else{
        console.log("Successfully deleted.");
        res.redirect("/");
      }
    });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
