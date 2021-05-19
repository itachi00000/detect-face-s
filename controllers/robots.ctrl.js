const knex = require('../config');

const getRobots = async (req, res, next) => {
  try {
    const robots = await knex.select('*').from('robots');

    return res.json(robots);
  } catch (error) {
    return res.status(404).json(error);
  }
};

const getRobot = async (req, res, next) => {
  try {
    const { robot } = req;

    return res.json(robot);
  } catch (error) {
    return res.status(404).json(error);
  }
};

const robotById = async (req, res, next, robotId) => {
  try {
    const robot = knex
      .select('*')
      .from('robots')
      .where({ id: robotId });

    req.robot = robot;

    return next();
  } catch (error) {
    return res.status(404).json(error);
  }
};

module.exports = {
  getRobots,
  getRobot,
  robotById
};
