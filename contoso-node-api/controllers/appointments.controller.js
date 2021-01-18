const appointmentsService = require('../services/appointments.service');
const config = require("../config.json");

if (!config || !config.connectionString || config.connectionString.indexOf('endpoint=') === -1) {
    throw new Error("Update `config.json` with connection string");
}

const getSlots = async (req, res) => {
    var slots = await appointmentsService.getSlots(req.query.doctorId); //.filter(user => user.email != req.userData.email);
    //console.log(doctors);
    res.json(slots);
}

const bookAppt = async (req, res) => {
    var slots = await appointmentsService.bookAppt(req.query.doctorId, req.query.slot_id, req.body, req.userData.email); //.filter(user => user.email != req.userData.email);
    //console.log(doctors);
    res.json(slots);
}

const getActive = async (req, res) => {
    if (req.userData.userType == 'Doctor') {
        var appt = await appointmentsService.getActiveForDoctor(req.userData.email); //.filter(user => user.email != req.userData.email);
        res.json(appt);
    }
    else {
        var appt = await appointmentsService.getActive(req.userData.email); //.filter(user => user.email != req.userData.email);
        res.json(appt);
    }
}

exports.getSlots = getSlots;
exports.bookAppt = bookAppt;
exports.getActive = getActive;