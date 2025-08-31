import { query } from '../config/db.js';


export const getBranches = async (req, res) => {
    try {
        const result = await query('SELECT * FROM branches');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching branches:', err.message);
        res.status(500).send('Server Error');
    }
};


export const getHallsByBranchId = async (req, res) => {
    const { id } = req.params;
    try {
        const hallsResult = await query('SELECT id, name, rows, columns, unavailable_seats FROM halls WHERE branch_id = $1', [id]);
        const halls = hallsResult.rows;

        for (let hall of halls) {
            const seatTypesResult = await query('SELECT type, label, price, caption, seat_rows FROM seat_types WHERE hall_id = $1', [hall.id]);
            hall.seatTypes = seatTypesResult.rows;
        }

        res.json(halls);
    } catch (err) {
        console.error('Error fetching halls:', err.message);
        res.status(500).send('Server Error');
    }
};
