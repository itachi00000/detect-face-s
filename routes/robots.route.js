const router = require('express').Router();

const {
  getRobots,
  getRobot,
  addRobot,
  updateRobot,
  deleteRobot,
  robotById
} = require('../controllers/robots.ctrl');

router.get('/', getRobots);

router.post('/', addRobot);

router.get('/:robotId', getRobot);

router.put('/:robotId', updateRobot);

router.delete('/:robotId', deleteRobot)

router.param('robotId', robotById);

module.exports = router;
