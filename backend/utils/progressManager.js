const clients = new Map();

function addClient(userId, res) {

    clients.set(userId, res);

}

function removeClient(userId) {

    clients.delete(userId);

}

function sendProgress(userId, data) {

    const client = clients.get(userId);

    if (!client) return;

    client.write(`data: ${JSON.stringify(data)}\n\n`);

}

module.exports = {

    addClient,
    removeClient,
    sendProgress

};