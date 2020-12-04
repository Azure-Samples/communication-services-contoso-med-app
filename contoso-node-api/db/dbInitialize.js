const dbClient = require('../db/index')
const initData = require('./init.json')

const initializeDB = async () => {
    var db = dbClient.getDB()

    await db.collection("Doctors").deleteMany()
    console.log('deleted doctors list...')

    await db.collection("Patients").deleteMany()
    console.log('deleted patients list...')

    await db.collection("Appointments").deleteMany()
    console.log('deleted appointments list...')

    await db.collection("Threads").deleteMany()
    console.log('deleted threads list...')

    await db.collection("BotThreads").deleteMany()
    console.log('deleted bot threads list...')
    
    var doctorUsers = initData.doctors
    var patientUsers = initData.patients
    
    // adding slots to all the doctors
    doctorUsers.forEach(doctor => {
        doctor.slots.push(...generateSlots())
    })

    console.log('adding new doctors collection')
    await db.collection("Doctors").insertMany(doctorUsers)
    console.log('added doctors users')

    console.log('adding new patients collection')
    await db.collection("Patients").insertMany(patientUsers)
    console.log('added patient users')
}

const SLOTS_PER_DAY = 5;

const generateSlots = () => {
    var slots = []
    var today = new Date()
    var startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 30)

    var slotId = 0;

    // generate slots for upcoming 
    // three days including today
    for (var j = 1; j <= 3; j++) {
        for (var i = 0; i < SLOTS_PER_DAY; i++) {
            slots.push({
                id: ++slotId,
                startTime: startTime,
                endTime: new Date(startTime.getTime() + 30 /*minutes*/ * 60 * 1000),
                /* randomly mark the slots as occupied */
                occupied: ((Math.random() * 10) <= 3) ? true : false
            })
    
            // increment by an hour
            startTime = new Date(startTime.getTime() + 60 /*minutes*/ * 60 * 1000);
        }

        // reinitialize the date
        startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 30)

        // add days
        startTime = new Date(startTime.getTime() + j /*days*/ * 24 * 60 * 60 * 1000)
    }

    return slots
}

exports.initializeDB = initializeDB