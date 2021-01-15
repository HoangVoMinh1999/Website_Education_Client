var express = require('express');
var router = express.Router();
const CourseController = require('../Controllers/CourseController')
const UserController = require('../Controllers/UserController')

/* GET home page. */
router.get('/', CourseController.ListCourse4Index);

//#region Login
router.get('/login',function(req,res,next){
    res.render('login',{title: 'Đăng nhập',layout:'loginLayout'})
})
router.post('/login', UserController.Login)
//#endregion

//#region Register
router.get('/register',function(req,res,next){
    console.log(req.session.IsInvalidUsername);
    if (req.session.IsInvalidPassword === true || req.session.IsInvalidUsername === true){
        res.render('register',{title:'Đăng ký',layout:'loginLayout', Message : sMessage})
    }
    else{
        res.render('register',{title: 'Đăng ký',layout:'loginLayout'})
    }
    
})
router.post('/register',UserController.Register)
//#endregion
//#region Logout
router.get('/Logout',)
//#endregion

//#region Course
router.get('/course',CourseController.ListCourse)
router.get('/detail',CourseController.DetailCourse)
//#endregion
module.exports = router;
