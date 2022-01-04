const PORT = 80;
const server = require("./server");

server.listen(PORT);

console.log(`Running on http://localhost:${PORT}`);
