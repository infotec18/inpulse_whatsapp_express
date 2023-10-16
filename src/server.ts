import { readFileSync } from "fs";
import app from "./app";
import { AppDataSource } from "./data-source";
import https from "https";
import path from "path";

const PORT: number = Number(process.env.PORT) || 8000;

async function initialize() {

    const options = {
        key: readFileSync(path.join(__dirname,"../cert/", "chave-privada.key")),
        cert: readFileSync(path.join(__dirname,"../cert/", "certificado-autoassinado.crt"))
    };
    
    const server = https.createServer(options, app);

    await AppDataSource.initialize()
    console.log(new Date().toLocaleString(), ': Database connected.');

    app.listen(PORT)
    server.listen(PORT, () => {
        console.log(new Date().toLocaleString(), `: App is running on http://localhost:${PORT}`);
    });

};

initialize();