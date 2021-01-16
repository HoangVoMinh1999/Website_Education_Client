const db = require("../util/util");
const TBL_COURSEDETAIL = "CourseDetail";
const TBL_RATE = "Rate";

module.exports = {
//#region Rate
allRateByCourseID : (id) => {
  return db.load(`select * from ${TBL_RATE} where IsDeleted = 0 and CourseId = ${id}`);
},
addRate : (entity) => {
  return db.add(entity, TBL_RATE);
},
//#endregion

//#region Course Detail
  all : () => {
    return db.load(`select * from ${TBL_COURSEDETAIL}`);
  },

  checkJoin : async (userId,courseId) => {
    const rows = await db.load(
      `select * from ${TBL_COURSEDETAIL} where IsDeleted = 0 and userID=${userId} and courseId = ${courseId} and IsJoin = 1`
    );
    if (rows.length > 0) return true;
   
    return false;
  },
  checkFavorite : async (userId,courseId) => {
    const rows = await db.load(
      `select * from ${TBL_COURSEDETAIL} where IsDeleted = 0 and userID=${userId} and courseId = ${courseId} and IsFavorite = 1`
    );
    if (rows.length > 0) return true;
   
    return false;
  },

  cancelCourse : (userId,courseId) => db.patch(`Update ${TBL_COURSEDETAIL} set Isdeleted = 1 where UserId = ${userId} and courseId = ${courseId} and IsJoin = 1`),

  removeWishList : (userId,courseId) => db.patch(`Update ${TBL_COURSEDETAIL} set Isdeleted = 1 where UserId = ${userId} and courseId = ${courseId} and IsFavorite = 1`),

  getWishList : (id) => db.load(`select * from ${TBL_COURSEDETAIL} where IsDeleted = 0 and userID=${id}  and IsFavorite = 1`),
  getJoinCourses : (id) => db.load(`select * from ${TBL_COURSEDETAIL} where IsDeleted = 0 and userID=${id}  and IsJoin = 1`),

  add : (entity) => {
    return db.add(entity, TBL_COURSEDETAIL);
  },
//#endregion
};