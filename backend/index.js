import express from "express"
import { createServer } from "http"
import cors from "cors"


import { swaggerUi, swaggerSpec } from './src/utils/swagger.js';
import database from "./src/db/db.js"
import config from "./src/db/envConfig.js"

import userRouter from "./src/routes/user.routes.js"

const app = express()
const server = createServer(app)

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use("/api/v1/users" , userRouter)

app.get("/" , (req , res) => {
    res.json({message : "Hello from the server"})
})

try {
    await database.authenticate();
    console.log(`Database connected at ${config.DB_HOST}`);
} catch (error) {
    console.error({err: "Database connection failed"})
}

server.listen(config.PORT , config.HOST , () => {
    console.log(`Server running at http://${config.HOST}:${config.PORT}`);
})