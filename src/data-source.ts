import 'dotenv/config';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import path from 'path';

const dataSourceConfig = (): DataSourceOptions => {
    const entitiesPath: string = path.join(__dirname, './entities/**.{ts,js}');
    const migrationsPath: string = path.join(__dirname, './migrations/**.{ts,js}');

    const databaseURL: string | undefined = process.env.DATABASE_URL;

    if(!databaseURL) throw new Error("Missing enviroment variable: 'DATABASE_URL'");

    const nodeEnv: string | undefined = process.env.NODE_ENV;

    if(nodeEnv === 'test') return {
        type: 'sqlite',
        database: ':memory:',
        synchronize: true,
        entities: [entitiesPath]
    };

    return {
        type: 'mysql',
        url: databaseURL,
        synchronize: false,
        logging: false,
        entities: [entitiesPath],
        migrations: [migrationsPath]
    };
};

export const AppDataSource = new DataSource(dataSourceConfig());