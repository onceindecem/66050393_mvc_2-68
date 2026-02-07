const db = require('../config/database');

class ReportModel {
    // check if user already reported this rumor
    static async hasUserReported(userId, rumorId) {
        const sql = 'SELECT COUNT(*) as count FROM reports WHERE user_id = ? AND rumor_id = ?';
        const [rows] = await db.execute(sql, [userId, rumorId]);
        return rows[0].count > 0;
    }

    // add new report
    static async add(userId, rumorId, type) {
        const sql = 'INSERT INTO reports (user_id, rumor_id, report_type) VALUES (?, ?, ?)';
        await db.execute(sql, [userId, rumorId, type]);
    }

    // // count total reports for this rumor
    static async countByRumor(rumorId) {
        const sql = 'SELECT COUNT(*) as total FROM reports WHERE rumor_id = ?';
        const [rows] = await db.execute(sql, [rumorId]);
        return rows[0].total;
    }
}

module.exports = ReportModel;
