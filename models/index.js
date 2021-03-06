const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);
const config = require('config');
const db = {};
const logger = require('winston');

const database = config.get('Database.Database');
const username = config.get('Database.Username');
const password = config.get('Database.Password');

const sequelize = new Sequelize(database, username, password, {
  host   : 'localhost',
  dialect: 'mysql',
  logging: false,
  pool   : {
    max    : 5,
    min    : 0,
    idle   : 10000,
    acquire: 10000,
  },
});

sequelize
  .authenticate()
  .then(() => {
    logger.info('Sequelize has established mysql connection successfully.');
  })
  .catch(err => {
    logger.error('Sequelize was unable to connect to the database:', err);
  });

// add each model to the db object
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

// run model.association for each model in the db object that has an association
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    logger.info('Associating model:', modelName);
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.upsert = (Model, values, condition, tableName) => {
  return Model
    .findOne({ where: condition })
    .then(obj => {
      if (obj) {  // update
        logger.debug(`updating record in db.${tableName}`);
        return obj.update(values);
      } else {  // insert
        logger.debug(`creating record in db.${tableName}`);
        return Model.create(values);
      }
    })
    .catch(function (error) {
      logger.error('Sequelize findOne error', error);
    });
};

db.getTrendingClaims = (startDate) => {
  return db.sequelize.query(`SELECT COUNT(*), File.* FROM Request LEFT JOIN File ON Request.FileId = File.id WHERE FileId IS NOT NULL AND nsfw != 1 AND trendingEligible = 1 AND Request.createdAt > "${startDate}" GROUP BY FileId ORDER BY COUNT(*) DESC LIMIT 25;`, { type: db.sequelize.QueryTypes.SELECT });
};

module.exports = db;
