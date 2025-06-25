const { loginUser } = require("../controllers/userController");

module.exports = async function handleWS(context) {
  try {
    const { ws, type, command, body, parts, clients } = context;
    if (type === "POST" && parts[0] === "login") {
      // ws.send(JSON.stringify({ msg: "Login request received" }));
      const { ...params } = body;
      try {
        const result = await loginUser(params.email, params.password);
        if (result.user) {
          // console.log(response);
          ws.send(JSON.stringify({msg: "Login successful", type: "success", ...result}));
          ws._authenticated = true;
          ws._user = result.user;
        } else {
          ws.send(JSON.stringify({ msg: "Invalid credentials", type: "error", ...result }));
        }
      } catch (err) {
        console.error(err);
        ws.send(JSON.stringify({ msg: "Server error", type: "error" }));
      }
    }
    else if (type === "POST" && parts[0] === "logout") {
      ws._authenticated = false;
      ws._user = null;
      ws.send(JSON.stringify({ message: "Logout successful" }));
      
    }
  } catch (e) {
    console.error(e);
    context.ws.send(JSON.stringify({ msg: "Bad request format", type: "error" }));
  }
};
