import express from "express";
import cors from "cors";

const app = express(); // Create an Express app
const port = 3000; // Set the port

app.use(cors()); // Enable CORS

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Test route
app.get("/test", (request, response) => {
  response.set("Cache-Control", "no-store");
  response.send("I love Panda Express");
});
