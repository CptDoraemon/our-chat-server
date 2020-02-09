const verifyToken = require('../middleware/verify-token');
const insertUserIfNeeded = require('../functions/insert-user-if-needed');
const checkIsFriend = require('../functions/check-is-friend');

function searchUserByUid(app, admin) {
    app.get('/search-user-by-uid', verifyToken(admin), async (req, res) => {
        try {
            const uid = req.query.uid;

            // get current user and insert into db if needed
            const currentUserUid = res.locals.currentUserUid;
            let currentUser = await admin.auth().getUser(currentUserUid);
            currentUser = await currentUser.toJSON();
            currentUser = JSON.stringify(currentUser, (k, v) => v === undefined ? null : v);
            currentUser = JSON.parse(currentUser);
            await insertUserIfNeeded(admin, currentUser);

            // Check if user searched himself/herself
            if (uid === currentUser.uid) {
                const error = new Error();
                error.errorInfo = {
                    code: 'searchedSelf'
                };
                throw error;
            }

            // get searched user and insert into db if needed
            let userRecord = await admin.auth().getUser(uid);
            userRecord = await userRecord.toJSON();
            userRecord = JSON.stringify(userRecord, (k, v) => v === undefined ? null : v);
            userRecord = JSON.parse(userRecord);
            await insertUserIfNeeded(admin, userRecord);
            // check is friend
            const isFriend = await checkIsFriend(admin, currentUser.uid, userRecord.uid);

            await res.json({
                status: 'ok',
                data: {
                    uid: userRecord.uid,
                    name: userRecord.displayName,
                    image: userRecord.photoURL,
                    isFriend: isFriend
                }
            });
        } catch (error) {
            console.log('Error fetching user data:', error);
            const errorCode = error.errorInfo.code;
            switch (errorCode) {
                case 'auth/user-not-found':
                    await res.json({
                        status: 'notFound'
                    });
                    break;
                case 'searchedSelf':
                    await res.json({
                        status: 'searchedSelf'
                    });
                    break;
                default:
                    await res.json({
                        status: 'error'
                    });
            }
        }
    })
}

module.exports = searchUserByUid;