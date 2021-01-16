const db = require("../util/util");
const TBL_COURSEDETAIL = "CourseDetail";

module.exports = {
  all : () => {
    return db.load(`select * from ${TBL_COURSEDETAIL}`);
  },

  checkJoin : async (userId,courseId) => {
    const rows = await db.load(
      `select * from ${TBL_COURSEDETAIL} where IsDeleted = 0 and userID=${userId} and courseId = ${courseId}`
    );
    if (rows.length > 0) return true;
   
    return false;
  },

  cancelCourse : (userId,courseId) => db.patch(`Update ${TBL_COURSEDETAIL} set Isdeleted = 1 where UserId = ${userId} and courseId = ${courseId}`),


  add : (entity) => {
    return db.add(entity, TBL_COURSEDETAIL);
  },
};