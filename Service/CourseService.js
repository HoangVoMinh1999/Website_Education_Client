const db = require("../util/util");

const TBL_COURSE = "ConfigCourse";
const TBL_COURSETYPE = "ConfigCourseType"

module.exports = {
    //#region ConfigCourseType
    getConfigCoursetypes : () => 
        db.load(`select * from ${TBL_COURSETYPE} where IsDeleted = 0`),
    getCourseTypeId : (Type) => 
        db.load(`select Id from ${TBL_COURSETYPE} where IsDeleted = 0 and Name = '${Type}'`),
    //#endregion
    //#region ConfigCourse
  all: (option) => db.load(`select * from ${TBL_COURSE} where IsDeleted = 0 and Status='Active' ${option}`),

  getCourseByCourseTypeId : (courseTypeId, option) =>
    db.load(`select * from ${TBL_COURSE} where IsDeleted = 0 and Status='Active' and ConfigCourseTypeId = '${courseTypeId}' ${option}`),

  single: async (id) => {
    const rows = await db.load(
      `select * from ${TBL_COURSE} where IsDeleted = 0 and ID = '${id}'`
    );
    if (rows.length == null) return null;
    return rows[0];
  },

  add: (entity) => db.add(entity, TBL_COURSE),
  updateViews : (id,view) => 
    db.patch(`Update ${TBL_COURSE} set Views = '${view}' where Id = '${id}'`),

  updateStudents : (id,student) => 
    db.patch(`Update ${TBL_COURSE} set CurrentStudents = '${student}' where Id = '${id}'`),
    
  // Get 10 latest coures
  get12LatestCourses: () =>
    db.load(`select * from ${TBL_COURSE} where IsDeleted = 0 and Status='Active'  order by ID desc limit 12`),

  // Get 10 most viewed courses
  get12MostViewedCourses: () =>
    db.load(`select * from ${TBL_COURSE} where IsDeleted = 0 and Status='Active' order by views desc limit 12`),

  get12MostStudentCourses: () =>
    db.load(`select * from ${TBL_COURSE} where IsDeleted = 0 and Status='Active' order by CurrentStudents desc limit 12`),
  // Get quantity by category
  getQuantityByCategory: async (id) => {
    const rows = await db.load(
      `select * from ${TBL_COURSE} where IsDeleted = 0 and Status='Active' and ConfigCourseTypeId = ${id}`
    );
    if (rows.length == null) return null;
    return rows;
  },
  //#endregion
};