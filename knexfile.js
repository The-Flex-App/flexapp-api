module.exports = {
  staging: {
    client: 'mysql',
    connection: {
      host: 'ls-02d714dd85e3659b1335be3dfecc3576fee25204.cltvmbclnwmk.eu-west-2.rds.amazonaws.com',
      user: 'dbmasteruser',
      password: '$WM)C.32wS.yEOrTA_|(H0|VDMMPar6E',
      database: 'flexapp_dev',
    },
    migrations: {
      directory: 'knex/migrations',
    },
    seeds: {
      directory: 'knex/seeds',
    },
    useNullAsDefault: true,
  },
  production: {
    client: 'mysql',
    connection: {
      host: 'ls-02d714dd85e3659b1335be3dfecc3576fee25204.cltvmbclnwmk.eu-west-2.rds.amazonaws.com',
      user: 'dbmasteruser',
      password: '$WM)C.32wS.yEOrTA_|(H0|VDMMPar6E',
      database: 'flexapp_prod',
    },
    migrations: {
      directory: 'knex/migrations',
    },
    seeds: {
      directory: 'knex/seeds',
    },
    useNullAsDefault: true,
  },
};
