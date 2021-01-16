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

module.exports = {
    JoinCourse,
    CancelCourse,
    AddComment,
}