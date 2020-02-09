const admin = require('firebase-admin');
const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));


admin.initializeApp({
    credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
    databaseURL: "https://our-chat-765d9.firebaseio.com"
});

require('./routers/search-user')(app, admin);
require('./routers/search-user-by-uid')(app, admin);
require('./routers/add-friend')(app, admin);


const port = process.env.PORT || 5000;
app.listen(port);