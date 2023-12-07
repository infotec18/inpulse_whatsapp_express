import app from "./app";
import { AppDataSource } from "./data-source";

const PORT: number = Number(process.env.PORT) || 8000;

async function initialize() {
    
    await AppDataSource.initialize()
    console.log(new Date().toLocaleString(), ': Database connected.');
    console.log(`http://localhost:${PORT}`)
    app.listen(PORT)
};

initialize();