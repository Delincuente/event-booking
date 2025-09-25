import { Sequelize } from "sequelize"
class Database {
    static #instance;
    constructor() {
        if (Database.#instance) {
            throw new Error('Use getInstance() method.!');
        }

        this.sequelize = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PASSWORD,
            {
                host: process.env.DB_HOST,
                dialect: process.env.DB_CLIENT,
                logging: false
            }
        );

        Database.#instance = this;
    }

    async connect() {
        try {
            const con = await this.sequelize.authenticate();
            console.log('Database connected successfully...!');
        } catch (error) {
            console.log('Faild to connect Database.', error.message);
        }
    }

    async close() {
        await this.sequelize.close();
        console.log('Database connection has been cloed.');
    }

    getSequelize() {
        return this.sequelize;
    }

    static getInstance() {
        if (!Database.#instance) {
            new Database();
        }
        return Database.#instance;
    }
}

export default Database;