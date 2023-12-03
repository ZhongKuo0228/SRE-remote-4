import { pool } from "./DBpool.js";

export const insertPackageOrder = async (orderData) => {
    const { estimated_delivery, recipient } = orderData;
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query("INSERT INTO package_status (estimated_delivery, recipient) VALUES (?, ?)", [
            estimated_delivery,
            recipient,
        ]);
        conn.release();
        return result.insertId;
    } catch (error) {
        console.error("Error in createPackageOrder:", error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
};

export const getPackageOrderDetail = async (id) => {
    const query = `
    SELECT 
        *
    FROM 
        package_status
    WHERE 
        id = ?;
`;
    const conn = await pool.getConnection();
    try {
        const [results] = await conn.query(query, [id]);
        conn.release();
        return results.length > 0 ? results[0] : null;
    } catch (error) {
        console.error("Error in findPackageStatusById:", error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
};

export const insertTrackingRecordDetail = async (detail) => {
    const { sno, time, status, location } = detail;
    const conn = await pool.getConnection();
    try {
        const [result] = await conn.query(
            "INSERT INTO tracking_record (sno, update_time, status, location) VALUES (?, ?, ?, ?)",
            [sno, time, status, location]
        );
        conn.release();
        return result;
    } catch (error) {
        console.error("Error in recordTrackingDetail:", error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
};

export const queryPackageStatusBySnoId = async (sno_id) => {
    const query = `
    SELECT 
        tr.id AS tracking_id,
        tr.update_time,
        ts.status,
        tl.id AS location_id,
        tl.title,
        tl.city,
        tl.address,
        ps.estimated_delivery,
        m.id AS recipient_id,
        m.name AS recipient_name,
        m.address AS recipient_address,
        m.phone AS recipient_phone
    FROM 
        tracking_record tr
    INNER JOIN 
        tracking_status ts ON tr.status = ts.id
    INNER JOIN 
        tracking_location tl ON tr.location = tl.id
    INNER JOIN 
        package_status ps ON tr.sno = ps.id
    INNER JOIN 
        member m ON ps.recipient = m.id
    WHERE 
        tr.sno = ?;
`;
    const conn = await pool.getConnection();
    try {
        const [results] = await conn.query(query, [sno_id]);
        conn.release();
        return results;
    } catch (error) {
        console.error("Error in getTrackingDetails:", error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
};

export const getTrackingStatusCounts = async () => {
    const query = `
        SELECT 
            ts.status, 
            COUNT(*) as count
        FROM 
            tracking_record tr
        INNER JOIN 
            tracking_status ts ON tr.status = ts.id
        GROUP BY 
            ts.status;
    `;
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(query);
        conn.release();

        const statusCounts = rows.reduce((acc, row) => {
            acc[row.status] = row.count;
            return acc;
        }, {});

        return statusCounts;
    } catch (error) {
        console.error("Error in getTrackingStatusCounts:", error);
        throw error;
    }
};
