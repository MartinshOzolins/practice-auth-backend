import dotenv from "dotenv";

import { app } from "./app.js";

// sets environmental variables
dotenv.config();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
