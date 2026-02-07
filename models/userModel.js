const db = require('../config/database');

module.exports = class User {
    // retrieve all user data from DB
    static async getAll() {
        const sql = 'SELECT * FROM users ORDER BY user_id ASC';
        const [rows] = await db.execute(sql);
        return rows;
    }

    // find by id
    static async getById(id) {
        const sql = 'SELECT * FROM users WHERE user_id = ?';
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    }
};