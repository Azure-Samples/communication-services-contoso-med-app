var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");
var ObjectId = require("mongodb").ObjectID;
var conf = require("../config.json");

const dbClient = require("../db/index");

const getAllDoctors = async () => {
  var db = dbClient.getDB();
  try {
    var doctors = await db.collection("Doctors").find({}).toArray();
    return doctors;
  }
  catch (e) {
    console.log(e);
    return undefined;
  }
}

const getBySpeciality = async () => {
  var db = dbClient.getDB();
  try {
    var doctors = await db.collection("Doctors").find().toArray();

    doctors = groupBy(doctors);

    return doctors;
  }
  catch (e) {
    console.log(e);
    return undefined;
  }
}

var groupBy = function (xs) {
  return xs.reduce(function (rv, x) {
    (rv[x.speciality] = rv[x.speciality] || []).push(x);
    return rv;
  }, {});
};

const getByCategory = async (category) => {
  var db = dbClient.getDB();
  try {
    var doctors = await db.collection("Doctors").find({ speciality: category }).toArray();

    return doctors;
  }
  catch (e) {
    console.log(e);
    return undefined;
  }
}

const getDoctorById = async (doctorId) => {
  var db = dbClient.getDB();
  try {
    var doctorResult = await db.collection("Doctors").find({ id: doctorId }).toArray();
    if (doctorResult.length > 0) {
      return doctorResult[0];
    }
    else {
      console.log(`doctor with ${doctorId} not found in the database...`);
      return undefined;
    }
  }
  catch (e) {
    console.log(e);
    return undefined;
  }
}

const getCount = async () => {
  var db = dbClient.getDB();
  try {
    var doctors = await db.collection("Doctors").find().toArray();

    doctors = groupBy(doctors);
    for (doctor in doctors) {
      doctors[doctor] = doctors[doctor].length;
    }
    console.log(doctors);

    return doctors;
  }
  catch (e) {
    console.log(e);
    return undefined;
  }
}


const getLastVisited = async () => {
  var db = dbClient.getDB();
  try {
    var doctors = await db.collection("Doctors").find().limit(3).toArray();
    return doctors;
  }
  catch (e) {
    console.log(e);
    return undefined;
  }
}

const toBeAccepted = async (docId) => {
  var db = dbClient.getDB();
  try {
    var Appointments = await db.collection("Appointments").find({ 'docid': docId, 'status': 'awaiting acceptance' }).toArray();
    return Appointments;
  }
  catch (e) {
    console.log(e);
    return undefined;
  }
}

const confirmation = async (docId, slotid, status) => {
  var db = dbClient.getDB();
  try {
    var Appointments = await db.collection("Appointments").find({ 'docid': docId, 'status': 'awaiting acceptance' }).toArray();
    var oldAppt = Appointments.find(function (ele) { if (ele.slot.id === slotid) return ele; });
    var newAppointments = await db.collection("Appointments").update(oldAppt, { 'docid': docId, 'status': status }, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
    });
    return newAppointments;
  }
  catch (e) {
    console.log(e);
    return undefined;
  }
}

const getActive = async (docId) => {
  var db = dbClient.getDB();
  try {
    var Appointments = await db.collection("Appointments").find({ 'docid': docId, 'status': 'accepted' }).toArray();
    //var oldAppt=Appointments.find(function(ele){if(ele.slot.id===slotid)return ele;});
    var activeAppointments = Appointments.filter(function (appt) {
      var date = new Date();
      if (appt.slot['startTime'] > date) {
        return appt;
      }
    });
    return activeAppointments;
  }
  catch (e) {
    console.log(e);
    return undefined;
  }
}

const getPrevious = async (docId) => {
  var db = dbClient.getDB();
  try {
    var Appointments = await db.collection("Appointments").find({ 'docid': docId, 'status': 'accepted' }).toArray();
    //var oldAppt=Appointments.find(function(ele){if(ele.slot.id===slotid)return ele;});
    var activeAppointments = Appointments.filter(function (appt) {
      var date = new Date();
      if (appt.slot['endTime'] < date) {
        return appt;
      }
    });
    return activeAppointments;
  }
  catch (e) {
    console.log(e);
    return undefined;
  }
}

exports.getAllDoctors = getAllDoctors;
exports.getBySpeciality = getBySpeciality;
exports.getByCategory = getByCategory;
exports.getDoctorById = getDoctorById;
exports.getLastVisited = getLastVisited;
exports.toBeAccepted = toBeAccepted;
exports.confirmation = confirmation;
exports.getActive = getActive;
exports.getPrevious = getPrevious;
exports.getCount = getCount;