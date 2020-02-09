async function addFriendIntoDb(admin, userUid, friendUid) {
    const db = admin.firestore();
    const friendRef = await db.collection('users').doc(userUid).collection('friends').doc(friendUid).set({});
}

module.exports = addFriendIntoDb;