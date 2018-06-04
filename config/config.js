const config = {
    // apiServerUrl: process.env.API_URL || 'https://40.69.222.75/hkube/api-server/api/v1',
    apiServerUrl: process.env.API_URL || 'https://10.32.10.27/hkube/api-server/api/v1',
    elasticsearchUrl: process.env.ELASTICSEARCH_URL || 'https://10.32.10.27/system/elasticsearch',
    reject_selfSigned: false
}
if (!config.reject_selfSigned) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}
module.exports = config;