var express = require('express');
var router = express.Router();
const CourseController = require('../Controllers/CourseController')

/* GET home page. */
router.get('/', CourseController.ListCourse4Index);

//#region Login

//#endregion

//#region Course
router.get('/course',CourseController.ListCourse)
router.get('/detail',CourseController.DetailCourse)
//#endregion
module.exports = router;
