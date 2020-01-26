const Sequelize = require('sequelize');
const chalk = require('chalk');

const {
  STRING,
  UUID,
  UUIDV4,
} = Sequelize;

const db = new Sequelize(
  process.env.DATABASE_URI || 'postgres://localhost:5432/sessions-workshop',
  { logging: false },
);

const Session = db.define('session', {
  id: {
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4,
  },
});

const User = db.define('user', {
  id: {
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4,
  },
  github_access_token: {
    type: STRING,
    allowNull: false,
  },
});

Session.hasOne(User);
User.belongsTo(Session);

const sync = (force = false) => db.sync({ force })
  .then(() => true)
  .catch(e => {
    console.log(chalk.red('Error while syncing DB.'));
    console.error(e);
    return false;
  });

module.exports = {
  db,
  sync,
  models: {
    Session,
    User,
  },
};
