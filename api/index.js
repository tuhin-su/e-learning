require("./config/env");
const http = require("http");
const WebSocket = require("ws");
const clients = new Map();

// CREATE HTTP SERVER (only for WS upgrade)
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("WebSocket server running");
});

// CREATE WebSocket Server
const wss = new WebSocket.Server({ server });

// IMPORT SOCKET HANDLERS
const userSocket = require("./handlers/userSocket");
const bookingSocket = require("./handlers/bookingSocket");

// WebSocket endpoint handlers
const wsHandlers = {
  user: userSocket,
  booking: bookingSocket,
};

const AuthNotRequire = ["user/login"];

// WebSocket connection handler
wss.on("connection", (ws) => {
  console.log("🔌 WebSocket client connected");

  const tempId = `guest_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  clients.set(tempId, { ws, meta: { connectedAt: Date.now(), temp: true } });

  ws._clientId = tempId;

  ws.on("message", async (msg) => {
    try {
      const data = JSON.parse(msg);
      const { type, command, token, body = {} } = data;

      if (type && type !== "auth") {
        console.log(data);
      }

      if (!type) {
        return ws.send(JSON.stringify({ msg: "Missing request Type", type: "error" }));
      }

      if (!command && type !== "page-change") {
        return ws.send(JSON.stringify({ msg: "Missing endpoint", type: "error" }));
      }

      if (type === "auth") {
        if (!token) {
          return ws.send(JSON.stringify({ msg: "Authentication token required", type: "warn" }));
        }

        if (ws._authenticated) {
          return ws.send(JSON.stringify({ msg: "Already authenticated", type: "success" }));
        }

        const { verifyToken } = require("./middlewares/auth");
        const user = verifyToken(token);
        if (!user) {
          return ws.send(JSON.stringify({ msg: "Invalid authentication token", type: "error", command: "goToLogin" }));
        }

        ws._authenticated = true;
        ws._user = user;
        return ws.send(JSON.stringify({ msg: "Authentication successful", type: "success" }));
      }

      if (!ws._authenticated && AuthNotRequire.includes(command)) {
        const { verifyToken } = require("./middlewares/auth");
        if (!token) {
          return ws.send(JSON.stringify({ msg: "Authentication token required", type: "warn" }));
        }
      }

      if (type === "page-change") {
        ws.pageId = data.pageId;
        return;
      }

      const parts = command.split("/").filter(Boolean);
      const service = parts.shift();
      const handler = wsHandlers[service];

      if (!handler) {
        console.log(data);
        return ws.send(JSON.stringify({ msg: "Unknown WebSocket endpoint", type: "error" }));
      }

      const context = {
        type,
        command,
        parts,
        body,
        ws,
        clients,
      };

      await handler(context);
    } catch (err) {
      console.error("WebSocket error:", err);
      ws.send(JSON.stringify({ msg: "Invalid WebSocket message format", type: "error" }));
    }
  });

  ws.on("close", () => {
    clients.delete(ws._clientId);
  });
});

// Start the server
const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
  console.log(`🛰️ WebSocket server running on port ${PORT}`);
});
