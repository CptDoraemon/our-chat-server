function searchUser(app, admin) {
    app.get('/search-user', (req, res) => {
        const email = req.query.email;
        admin.auth().getUserByEmail(email)
            .then(function(userRecord) {
                // See the UserRecord reference doc for the contents of userRecord.
                userRecord = userRecord.toJSON();
                console.log('Successfully fetched user data:', userRecord);
                res.json({
                    status: 'ok',
                    data: {
                        uid: userRecord.uid,
                        name: userRecord.displayName,
                        image: userRecord.photoURL
                    }
                });
            })
            .catch(function(error) {
                console.log('Error fetching user data:', error);
                const errorCode = error.errorInfo.code;
                switch (errorCode) {
                    case 'auth/user-not-found':
                        res.json({
                            status: 'notFound'
                        });
                        break;
                    case 'auth/invalid-email':
                        res.json({
                            status: 'invalidEmail'
                        });
                        break;
                    default:
                        res.json({
                            status: 'error'
                        });
                }
            });
    })
}

exports.searchUser = searchUser;