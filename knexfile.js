module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: 'ls-e0a43bbdb27df80f3757b8623dd420fff61270ef.cbid7u1cqbl9.eu-west-2.rds.amazonaws.com',
      user: 'dbmasteruser',
      password: '_SD1~eaB1U(|Vke4_Tm87=z}cS`kWt5-',
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
      host: 'ls-e0a43bbdb27df80f3757b8623dd420fff61270ef.cbid7u1cqbl9.eu-west-2.rds.amazonaws.com',
      user: 'dbmasteruser',
      password: '_SD1~eaB1U(|Vke4_Tm87=z}cS`kWt5-',
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
