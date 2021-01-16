const CourseService = require("../Service/CourseService")
const UserService = require('../Service/UserService')
const CourseDetailService = require('../Service/CourseDetailService')


const JoinCourse =async  function(req,res,next){
    let user = req.session.Account
    let courseId = req.body.courseId
    if (user !== undefined){
        if (user.ID !== null  && courseId !== null ){
            let newItem = {
                CourseID : courseId,
                UserID : user.ID,
                Log_CreatedDate : require('moment')().format('YYYY-MM-DD HH:mm:ss'),
                IsJoin : true,
                Log_CreatedBy : user.Username,
            }
            await CourseDetailService.add(newItem)
            let course = await CourseService.single(courseId)
            if (course !== null){
                await CourseService.updateStudents(courseId,course.CurrentStudents+1)
            }

            res.redirect('/detail?ID='+courseId)
        }
        else{
            console.log('hello')
            res.redirect('/login')
        }
    }
    res.redirect('/login')
}

const AddToWishList =async  function(req,res,next){
    let user = req.session.Account
    let courseId = req.body.courseId
    if (user !== undefined){
        if (user.ID !== null  && courseId !== null ){
            let newItem = {
                CourseID : courseId,
                UserID : user.ID,
                Log_CreatedDate : require('moment')().format('YYYY-MM-DD HH:mm:ss'),
                IsFavorite : true,
                Log_CreatedBy : user.Username,
            }
            await CourseDetailService.add(newItem)
            let course = await CourseService.single(courseId)
            if (course !== null){
                await CourseService.updateStudents(courseId,course.CurrentStudents+1)
            }

            res.redirect('/detail?ID='+courseId)
        }
        else{
            console.log('hello')
            res.redirect('/login')
        }
    }
    res.redirect('/login')
}

const CancelCourse =async function(req,res,next){
    let courseId = req.body.courseId
    console.log(courseId)
    let user = req.session.Account
    if (user !== undefined){
        if (courseId !== null && user !== null){
            await CourseDetailService.cancelCourse(user.ID,courseId)

            let course = await CourseService.single(courseId)
            if (course !== null){
                await CourseService.updateStudents(courseId,course.CurrentStudents-1)
            }
            res.redirect('/detail?ID='+courseId)
        }
    }
    else{
        res.redirect('/login')
    }
}

const RemoveWishList =async function(req,res,next){
    let courseId = req.body.courseId
    console.log(courseId)
    let user = req.session.Account
    if (user !== undefined){
        if (courseId !== null && user !== null){
            await CourseDetailService.removeWishList(user.ID,courseId)
            res.redirect('/detail?ID='+courseId)
        }
    }
    else{
        res.redirect('/login')
    }
}

const AddComment = async function(req,res,next){
    let courseId = req.body.courseId
    console.log(courseId)
    let newItem = {
        CourseID : req.body.courseId,
        Rate : req.body.Rate || 5,
        Comment : req.body.comment,        
    }
    await CourseDetailService.addRate(newItem)
    res.redirect('/detail?ID='+newItem.CourseID)
}

const GetListCourse = async function(req,res,next){
    let ID =req.query.ID
    console.log(ID)
    let listJoin = await CourseDetailService.getJoinCourses(ID)
    console.log(listJoin)
    let wishlist = await CourseDetailService.getWishList(ID)
    let dataListJoin = []
    let dataWishList = []
    listJoin.forEach(async t => {
        let course = await CourseService.single(t)
        dataListJoin.push(course)
    });
    wishlist.forEach(async t => {
        let course = await CourseService.single(t)
        dataWishList.push(course)
    });
    res.render ('./user/Profile',{
        title:'Thông tin cá nhân',
        DataListJoin : listJoin,
        DataWishList : wishlist,
    })
}

module.exports = {
    JoinCourse,
    CancelCourse,
    AddComment,
    AddToWishList,
    RemoveWishList,
    GetListCourse,
}