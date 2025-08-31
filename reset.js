import { query } from './config/db.js';

const resetData = async () => {
    try {
        await query('BEGIN');
        console.log('Starting data reset...');

        console.log('Truncating booked_seats...');
        await query('TRUNCATE booked_seats RESTART IDENTITY CASCADE;');

        console.log('Truncating showtimes...');
        await query('TRUNCATE showtimes RESTART IDENTITY CASCADE;');

        console.log('Truncating movies...');
        await query('TRUNCATE movies RESTART IDENTITY CASCADE;');

        console.log('Truncating upcoming_movies...');
        await query('TRUNCATE upcoming_movies RESTART IDENTITY CASCADE;');

        console.log('Truncating seat_types...');
        await query('TRUNCATE seat_types RESTART IDENTITY CASCADE;');

        console.log('Truncating halls...');
        await query('TRUNCATE halls RESTART IDENTITY CASCADE;');

        console.log('Truncating branches...');
        await query('TRUNCATE branches RESTART IDENTITY CASCADE;');

        console.log('Truncating users...');
        await query('TRUNCATE users RESTART IDENTITY CASCADE;');

        await query('COMMIT');
        console.log('Data reset complete!');
    } catch (err) {
        await query('ROLLBACK');
        console.error('Data reset failed:', err.message);
    }
};

resetData();
