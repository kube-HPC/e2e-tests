const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const config = require('../../config/config');
const { getResult } = require('../../utils/results');
chai.use(chaiHttp);


describe('simple algorithm', () => {
    it('should run pipeline to completion', async () => {
        const body = {
            name: 'simple'
        };
        const res = await chai.request(config.apiServerUrl)
            .post('/exec/stored')
            .send(body);
        res.should.have.status(200);
        res.body.should.have.property('jobId');
        const jobId = res.body.jobId;

        const expected = {
            jobId: jobId,
            // timestamp: '2018-05-29T07:27:05.473Z',
            pipeline: 'simple',
            data: [
                {
                    nodeName: 'black',
                    algorithmName: 'black-alg',
                    result: {
                        output: 42
                    }
                }
            ],
            status: 'completed',
            storageModule: '@hkube/s3-adapter'
        }
        const result = await getResult(jobId, 200);
        expect(result.status).to.eql('completed')
    }).timeout(5000000);
});