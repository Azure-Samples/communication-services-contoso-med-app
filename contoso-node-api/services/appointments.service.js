var conf = require("../config.json");
const userService = require('./user.service')
const spoolService = require('./spool.service')

const dbClient = require("../db/index");
const axios = require("axios");

const getSlots = async (docid) => {
  var db = dbClient.getDB();
  try {
    var doctors = await db.collection("Doctors").find({ 'id': docid }).toArray();
    return doctors[0].slots.filter(filterCrit);
  }
  catch (e) {
    console.log(e);
    return undefined;
  }
}

function filterCrit(slot) {
  if (slot.occupied === false)
    return slot;
}

const bookAppt = async (docid, slotid, body, uname) => {
  var db = dbClient.getDB();
  try {
    var doctors = await db.collection("Doctors").find({ 'id': docid }).toArray();
    if (doctors === undefined)
      return undefined;

    if (doctors[0].availableMediums.includes(body.bookingType)) {
      var doc = doctors[0];
      doc.slots.find(function (element) { if (element.id == slotid) return element; }).occupied = true;    
      
      // check if spool token and spool id is generated
      if (doc.spoolID == undefined)
        doc.spoolID = await spoolService.getSpoolID(doc.email, 'Doctor')

      db.collection("Doctors").update({ "id": doctors[0].id }, doc, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
      });

      await db.collection("Appointments").insertOne({
        bookingType: body.bookingType,
        docId: docid,
        docInfo: doc, // doctors[0],
        patientName: body.patientName,
        patientPhone: body.patientPhone,
        patientEmail: body.patientEmail,
        problemDescription: body.problemDescription,
        smsAlert: body.smsAlert,
        slot: body.slot,
        email: uname,
        user: await userService.findUser(uname),
        status: "AWAITING_ACCEPTANCE",
        start: body.slot['startTime'],
        nature: "new"
      });

      if (body.smsAlert) {
        // send SMS alert
        console.log('sending SMS alert...')
        var smsAlertEndpoint = conf.smsLogicAppEndpoint;
        try {
          await axios.post(smsAlertEndpoint, {
            phone: body.patientPhone,
            text: `Dear customer, your appointment with Dr. ${doctors[0].name} is booked for ${new Date(body.slot.startTime).toLocaleString('en-US')}. Please login to https://contosomedapp.azurewebsites.net during appointment to start your consultation.`
          })
          console.log('sms submitted successfully to ' + body.patientPhone)
        }
        catch (ex) {
          console.log('failed to send SMS');
        }
      }
    }
    return doctors[0];
  }
  catch (e) {
    console.log(e);
  }
  return undefined;
}

const getActive = async (uname) => {
  var db = dbClient.getDB();
  try {
    var appt = await db.collection("Appointments").find({ "email": uname }).toArray();
    return appt;
  }
  catch (e) {
    console.log(e);
    return undefined;
  }
}

const getActiveForDoctor = async (uname) => {
  var db = dbClient.getDB();
  try {
    var appt = await db.collection("Appointments").find({ "docInfo.email": uname }).toArray();
    return appt;
  }
  catch (e) {
    console.log(e);
    return undefined;
  }
}

exports.getSlots = getSlots;
exports.bookAppt = bookAppt;
exports.getActive = getActive;
exports.getActiveForDoctor = getActiveForDoctor;