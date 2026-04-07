import mysql from 'mysql2/promise';

export const db = mysql.createPool({
    host: '13.60.55.59',
    user: 'dataletuser',
    password: 'Datalet@2026',
    database: 'datalethealth',
    port: 3306,
});