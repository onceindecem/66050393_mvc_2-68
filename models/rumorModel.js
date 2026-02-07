const db = require('../config/database');

class RumorModel {
    static async getAll() {
        // พetrieve all rumors with report counts, ordered by most reported first
        const sql = `
            SELECT r.*, COUNT(rp.report_id) as report_count 
            FROM rumors r 
            LEFT JOIN reports rp ON r.rumor_id = rp.rumor_id 
            GROUP BY r.rumor_id 
            ORDER BY report_count DESC, r.created_at DESC`; 
        
        const [rows] = await db.execute(sql);
        return rows;
    }

    static async getById(id) {
        const sql = 'SELECT * FROM rumors WHERE rumor_id = ?';
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    }

    static async updateStatus(id, status) {
        const sql = 'UPDATE rumors SET status = ? WHERE rumor_id = ?';
        await db.execute(sql, [status, id]);
    }
}

module.exports = RumorModel;