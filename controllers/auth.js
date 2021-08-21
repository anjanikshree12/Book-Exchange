const path=require('path');
const User=require('../models/user')

exports.getLogin=(req,res,next)=>{
    // console.log(path.join(__dirname,'..','views','auth','login.html'));
    res.render('auth/login');
}


exports.getSignup=(req,res,next)=>{
    res.render('auth/signup');
}

exports.postSignup=(req,res,next)=>{
    const email=req.body.email;
    const name=req.body.name;
    const password=req.body.password;
    const city=req.body.city;
    const user=new User(email,name,password,city);
    user.addUser()
    .then(result=>{
        console.log(result);
        res.redirect('/');
    })
    .catch(err=>{
        console.log(err);
    })
}

exports.postLogin=(req,res,next)=>{
    console.log(req.body);
    const email=req.body.email;
    const password=req.body.password;
    User.getUserByEmail(email)
    .then(user=>{
        if(user[0].length){
        req.session.user=user[0];
        req.session.save(err=>{
            console.log(err);
        })
        res.redirect('/');
        // console.log(user[0]);
        }else{
            console.log('invalid credentials');
        }
    })
    .catch(err=>{
        console.log(err);
    })
    
    
}


exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/login');
    })
}