async function checkIsFriend(admin, userUid, friendUid) {
    const db = admin.firestore();
    const friendRef = await db.collection('users').doc(userUid).collection('friends').doc(friendUid).get();
    return friendRef.exists
}

module.exports = checkIsFriend;