import { db } from "../server";


// Helper function to retrieve the user ID based on an Ethereum address
export async function getUserIdByStarkAddress(address: string): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT user_id FROM users WHERE stark_address = '${address}'`,
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row?.user_id);
                }
            }
        );
    });
}


export async function createUsersTable(): Promise<void> {
    return new Promise((resolve, reject) => {
        db.run(
            'CREATE TABLE IF NOT EXISTS users (user_id TEXT NOT NULL, stark_address TEXT NOT NULL, PRIMARY KEY (user_id))',
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });
}