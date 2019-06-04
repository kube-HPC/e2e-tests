const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const config = require('../../config/config');
const { getResult } = require('../../utils/results');
const cryptoRandomString = require('crypto-random-string');
chai.use(chaiHttp);
let algoName;
let jobId;

describe('random-name algorithm', () => {
    beforeEach(async () => {
        algoName = cryptoRandomString(5);
        const addAlgoRes = await chai.request(config.apiServerUrl)
            .post('/store/algorithms')
            .send({
                name: algoName,
                algorithmImage: "hkube/algorithm-example-python:v1.0.1",
                cpu: 1,
                mem: "256Mi"
            });
        addAlgoRes.should.have.status(201);
    });
    afterEach(async () => {
        if (jobId) {
            await chai.request(config.apiServerUrl)
                .post(`/exec/stop`)
                .send({
                    jobId,
                    reason:"test failed"
                });
        }
        
        const addAlgoRes = await chai.request(config.apiServerUrl)
            .delete(`/store/algorithms/${algoName}`);

        // addAlgoRes.should.have.status(200);
    });
    it('should run pipeline to completion', async () => {
        // add algorithm


        const body = {
            name: 'randomAlgName',
            nodes: [
                {
                    nodeName: 'node1',
                    algorithmName: algoName,
                    input: ["#[0...10]"]
                }
            ]
        };
        const res = await chai.request(config.apiServerUrl)
            .post('/exec/raw')
            .send(body);
        res.should.have.status(200);
        res.body.should.have.property('jobId');
        jobId = res.body.jobId;

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
