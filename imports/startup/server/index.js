// Import server startup through a single index entry point

import './fixtures.js';
import './register-api.js';
import './routeMp.js';

import './routeAllOrders.js';
import './routeTokped.js';
import './routeShopee.js';
import './routeLazada.js';
import './routeBlibli.js';
import './routeBukalapak.js';
import './routeJdid.js';
import './routeZalora.js';

import './cronjob/cronAgregate.js'; //done
// import './cronjob/cronBlibli.js'; //done
// import './cronjob/cronTokopedia.js'; //done
// import './cronjob/cronBukalapak.js';
// import './cronjob/cronJdid.js';
// import './cronjob/cronLazada.js'; //done
// import './cronjob/cronShopee.js'; //done
// import './cronjob/cronZalora.js'; //done
Meteor.startup(function () {
    // process.env.MAIL_URL = ""//removed for SO;

    Accounts.config({
        sendVerificationEmail: false,
        loginExpirationInDays: null
        // forbidClientAccountCreation: true 
    });
});