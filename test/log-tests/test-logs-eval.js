const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const config = require('../../config/config');
const { getResult } = require('../../utils/results');
const { waitForLog } = require('../../utils/elasticsearch');
const uuid = require('uuid/v4');

chai.use(chaiHttp);

const descriptor = {
  name: 'test-logs-eval',
  nodes: [
    {
      nodeName: 'eval1',
      algorithmName: 'eval-alg',
      input: [
        '@flowInput.message'
      ],
      extraData: {
        code: [
          '(input) => {',
          'console.log(input[0]);',
          '}'
        ]
      }
    }
  ],
  flowInput: {
    message: 'This is a log from the test '+ uuid()
  }
};

describe('logs', () => {
  it('should write algorithm logs to elasticsearch', async () => {
    const body = descriptor;
    const res = await chai.request(config.apiServerUrl)
      .post('/exec/raw')
      .send(body);
    res.should.have.status(200);
    res.body.should.have.property('jobId');
    const jobId = res.body.jobId;

    await getResult(jobId, 200);
    console.log(`waiting for message: ${descriptor.flowInput.message}`)
    const result = await waitForLog(descriptor.flowInput.message+'\n', {
      'meta.type.keyword': 'worker',
      'meta.internal.component.keyword': 'Algorunner'
    });
    expect(result._source.message).to.include(descriptor.flowInput.message)
  }).timeout(5000000);
});