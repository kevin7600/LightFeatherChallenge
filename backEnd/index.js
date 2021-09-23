function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

const express = require('express');
const cors = require('cors')

const app = express();
app.use(cors());
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

const request = require('request');

/**
 * Register user for notifications from supervisor
 */
app.post('/api/submit', (req, res) => {
    body = req.body
    console.log(req.body);
    resBody = {
        msg: ''
    }
    if (!body.supervisor || !body.firstName || !body.lastName) { // all must be filled out
        resBody.msg = 'Invalid submission';
        res.status('400').send(resBody);
    } 
    else {
        resBody.msg = 'Success!';
        res.status('200').send(resBody);
    }
});

/**
 * Get list of supervisors
 */
app.get('/api/supervisors', (req, res) => {
    const url = "https://o3m5qixdng.execute-api.us-east-1.amazonaws.com/api/managers";
    request(url, (error, response, body) => {
        result = JSON.parse(body);
        if (!error && response.statusCode==200) {
            // filter out numeric jurisdiction
            result = result.filter(supervisor=>!isNumeric(supervisor.jurisdiction));
            // sort by jurisdiction, lastName, firstName
            result.sort((a,b)=> {
                num = 0
                // jurisdiction
                if (a.jurisdiction < b.jurisdiction) {
                    num -= 100
                }
                else if (a.jurisdiction > b.jurisdiction) {
                    num += 100;
                }
                // lastName
                if (a.lastName < b.lastName) {
                    num -= 10
                }
                else if (a.lastName > b.lastName) {
                    num += 10;
                }
                // firstName
                if (a.firstName < b.firstName) {
                    num -= 1
                }
                else if (a.firstName > b.firstName) {
                    num += 1;
                }
                return num
            });
            // map each element to “jurisdiction - lastName, firstName”
            result = result.map(obj => obj.jurisdiction + ' - ' + obj.lastName + ', ' + obj.firstName);
            res.send(result);
        }
    })
    
});

// deploy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));