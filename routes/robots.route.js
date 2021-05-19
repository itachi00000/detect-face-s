const router = require('express').Router();

const {
  getRobots,
  getRobot,
  robotById
} = require('../controllers/robots.ctrl');

router.get('/', getRobots);
router.get('/:robotId', getRobot);

router.param('robotId', robotById);

module.exports = router;
