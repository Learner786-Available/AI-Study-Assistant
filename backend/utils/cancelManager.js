const cancelMap = new Map();

function startJob(userId) {
    cancelMap.set(userId, false);
}

function cancelJob(userId) {
    cancelMap.set(userId, true);
}

function isCancelled(userId) {
    return cancelMap.get(userId) === true;
}

function finishJob(userId) {
    cancelMap.delete(userId);
}

module.exports = {
    startJob,
    cancelJob,
    isCancelled,
    finishJob
};