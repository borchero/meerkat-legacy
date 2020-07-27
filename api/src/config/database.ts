import * as fs from 'fs';

export default () => {
    const connectionFile = process.env.DB_CONNECTION_FILE;
    const connection = fs.readFileSync(connectionFile);
    return {
        database: {
            connection: connection.toString().trim(),
        },
    };
};
