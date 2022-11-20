const fs = require('fs');

const subscriptionCost = require('./subscriptionCost.json');
const currentSubscription = require('./currentSubscription.json');
const errorCodes = require('./errorCodes.json');
const checkDateValidity = require('./utils/checkDateValidity');
const getRenewalDate = require('./utils/getRenewalDate');

// filenames = fs.readdirSync('sample_input');

const fileName = process.argv[2];

const input = fs.readFileSync(fileName).toString().split('\r\n');
let startSubscriptionStatus, addSubscriptionStatus, subscriptionDate, topUpStatus, totalCost;
startSubscriptionStatus = false;
addSubscriptionStatus = false;
topUpStatus = false;
totalCost = 0;
input.forEach((cmd) => {
    const cmdArr = cmd.split(' ');
    if (cmdArr[0] === 'START_SUBSCRIPTION') {
        if (!checkDateValidity(cmdArr[1])) {
            console.log(errorCodes.INVALID_DATE);
            startSubscriptionStatus = false;
        }
        else {
            startSubscriptionStatus = true;
            subscriptionDate = cmdArr[1];
        }
    }
    else if (cmdArr[0] === 'ADD_SUBSCRIPTION') {
        const category = cmdArr[1];
        const plan = cmdArr[2];
        if (!startSubscriptionStatus) {
            console.log(`${errorCodes.ADD_SUBSCRIPTION_FAILED} ${errorCodes.INVALID_DATE}`);
        }
        else {
            if (currentSubscription[category][plan]) {
                console.log(`${errorCodes.ADD_SUBSCRIPTION_FAILED} ${errorCodes.DUPLICATE_CATEGORY}`);
            }
            else {
                currentSubscription[category][plan] = true;
                addSubscriptionStatus = true;
                totalCost += subscriptionCost[category][plan];
            }
        }
    }
    else if (cmdArr[0] === 'ADD_TOPUP') {
        if (!addSubscriptionStatus) {
            console.log(`${errorCodes.ADD_TOPUP_FAILED} ${errorCodes.SUBSCRIPTIONS_NOT_FOUND}`);
        }
        if (topUpStatus) {
            console.log(`${errorCodes.ADD_TOPUP_FAILED} ${errorCodes.DUPLICATE_TOPUP}`);
        }
        if (!topUpStatus && addSubscriptionStatus) {
            const duration = parseInt(cmdArr[2]);
            totalCost += subscriptionCost.TOPUP[cmdArr[1]] * duration;
            topUpStatus = true;
        }
    }
    else if (cmdArr[0] === 'PRINT_RENEWAL_DETAILS') {
        if (!addSubscriptionStatus) {
            console.log(errorCodes.SUBSCRIPTIONS_NOT_FOUND);
        }
        if (startSubscriptionStatus && addSubscriptionStatus && totalCost > 0) {
            const keys = Object.keys(currentSubscription);
            keys.forEach(key => {
                const subscriptionTypeArr = Object.keys(currentSubscription[key]);
                subscriptionTypeArr.forEach(subscriptionType => {
                    if (currentSubscription[key][subscriptionType]) {
                        let duration;
                        if (subscriptionType === 'FREE') {
                            duration = 1;
                        }
                        else if (subscriptionType === 'PERSONAL') {
                            duration = 1;
                        }
                        else if (subscriptionType === 'PREMIUM') {
                            duration = 3;
                        }
                        const renewalDate = getRenewalDate(subscriptionDate, duration);
                        console.log(`${key} ${subscriptionType} ${renewalDate}`);
                    }
                });
            });
            console.log(`RENEWAL_AMOUNT ${totalCost}`);
        }
    }
});