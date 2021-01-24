import AWS from 'aws-sdk';

class S3UtilService {
  constructor() {
    const options = {
      signatureVersion: 'v4',
      region: 'eu-west-2',
    };
    this.s3Utils = new AWS.S3(options);
  }

  // delete Objects from S3 bucket
  deleteObjects = async (objects) => {
    var deleteParam = {
      Bucket: 'media.flexapp.co.uk',
      Delete: {
        Objects: objects,
      },
    };
    const options = {
      signatureVersion: 'v4',
      region: 'eu-west-2',
    };

    await this.s3Utils.deleteObjects(deleteParam, function (err, data) {
      // error
      if (err) return false;
      // deleted
      else return true;
    });
  };
}

export default new S3UtilService();
