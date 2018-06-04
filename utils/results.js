const chai = require('chai');
const expect = chai.expect;
const delay = require('delay');
const config = require('../config/config');


const getResult = async (jobId, expectedStatus, timeout=60000, interval=1000) => {
    const start = Date.now();
    do {
        process.stdout.write('.')
        const res = await chai.request(config.apiServerUrl)
            .get(`/exec/results/${jobId}`);
        if (res.status==expectedStatus){
            return res.body;
        }
        await delay(interval);
    } while (Date.now() - start < timeout);
    expect.fail(`timeout exceeded trying to get ${expectedStatus} status for jobId ${jobId}`);
};

module.exports={
    getResult
}

