const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const config = require('./config/database');
const passport = require('passport');
const morgan = require('morgan');
const helmet = require('helmet');

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false,
    poolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
  };

mongoose.connect(config.database, options).catch();
let db = mongoose.connection;

db.once('open', function(){
    console.log('Connected to MongoDB');
});

db.on('error', function(err){
    console.log(err);
});

const GoalTracker = express();

//Global Current Goal Id
let currentGoalId;

let Goal = require('./models/goal');
let User = require('./models/user');

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      return next();
    } else {
      res.redirect('/login');
    }
}

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
GoalTracker.use(passport.initialize());
GoalTracker.use(passport.session());

GoalTracker.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

GoalTracker.use(morgan('common'));
GoalTracker.use(helmet());

GoalTracker.use(bodyParser.urlencoded({ extended: false }));

GoalTracker.use(bodyParser.json());

GoalTracker.use(express.static(path.join(__dirname, 'public')));

GoalTracker.set('views', path.join(__dirname, 'views'));
GoalTracker.set('view engine', 'pug');

//Home Route
GoalTracker.get('/', /*ensureAuthenticated,*/ function(req, res){
    Goal.find({}, function(err, goals){
        if(err){
            console.log(err);
        } else {
            res.render('index', {
                header: 'Goals',
                goals: goals
            });
        }
    });
});

//Single Goal
GoalTracker.get('/goals/:id', /*ensureAuthenticated,*/ function(req, res){
    Goal.findById(req.params.id, function(err, goal){
        currentGoalId = req.params.id;
          if(err){
            console.log(err);
          } else {
            res.render('goal', {
                goal: goal
            });
        } 
    });
});

// logout
GoalTracker.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
});

// Login Forms
GoalTracker.get('/login', function(req, res){
    res.render('login');
});

//Add Goal
GoalTracker.post('/goals/add', function(req, res){
    let goal = new Goal();
    goal.title = req.body.title;
    goal.start = req.body.start;
    goal.currentProgress = 0;
    goal.goalAmount = req.body.goalAmount;
    goal.units = req.body.units;
    goal.save(function(err){
        if(err){
            console.log(err);
            return;
        }
    });
    res.redirect('/');
    res.send('Success');
});

//Edit Goal
GoalTracker.post('/goals/:id', function(req, res){
    let goal = {};
    goal.title = req.body.title;
    goal.start = req.body.start;
    goal.goalAmount = req.body.goalAmount;
    goal.units = req.body.units;
    let query = {_id:req.params.id}
    Goal.update(query, goal, function(err){
        if(err){
            console.log(err);
            return;
        } else {
            res.redirect('/goals/'+req.params.id);
        }
    });
});

//Log Goal
GoalTracker.post('/goals/log/:id', function(req, res){
    Goal.findById(req.params.id, function(err, prevGoal){
        if(err){
            console.log(err);
            return;
        } else {
            let progress = (Number(prevGoal.currentProgress) + Number(req.body.units));
            let arr = prevGoal.goalLog;
            arr.push(req.body.date, req.body.units);
            let goal = {};
            goal.currentProgress = progress;
            goal.goalLog = arr;
            let query = {_id:req.params.id}
            Goal.update(query, goal, function(err){
                if(err){
                    console.log(err);
                    return;
                } else {
                    res.redirect('/goals/'+req.params.id);
                }
            });
        }
    });
});

// Delete Goal
GoalTracker.post('/goals/delete/:id', function(req, res){
    let query = {_id:req.params.id}
    Goal.remove(query, function(err){
        if(err){
            console.log(err);
        }
    });
    res.send('Success');
});

// Register Proccess
GoalTracker.post('/users/register', function(req, res){
    const email = req.body.email;
    const password = req.body.password;

      let newUser = new User({
        email:email,
        password:password
      });
  
      bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
          if(err){
            console.log(err);
          }
          newUser.password = hash;
          newUser.save(function(err){
            if(err){
              console.log(err);
              return;
            } else {
                res.redirect('/login');
                res.end();
            }
          });
        });
      });
});
  
// Login Process
GoalTracker.post('/login', passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/login' 
}));

const port = process.env.PORT || 80;

//Start
GoalTracker.listen(port, function(){
    console.log(`Server started at http://localhost:${port}`);
});