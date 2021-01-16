const db = require("../util/util");
const TBL_USERS = "user";

module.exports = {
  all() {
    return db.load(`select * from ${TBL_USERS}`);
  },

  async single(id) {
    const rows = await db.load(
      `select * from ${TBL_USERS} where userID='${id}'`
    );
    if (rows.length === 0) return null;
   
    return rows[0];
  },

  async getByType(type) {
    const rows = await db.load(
      `select * from ${TBL_USERS} where permission=${type}`
    );
    if (rows.length === 0) return null;

    return rows;
  },
  async singleByUsername(username) {
    const rows = await db.load(
      `select * from ${TBL_USERS} where username='${username}'`
    );
    if (rows.length === 0) return null;
    return rows[0];
  },
  async singleById(id) {
    const rows = await db.load(
      `select * from ${TBL_USERS} where id='${id}'`
    );
    if (rows.length === 0) return null;
    return rows[0];
  },
  async checkValidEmail(email){
    const account = await db.load(
      `select * from ${TBL_USERS} where Email='${email}'`
    );
    if (account.length > 0){
      return false;
    }
    return true;
  }, 

  add(entity) {
    return db.add(entity, TBL_USERS);
  },
};