var express = require('express');
var path = require('path');
var session = require('express-session');
var fs = require('fs');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'username', resave: true, saveUninitialized: true}));

//new
var allMovies=new Array();
allMovies.push({movieName:'Conjuring',file:'conjuring'});
allMovies.push({movieName:'Darkknight',file:'darkknight'});
allMovies.push({movieName:'Fightclub',file:'fightclub'});
allMovies.push({movieName:'Godfather',file:'godfather'});
allMovies.push({movieName:'Godfather2',file:'godfather2'});
allMovies.push({movieName:'Scream',file:'scream'});

function addtoWatchlist(name,req,res){
  var f=false;
  let data = fs.readFileSync('usersWatchlist.json');    
  let StringData = data.toString();
  if(StringData == '')
    StringData = '[]';
  let parsedData = JSON.parse(StringData);
  for(var i = 0;i<parsedData.length;i++){
    if(parsedData[i].username  == req.session.username){
      if(parsedData[i].movie == name){
        f = true ;
        break;
      }
    }
  }
  if(f){
    //already added
    res.render(name,{output:'Movie already added'});
  }
  else{
    //success
    var x={username : req.session.username , movie : name} ;
    parsedData.push(x);
    var j = JSON.stringify(parsedData);
    fs.writeFileSync("userswatchlist.json",j);
    res.render(name,{output:'Movie added successfully'});
  }
}

app.post('/addconjuringtowatchlist', function(req,res){
  addtoWatchlist('conjuring',req, res);
});
app.post('/adddarkknighttowatchlist', function(req,res){
  addtoWatchlist('darkknight',req, res);
});
app.post('/addgodfathertowatchlist', function(req,res){
  addtoWatchlist('godfather',req, res);
});
app.post('/addgodfather2towatchlist', function(req,res){
  addtoWatchlist('godfather2',req,res);
});
app.post('/addscreamtowatchlist', function(req,res){
  addtoWatchlist('scream',req, res);
});
app.post('/addfightclubtowatchlist', function(req,res){
  addtoWatchlist('fightclub',req, res);
});


//end of new

app.get('/', function(req, res) {
  if(req.session.username) {
    res.redirect('/home');
  }
  else {
    res.render('login',{output: ''});
  }
});

// Here we handle the post request of the user in the login page
app.post('/', function(req, res) {
  let data = fs.readFileSync('users.json');
  let StringData = data.toString();
  if(StringData == ''){
       // A message should be displayed indicating that the username is wrong
       res.render('login',{output: "WRONG USERNAME OR PASSWORD"});
  }
  else{
    let user = req.body; 
    let parsedData = JSON.parse(StringData);
    var found=false;
    for(var i = 0;i<parsedData.length;i++){
      if(parsedData[i].username  == user.username)
      {
        found=true;
        if(parsedData[i].password == user.password){
          req.session.username = req.body.username;
          res.redirect('/home');
          break;
        }else{
          // A message should be displayed indicating that the password is wrong
          res.render('login',{output: "WRONG PASSWORD OR PASSWORD"});
        }
      }
    }
    if(found==false){
      // A message should be displayed indicating that the user is not registered yet
      res.render('login',{output: "WRONG USERNAME"});
    }
  }
});

app.get('/action', function(req, res) {
  if(req.session.username)  
    res.render('action');
  else {
    res.redirect('/');
  }
    
});

app.get('/conjuring', function(req, res) {
  if(req.session.username) 
    res.render('conjuring',{output:''});
    else {
      res.redirect('/');
    }
  
  });

app.get('/darkknight', function(req, res) {
  if(req.session.username) 
    res.render('darkknight',{output:''});
    else {
      res.redirect('/');
    }
  
  });

app.get('/drama', function(req, res) {
  if(req.session.username) 
    res.render('drama');
    else {
      res.redirect('/');
    }
  
  });

app.get('/fightclub', function(req, res) {
  if(req.session.username) 
    res.render('fightclub',{output:''});
    else {
      res.redirect('/');
    }
  
  });

app.get('/godfather', function(req, res) {
  if(req.session.username) 
    res.render('godfather',{output:''});
    else {
      res.redirect('/');
    }
  
  });

app.get('/godfather2', function(req, res) {
  if(req.session.username) 
    res.render('godfather2',{output:''});
    else {
      res.redirect('/');
    }
  
  });

app.get('/home', function(req, res) {
	if(req.session.username) {
    res.render('home');
  }  else {
    res.redirect('/');
  }

});

app.get('/horror', function(req, res) {
  if(req.session.username)   
    res.render('horror');
    else {
      res.redirect('/');
    }
  
  });
app.get('/watchlist', function(req, res) {
  if(req.session.username) 
  {
    let data = fs.readFileSync('usersWatchlist.json');    
      let StringData = data.toString();
      if(StringData == '')
        StringData = '[]';
      let parsedData = JSON.parse(StringData);
      var arr=new Array();
    for(var m of parsedData){
      if(m.username== req.session.username){
        arr.push(m);
      }
    }
    res.render('watchlist',{allMovies:arr});
  }  else {
    res.redirect('/');
  }

});


app.get('/registration', function(req, res) {
  res.render('registration',{ output : '' });
});





//Here we handle the post request of the user in the registration page 
app.post('/register', function(req, res) {
    let data = fs.readFileSync('users.json');    
    let StringData = data.toString();
    if(StringData == '')
      StringData = '[]';
    let parsedData = JSON.parse(StringData);
    var Obj = req.body;
    if(Obj.username.length < 4)
      res.render('registration',{ output : 'A username must consist of at least 4 characters.\n Please, enter a valid one!' });
    else if(Obj.password.length < 4)
      res.render('registration',{ output : 'A password must consist of at least 4 characters.\n Please, enter a valid one!' });
    else{
      var f = false;
      for(var i = 0;i<parsedData.length;i++){
        if(parsedData[i].username  == Obj.username){
          f = true ;
          break;
        }
      }
      if(f){
      // A message should indicate that this user name already exists
        res.render('registration',{ output : 'Username already exists' });

      }else{
        parsedData.push(Obj);
        var j = JSON.stringify(parsedData);
        fs.writeFileSync("users.json",j);
        res.render('registration',{ output : 'Registration done successfully' });
      }

    }

});

app.get('/scream', function(req, res) {
  if(req.session.username) 
    res.render('scream',{output:''});
    else {
      res.redirect('/');
    }
  
  });

app.post('/search', function(req, res) {
  var arr=new Array();
  let obj=req.body;
  for(var m of allMovies){
    if(m.movieName.toLowerCase().includes(obj.Search.toLowerCase())){
      arr.push(m);
    }
  }
  res.render('searchresults',{allMovies:arr});
});



if(process.env.PORT){
  app.listen(process.env.PORT);
}else{
  app.listen(3000);
}


module.exports = app;
