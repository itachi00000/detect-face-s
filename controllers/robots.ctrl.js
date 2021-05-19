const knex = require('../config');

const getRobots = async (req, res, next) => {
  try {
    const robots = await knex.select('*').from('robots');

    return res.json(robots);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const addRobot = async (req, res, next) => {
  try {
    const { name, username, email } = req.body;

    const [robot] = await knex
      .insert({
        name,
        username,
        email
      })
      .into('robots')
      .returning('*'); // no return?, let front-end

    return res.json(robot);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateRobot = async (req, res, next) => {
  try {
    const { id } = req.robot;
    const { name, username, email } = req.body;

    const [robot] = await knex
      .where({ id })
      .from('robots')
      .select('*')
      .update({ name, username, email })
      .returning('*'); // no return?, let front-end

    return res.json(robot);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getRobot = async (req, res, next) => {
  try {
    const { robot } = req;

    return res.json(robot);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const robotById = async (req, res, next, robotId) => {
  try {
    const [robot] = await knex
      .select('*')
      .from('robots')
      .where({ id: robotId });

    if (!robot) {
      return res.status(404).json(Error('no such robot').toString());
    }

    req.robot = robot;

    return next();
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  getRobots,
  getRobot,
  addRobot,
  updateRobot,
  robotById
};
