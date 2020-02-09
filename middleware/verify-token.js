const failedResponse = {
    status: 'auth/invalid-token'
};

function verifyToken(admin) {
    return async function(req, res, next) {
        const token = req.query.token;
        try {
            if (!token) throw new Error();
            res.locals.currentUser = await admin.auth().verifyIdToken(token);
            next();
        } catch (e) {
            console.log(e);
            await res.json(failedResponse)
        }
    }
}

module.exports = verifyToken;