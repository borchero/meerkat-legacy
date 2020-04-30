import * as fs from 'fs';

export default () => {
    const file = process.env.DB_CONNECTION_FILE;
    const result = fs.readFileSync(file);
    return {
        database: {
            connection: result.toString().trim(),
            schema: process.env.DB_SCHEMA || 'public',
        },
    };
};
