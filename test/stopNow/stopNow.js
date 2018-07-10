const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const config = require('../../config/config');
const delay = require('delay');
const { getResult, getStatus } = require('../../utils/results');
chai.use(chaiHttp);


describe('stop pipeline', () => {
    it('should stop immediately', async () => {
        const body = {
            name: 'simple'
        };
        const res = await chai.request(config.apiServerUrl)
            .post('/exec/stored')
            .send(body);
        res.should.have.status(200);
        res.body.should.have.property('jobId');
        const jobId = res.body.jobId;
        const stopRes = await chai.request(config.apiServerUrl)
            .post('/exec/stop')
            .send({ jobId, reason: 'from test' });
        stopRes.should.have.status(200);
        expect(stopRes.body).to.include({message:'OK'});
        const result = await getStatus(jobId, 200,'stopped', 10*1000);
        expect(result.status).to.eql('stopped')

    }).timeout(5000000);
});