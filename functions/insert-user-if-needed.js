async function insertUserIfNeeded(admin, userObj) {
    const db = admin.firestore();
    const userRef = await db.collection('users').doc(userObj.uid).set(userObj, {merge: true});
}

module.exports = insertUserIfNeeded;