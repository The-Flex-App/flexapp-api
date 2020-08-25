import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { initDatabase } from './utils/database';
import { apiExplorer } from './api';
import { logger } from './utils/logging';
import depthLimit from 'graphql-depth-limit';
import AWS from 'aws-sdk';
import https from 'https';
import http from 'http';
import fs from 'fs';

const configurations = {
  // Note: You may need sudo to run on port 443
  production: { ssl: true, port: 8080, hostname: '3.8.172.18' },
  development: { ssl: true, port: 8080, hostname: 'localhost' },
};

const environment = process.env.NODE_ENV || 'production';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Do not reject self signed certificates
const port = process.env.PORT || 8080;

// Init database
initDatabase();

AWS.config.update({
  accessKeyId: 'AKIAT2IQZUFMBK4AH5EN',
  secretAccessKey: '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',
  region: 'eu-west-2',
  signatureVersion: 'v4',
});

// Init api and run server
apiExplorer
  .getSchema()
  .then((schema) => {
    // Configure express
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(cors());

    const config = configurations[environment];

    app.post('/signed-url-put-object', async (req, res) => {
      const { mimeType = 'video/webm', fileName } = req;

      const params = {
        Expires: 60,
        Bucket: 'uploads.blocconsulting.com',
        Fields: {
          key: fileName,
        },
      };

      const options = {
        signatureVersion: 'v4',
        region: 'eu-west-2',
        useAccelerateEndpoint: false,
        s3ForcePathStyle: true,
      };

      const client = new AWS.S3(options);

      const form = await new Promise((resolve, reject) => {
        client.createPresignedPost(params, (err, data) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(data);
        });
      });
      return res.json({
        form: { ...form },
      });
    });

    // Configure apollo
    const apolloServer = new ApolloServer({
      schema,

      formatError: (error) => {
        logger.error(error);
        return error;
      },

      validationRules: [depthLimit(5)],

      debug: true,
    });

    apolloServer.applyMiddleware({ app });

    var server;
    if (config.ssl) {
      // Assumes certificates are in a .ssl folder off of the package root. Make sure
      // these files are secured.
      server = https.createServer(
        {
          key: fs.readFileSync(`./ssl/${environment}/server.key`),
          cert: fs.readFileSync(`./ssl/${environment}/server.crt`),
        },
        app
      );
    } else {
      server = http.createServer(app);
    }

    // Run server
    server.listen({ port: config.port }, () =>
      logger.info(
        `🚀 Server ready at http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${apolloServer.graphqlPath}`
      )
    );
  })
  .catch((err) => {
    logger.error('Failed to load api', err);
  });
