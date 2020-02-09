const failedResponse = {
    status: 'auth/invalid-token'
};

function verifyToken(admin) {
    return async function(req, res, next) {
        const authorization = req.headers.authorization;
        const token = authorization.split(' ')[1];
        try {
            if (!token) throw new Error();
            res.locals.currentUser = await admin.auth().verifyIdToken(token);
            res.locals.currentUserUid = res.locals.currentUser.uid;
            next();
        } catch (e) {
            console.log(e);
            await res.json(failedResponse)
        }
    }
}

module.exports = verifyToken;