const path=require('path');
const User=require('../models/user')
const bcrypt=require('bcrypt')
exports.getLogin=(req,res,next)=>{
    // console.log(path.join(__dirname,'..','views','auth','login.html'));
    res.render('auth/index');
}


exports.getSignup=(req,res,next)=>{
    res.render('auth/signup');
}

exports.postSignup=(req,res,next)=>{
    const email=req.body.email;
    const name=req.body.name;
    const password=req.body.password;
    const city=req.body.city;
    
    User.getUserByEmail(email)
    .then(result=>{
        if(result[0].length!=0){
            return res.redirect('/signup')
        }
        return bcrypt.hash(password,12)
        .then(hashedPassword=>{
            const user=new User(email,name,hashedPassword,city);
            user.addUser()
            .then(result=>{
                console.log('user stored');
                res.redirect('/login');
            })
            .catch(err=>{
                console.log(err);
            })
        })
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
            console.log(user[0]);
            // console.log(user[0][0].email);
        return bcrypt.compare(password,user[0][0].password)
        .then(result=>{
            if(result){
                req.session.user=user[0];
                req.session.isLoggedIn=true;
                req.session.save(err=>{
                console.log(err);
        })
        res.redirect('/');
        }else{
            res.redirect('/login')
        }
        })
        .catch(err=>{
            console.log(err);
        })
        // console.log(user[0]);
        }else{
            console.log('invalid credentials');
            res.redirect('/')
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