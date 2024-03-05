import express, { Request, Response } from "express";
import { connect } from "mongoose";
import cors from "cors";
import task_router from "./task/router.ts";

// app setup

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

connect("mongodb://localhost:27017/todoApp")
	.then(() => console.log("Connected to MongoDB"))
	.catch((err: unknown) => console.error("Could not connect to MongoDB", err));

// endpoints

app.get("/", (req: Request, res: Response) => {
	res.send("Hello from myapp backend!");
});

app.use("/tasks", task_router);

// app launch

const port = Deno.env.get("PORT") || 8082;
app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
