const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { FindCursor } = require("mongodb");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

const articleSchema = ({
    title: String,      
    content: String
});

const Article = mongoose.model("Article", articleSchema);

///////////////REquest targeting all article /////

app.route("/articles")
.get(function(req,res){
    //Make use of promises in javascript i.e. 
    //".then" and ".catch" instead of a callback function provided to the 
    //model.find() method
    Article.find().then(function(articles){
        res.send(articles);
    }).catch(function(err){
        console.log(err);
    });
})
.post( async (req, res) => {
    const newArticle = new Article ({
        title: req.body.title,
        content: req.body.content
    })
    newArticle.save().then(success => {
        console.log("Succesfully added a new article");
    }).catch(err => {
        console.log(err);
    })
})
.delete(function(req,res){
    Article.deleteMany({})
    .then(function(){
        res.send("Successfully deleted.");
    }).catch(function(err){
        res.send(err);
    })
});

app.get("/articles",);

app.post("/articles",);

app.delete("/articles", );

///////////////REquest targeting specific article /////

// app.route('/articles/:articleTitle')
//     .get(async function (req, res) {
//         try {
//             const foundArticle = await Article.findOne({ title: req.params.articleTitle });
//             if (foundArticle) {
//                 res.send(foundArticle);
//             } else {
//                 res.send('No articles matching that title was found.');
//             }
//         } catch (error) {
//             console.log(error);
//             res.status(400).json({
//                 message: "Something went wrong",
//             });
//         }
//     });

app.route('/articles/:articleTitle')
.get(function(req,res){
    Article.findOne({ title: req.params.articleTitle })
    .then(function(articles){
        res.send(articles)
    }).catch(function(err){
        res.send(err);
    })
})
.put(function(req,res){
    Article.replaceOne(
        {title: req.params.articleTitle },
        {title: req.body.title, content: req.body.content},
        {overwrite: true}
        )
    .then(function(articles){
        res.send(articles);
    }).catch(function(err){
        res.send(err);
    });
})
.patch(function(req,res){
    Article.findOneAndUpdate(
        {title: req.params.articleTitle },
        {$set: req.body}
        )
    .then(function(articles){
        res.send(articles);
    }).catch(function(err){
        res.send(err);
    });
})
.delete(function(req,res){
    Article.deleteOne({title: req.params.articleTitle })
    .then(function(){
        res.send("Successfully deleted.");
    }).catch(function(err){
        res.send(err);
    })
});

app.listen(3000, function(){
    console.log("Server is running...");
});
