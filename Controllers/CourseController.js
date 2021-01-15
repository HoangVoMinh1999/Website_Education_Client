require('dotenv').config()
const router = require("../routes")
const CourseService = require("../Service/CourseService")

const Offset = process.env.OFFSET

const ListCourse4Index = async function(req,res,next){
    let listAll = []
    let listMobile = []
    let listWebsite = []

    listAll = await CourseService.all('')
    if (listAll !== null && listAll.length > 3){
        listAll = listAll.slice(0,3)
    }    
    let mobileCourseId = await CourseService.getCourseTypeId(process.env.MOBILE)
    if (mobileCourseId !== null && mobileCourseId !== undefined){
        mobileCourseId = mobileCourseId[0].Id
        listMobile = await CourseService.getCourseByCourseTypeId(mobileCourseId,'');
        if (listMobile !== null && listMobile.length > 3){
            listMobile = listMobile.slice(0,3)
        }
    }
    let websiteCourseId = await CourseService.getCourseTypeId(process.env.WEBSITE)
    if (websiteCourseId !== null && websiteCourseId !== undefined){
        websiteCourseId = websiteCourseId[0].Id;
        listWebsite = await CourseService.getCourseByCourseTypeId(websiteCourseId,'');
        if (listWebsite !== null && listWebsite.length > 3){
            listWebsite = listWebsite.slice(0,3)
        }
    }

    let mostViewedCourses  = CourseService.get10MostViewedCourses()
    let latestCourses = CourseService.get10LatestCourses()

    res.render('./index',{
        title: 'Trang chủ',
        ListAll : listAll,
        ListWebsite : listWebsite,
        ListMobile : listMobile,
        MostViewedCourses : mostViewedCourses,
        LatestCourses : latestCourses,
    })
}

function CreatePageArray(page){
    var data = []
    for (let index = 1; index < page+1; index++){
        data.push(index)
    }
    return data
}
const ListCourse = async function(req,res,next) {
    let listData = [];
    let IsFilter = false;
    let IsSorting = false;
    let option = '';
    let courseType = '';
    let pagesAll = [];

    let courseTypeId = req.query.ConfigCourseTypeId;
    let page = req.query.Page || 1

    let priceSorting = req.query.PriceSorting;
    let rateSorting = req.query.RateSorting;
    let viewSorting = req.query.ViewSorting;
    if (priceSorting !== undefined){
        IsSorting = true;
        option = 'Order by Price '+priceSorting
    }
    else if (rateSorting !== undefined){
        IsSorting = true;
        option = 'Order by Rate '+ rateSorting
    }
    else if (viewSorting !== undefined){
        IsSorting = true;
        option = 'Order by View '+ viewSorting
    }

    if (courseTypeId === undefined){
        listData = await CourseService.all(option);
        if (listData !== null && listData.length > 0){
            let lenAll = listData.length
            pagesAll = CreatePageArray(lenAll%Offset == 0 ? Math.floor(lenAll/Offset) : Math.floor(lenAll/Offset) + 1)
            if (page*Offset-1 < listData.length){
                listData = listData.slice((page-1)*Offset,page*Offset)
            }
            else {
                listData = listData.slice((page-1)*Offset,listData.length)
            }
        }
    }
    else{
        listData = await  CourseService.getCourseByCourseTypeId(courseTypeId,option);
        if (listData !== null && listData.length  > 0){
            IsFilter = true;
            courseType = courseTypeId
            let lenAll = listData.length
            pagesAll = CreatePageArray(lenAll%Offset == 0 ? Math.floor(lenAll/Offset) : Math.floor(lenAll/Offset) + 1)
            if (page*Offset-1 < listData.length){
                listData = listData.slice((page-1)*Offset,page*Offset)
            }
            else {
                listData = listData.slice((page-1)*Offset,listData.length)
            }
        }
    }
    res.render('./course/course',{
        title:'Khóa học',
        ListAll : listData,
        PagesAll : pagesAll,
        IsFilter : IsFilter,
        CourseType : courseType,
        IsSorting : IsSorting,
        PriceSorting : priceSorting,
        RateSorting : rateSorting,
        ViewSorting : viewSorting,
    })
}

const DetailCourse = async function(req,res,next){
    let Id = req.query.ID
    console.log(Id)
    let detailCourse = await CourseService.single(Id)
    if (detailCourse !== null){
        var update = await CourseService.updateViews(detailCourse.ID,detailCourse.Views + 1)
        console.log(update)
    }
    res.render('./course/detailCourse',{
        title:'Chi tiết khóa học',
        data : detailCourse,
    })
}


module.exports = {
    ListCourse4Index,
    DetailCourse,
    ListCourse
}