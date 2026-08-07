const {

    addClient,
    removeClient

} = require("../utils/progressManager");

exports.progress = (req, res) => {

    res.setHeader("Content-Type", "text/event-stream");

    res.setHeader("Cache-Control", "no-cache");

    res.setHeader("Connection", "keep-alive");

    res.flushHeaders();

    addClient(req.user.id, res);

    req.on("close", () => {

        removeClient(req.user.id);

    });

};