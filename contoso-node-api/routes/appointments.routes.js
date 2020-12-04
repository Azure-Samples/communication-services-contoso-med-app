const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointments.controller');
const checkToken = require('../middlewares/checkToken');

router.use(checkToken);

router.get('/slots', appointmentsController.getSlots);

router.post('/slots/book', appointmentsController.bookAppt);

router.get('/active', appointmentsController.getActive);

module.exports = router;
