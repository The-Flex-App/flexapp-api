import CloudFront from 'aws-sdk/clients/cloudfront';
import AWS from 'aws-sdk';
import * as fs from 'fs';

class CloudfrontService {
  constructor() {
    this.keyPairId = process.env.AWS_CLOUDFRONT_ACCESSKEY_ID || '';
    this.privateKey = fs.readFileSync(`./keys/pk-${this.keyPairId}.pem`).toString();
    this.cloudFront = new CloudFront();
  }

  // Get specific signed url
  getSignedUrl = (url) => {
    return new Promise((resolve, reject) => {
      const expiry = Math.floor(Date.now() / 1000) + 120; // 2 minutes
      const signer = new AWS.CloudFront.Signer(this.keyPairId, this.privateKey);
      const options = { url: url, expires: expiry };
      signer.getSignedUrl(options, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };

  // Get specific signed cookies
  getSignedCookie = (domain) => {
    return new Promise((resolve, reject) => {
      const expiry = Math.floor(Date.now() / 1000) + 86400; // 1day
      const policy = {
        Statement: [
          {
            Resource: 'https://' + domain + '/*',
            Condition: {
              DateLessThan: { 'AWS:EpochTime': expiry },
            },
          },
        ],
      };
      const policyString = JSON.stringify(policy);
      const signer = new AWS.CloudFront.Signer(this.keyPairId, this.privateKey);
      const options = { url: 'https://' + domain, policy: policyString };
      signer.getSignedCookie(options, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };
}

export default new CloudfrontService();
