require('dotenv').config()
const router = require("../routes")
const UserService = require('../Service/UserService')
const bcrypt = require('bcrypt');
var session = require('express-session');


const Register = async function(req,res,next){
    let sMessage = ''
    if (req.session.IsAuth){
        res.redirect('/');
    }
    else{
        var username = req.body.Username;
        var email = req.body.Email;
        var password = req.body.Password_01;
        var password_02 = req.body.Password_02;
        var eamil = req.body.Email;
        console.log(username)
        let account = await UserService.singleByUsername(username);
        console.log(account)
        if (account !== null){
            sMessage = 'Tài khoản đã tồn tại'
            console.log(sMessage)
            req.session.IsInvalidUsername = true;
            res.render('register',{title:'Đăng ký',layout:'loginLayout', Message : sMessage})
        }
        else if (!(await UserService.checkValidEmail(email))){
            sMessage = "Email đã được sử dụng"
            res.render('register',{title:'Đăng ký',layout:'loginLayout', Message : sMessage})
        }
        else{
            if (password !== password_02){
                sMessage = 'Vui lòng nhập đúng mật khẩu'
                console.log(sMessage)
                req.session.IsInvalidPassword = true;
                res.render('register',{title:'Đăng ký',layout:'loginLayout', Message : sMessage})
            }
            else{
                var newAccount = {
                    Username : username,
                    Password : bcrypt.hashSync(password,10),
                    Email : email,
                    Log_CreatedDate : require('moment')().format('YYYY-MM-DD HH:mm:ss'),
                    Log_CreatedBy : username,
                }
                await UserService.add(newAccount)
                req.session.IsInvalidUsername = false;
                req.session.IsInvalidPassword = false;
                console.log(sMessage)
                res.redirect('/login')
            }

        }
    }

}

const Login = async function (req,res,next){
    req.session.IsAuth = false
    let username = req.body.Username;
    let password = req.body.Password;
    var account = await UserService.singleByUsername(username);
    if (account !== null){
        if (bcrypt.compareSync(password,account.Password)){
            req.session.IsAuth = true
            req.session.Account = account
            res.locals.IsAuth = req.session.IsAuth
            next()
            res.redirect('/')
        }
        else {
            let sMessage = "Nhập sai tài khoản hoặc mật khẩu"
            res.render('login',{title:'Đăng nhập',layout:'loginLayout', Message : sMessage})
        }
    }
    else {
        let sMessage = "Nhập sai tài khoản hoặc mật khẩu"
        res.render('login',{title:'Đăng nhập',layout:'loginLayout', Message : sMessage})
    }
}

module.exports = {
    Register,
    Login,
}