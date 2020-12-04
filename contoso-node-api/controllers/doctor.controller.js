const doctorService = require('../services/doctor.service');
const spoolService = require('../services/spool.service')
const config = require("../config.json");

if (!config || !config.connectionString || config.connectionString.indexOf('endpoint=') === -1) {
    throw new Error("Update `config.json` with connection string");
}

const getAllDoctors = async (req, res) => {
    var doctors = await doctorService.getAllDoctors();
    res.json(doctors);
}

const bySpeciality = async (req, res) => {
    var doctors = await doctorService.getBySpeciality() //.filter(user => user.email != req.userData.email);
    //console.log(doctors);
    res.json(doctors);
}

const byCategory = async (req, res) => {
    var doctors = await doctorService.getByCategory(req.query.category);
    res.json(doctors);
}

const byId = async (req, res) => {
    var doctor = await doctorService.getDoctorById(req.query.doctorId);
    res.json(doctor);
}

const lastVisited = async (req, res) => {
    var doctors = await doctorService.getLastVisited();
    res.json(doctors);
}

const currentlyAvailableForCategory = async (req, res) => {
    var doctors = await doctorService.getByCategory(req.query.category)
    if (doctors.length > 0) {
        var availableDoctor = doctors[0]

        // in case doctor doesn't have a spool ID yet
        if (availableDoctor.spoolID === undefined) {
            availableDoctor.spoolID = await spoolService.getSpoolID(availableDoctor.email, 'Doctor')
        }
        
        res.json(availableDoctor)
    }
    else {
        res.status(404).send()
    }
}

const toBeAccepted = async (req, res) => {
    var result = await doctorService.toBeAccepted(req.query.doctorId);
    res.json(result);
}

const confirmation = async (req, res) => {
    var result = await doctorService.confirmation(req.query.doctorId, req.query.slot_id, req.query.status);
    res.json(result);
}

const getActive = async (req, res) => {
    var result = await doctorService.getActive(req.query.doctorId);
    res.json(result);
}

const getPrevious = async (req, res) => {
    var result = await doctorService.getPrevious(req.query.doctorId);
    res.json(result);
}

const getCount = async (req, res) => {
    var result = await doctorService.getCount();
    res.json(result);
}

exports.getAllDoctors = getAllDoctors;
exports.bySpeciality = bySpeciality;
exports.byCategory = byCategory;
exports.byId = byId;
exports.lastVisited = lastVisited;
exports.currentlyAvailableForCategory = currentlyAvailableForCategory
exports.toBeAccepted = toBeAccepted;
exports.confirmation = confirmation;
exports.getActive = getActive;
exports.getPrevious = getPrevious;
exports.getCount = getCount;