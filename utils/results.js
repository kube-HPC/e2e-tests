const chai = require('chai');
const expect = chai.expect;
const config = require('../config/config');


const getResult = async (jobId, expectedStatus, timeout=60000) => {
    const start = Date.now();
    do {
        const res = await chai.request(config.apiServerUrl)
            .get(`/exec/results/${jobId}`);
        if (res.status==expectedStatus){
            return res.body;
        }
        // console.log(res.error)
    } while (Date.now() - start < timeout);
    expect.fail(`timeout exceeded trying to get ${expectedStatus} status for jobId ${jobId}`);
};

module.exports={
    getResult
}

