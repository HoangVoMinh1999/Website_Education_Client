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
  all: () => db.load(`select * from ${TBL_COURSE} where IsDeleted = 0`),

  getCourseByCourseTypeId : (courseTypeId) =>
    db.load(`select * from ${TBL_COURSE} where IsDeleted = 0 and ConfigCourseTypeId = '${courseTypeId}'`),

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

  // Get 10 latest coures
  get10LatestCourses: () =>
    db.load(`select * from ${TBL_COURSE} where IsDeleted = 0 order by ID desc limit 10`),

  // Get 10 most viewed courses
  get10MostViewedCourses: () =>
    db.load(`select * from ${TBL_COURSE} where IsDeleted = 0 order by views limit 10`),

  // Get quantity by category
  getQuantityByCategory: async (id) => {
    const rows = await db.load(
      `select * from ${TBL_COURSE} where IsDeleted = 0 and ConfigCourseTypeId = ${id}`
    );
    if (rows.length == null) return null;
    return rows;
  },
  //#endregion
};