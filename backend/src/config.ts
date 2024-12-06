import { configDotenv } from 'dotenv';

export const ENV = configDotenv({ path: '../.env.back' }).parsed;
