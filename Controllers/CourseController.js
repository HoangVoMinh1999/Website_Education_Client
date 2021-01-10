require('dotenv').config()
const router = require("../routes")
const mysql = require('mysql')


// Config database
const connectionString = {
    host: process.env.HOST,
    user: process.env.USERID,
    password: process.env.PASSWORD,
    insecureAuth: true,
    database: process.env.DB,
    schema: 'ConfigCourse'
};
const Offset = process.env.OFFSET
//#region List Course
const ListCourse = function(req,res,next){
    var page = req.query.Page || 1;
    var connection = mysql.createConnection(connectionString)
    connection.connect()
    var listAll = [] ; var lenAll = 0 ; var PagesAll = 0
    var listWebsite = [];var lenWebsite = 0; var pagesWebsite = 0
    var listMobile = []; var lenMobile = 0; var pagesMobile = 0
    connection.query('Select * from ConfigCourse where IsDeleted = ? order by Id desc',[0],function(err,results,fields){
        if (err) throw err;
        lenAll = results.length
        pagesAll = CreatePageArray(lenAll%Offset == 0 ? Math.floor(lenAll/Offset) : Math.floor(lenAll/Offset) + 1)
        if (page !== undefined){
            for (let index = (page -1)*Offset; index < page*Offset; index++) {
                if (index === lenAll){
                    break;
                }
                listAll.push(results[index]);
            }
        }
        else{
            listAll = results;
        }
    })
    connection.query('Select * from ConfigCourse where ConfigCourseTypeId = ? and IsDeleted = ? order by Id desc',[1,0],function(err,results,fields){
        if (err) throw err;
        lenWebsite = results.length
        pagesWebsite = CreatePageArray(lenWebsite%Offset == 0 ? Math.floor(lenWebsite/Offset) : Math.floor(lenWebsite/Offset) + 1)
        if (page !== undefined){
            for (let index = (page -1)*Offset; index < page*Offset; index++) {
                if (index === lenWebsite){
                    break;
                }
                listWebsite.push(results[index]);
            }
        }
        else{
            listWebsite = results;
        }
    })
    connection.query('Select * from ConfigCourse where ConfigCourseTypeId = ? and IsDeleted = ? order by Id desc',[2, 0],function(err,results,fields){
        if (err) throw err;
        lenMobile = results.length
        pagesMobile = CreatePageArray(lenMobile%Offset == 0 ? Math.floor(lenMobile/Offset) : Math.floor(lenMobile/Offset) + 1)
        if (page !== undefined){
            for (let index = (page -1)*Offset; index < page*Offset; index++) {
                if (index === lenMobile){
                    break;
                }
                listMobile.push(results[index]);
            }
        }
        else{
            listMobile = results;
        }
        console.log(lenAll)
        console.log(pagesMobile)
        console.log(pagesWebsite)
        res.render('./course/course',{
            title:'Khóa học',
            ListAll:listAll,
            ListMobile:listMobile,
            ListWebsite:listWebsite,
            PagesAll:pagesAll,
            PagesWebsite : pagesWebsite,
            PagesMobile : pagesMobile
        })
    })
    connection.end()
}

function CreatePageArray(page){
    var data = []
    for (let index = 1; index < page+1; index++){
        data.push(index)
    }
    return data
}
//#endregion
//#region Detail Course
const DetailCourse =  function(req,res,next){
    var Id = req.query.ID;
    var connection = mysql.createConnection(connectionString)
    connection.connect()
    var data = ""
    var courseType = ""
    connection.query('Select * from ConfigCourse where Id = ? and IsDeleted = ?',[Id,0],function(err,results,fields){
        if (err) throw err;
        if (results !== null && results.length > 0){
            data = results[0]
            console.log(data)
            connection = mysql.createConnection(connectionString)
            connection.connect()
            connection.query('Select * from ConfigCourseType where Id = ? and IsDeleted = ?',[data.ConfigCourseTypeId,0],function(err,results,fields){
                if (err) throw err;
                console.log(results)
                if (results !== null && results.length > 0){
                    courseType = results[0].Name
                    res.render('./course/detailCourse',{title:'Chi tiết khóa học',CourseType:courseType,data:data})
                }
                else{
                    res.render('./course/detailCourse',{title:'Chi tiết khóa học'})
                }
            })
        }
    })
    connection.end()
}
//#endregion
module.exports = {
    ListCourse,
    DetailCourse
}