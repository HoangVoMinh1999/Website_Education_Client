var express = require('express');
var router = express.Router();
const CourseController = require('../Controllers/CourseController')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//#region Course
router.get('/course',CourseController.ListCourse)
router.get('/detail',CourseController.DetailCourse)
//#endregion
module.exports = router;
