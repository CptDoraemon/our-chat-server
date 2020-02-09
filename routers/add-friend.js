const verifyToken = require('../middleware/verify-token');
const checkIsFriend = require('../functions/check-is-friend');
const addFriendIntoDb = require('../functions/add-friend-into-db');
const bodyParser = require('body-parser');

function addFriend(app, admin) {
    app.post('/add-friend', verifyToken(admin), bodyParser.json(), async (req, res) => {
        try {
            const friendUid = req.body.friendUid;

            // get current user and insert into db if needed
            const currentUserUid = res.locals.currentUserUid;
            console.log(friendUid, currentUserUid)

            // Check if user searched himself/herself
            if (friendUid === currentUserUid) {
                const error = new Error();
                error.errorInfo = {
                    code: 'searchedSelf'
                };
                throw error;
            }

            // check is friend
            const isFriend = await checkIsFriend(admin, currentUserUid, friendUid);
            if (isFriend) {
                const error = new Error();
                error.errorInfo = {
                    code: 'isFriendAlready'
                };
                throw error;
            }

            // add friend into user collection
            await addFriendIntoDb(admin, currentUserUid, friendUid);
            await res.json({
                status: 'ok',
            });
        } catch (error) {
            console.log('Error fetching user data:', error);
            const errorCode = error.errorInfo.code;
            await res.json({
                status: 'error'
            });
            // switch (errorCode) {
            //     case 'auth/user-not-found':
            //         await res.json({
            //             status: 'notFound'
            //         });
            //         break;
            //     case 'searchedSelf':
            //         await res.json({
            //             status: 'searchedSelf'
            //         });
            //         break;
            //     default:
            //         await res.json({
            //             status: 'error'
            //         });
            // }
        }
    })
}

module.exports = addFriend;