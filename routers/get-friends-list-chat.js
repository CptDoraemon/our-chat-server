const verifyToken = require('../middleware/verify-token');

function getFriendsListChat(app, admin) {
    app.get('/get-friends-list-chat', verifyToken(admin), async (req, res) => {
        try {
            const currentUserUid = res.locals.currentUserUid;
            const db = admin.firestore();
            const friendRef = await db.collection('users').doc(currentUserUid).collection('friends').get();
            const friendsID = await friendRef.docs.map(doc => doc.id);
            const friends = [];
            for (let i=0; i<friendsID.length; i++) {
                const uid = friendsID[i];
                const userRef = await db.collection('users').doc(uid).get();
                const data = userRef.data();
                friends.push({
                    uid: uid,
                    userName: data.displayName,
                    image: data.providerData[0].photoURL,
                    lastMessage: 'last message',
                    unreadMessages: 1,
                    lastMessageDate: '02:12',
                })
            }
            console.log(friends);

            await res.json({
                status: 'ok',
                data: friends
            })
        } catch (e) {
            console.log(e);
        }
    })
}

module.exports = getFriendsListChat;