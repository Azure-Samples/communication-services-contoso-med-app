const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const checkToken = require('../middlewares/checkToken');

// only authenticated routes
// below this line
//router.use(checkToken);

router.get('/all', doctorController.getAllDoctors);

router.get('/byspeciality', doctorController.bySpeciality);

router.get('/byId', doctorController.byId);

router.get('/', doctorController.byCategory);

router.get('/last-visited', doctorController.lastVisited);

router.get('/getdoctorcount', doctorController.getCount);

router.get('/currently-available', doctorController.currentlyAvailableForCategory)

router.get('/appointments/requests', doctorController.toBeAccepted);

router.get('/appointments/confirm', doctorController.confirmation);

router.get('/appointments/getactive', doctorController.getActive);

router.get('/appointments/getprevious', doctorController.getPrevious);

module.exports = router;