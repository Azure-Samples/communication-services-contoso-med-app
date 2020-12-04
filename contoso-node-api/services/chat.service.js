const ChatClient = require("@azure/communication-chat").ChatClient;
const CommunicationUserCredential = require("@azure/communication-common").AzureCommunicationUserCredential;
const axios = require("axios");
const config = require("../config.json");
const userService = require("./user.service");
const spoolService = require('./spool.service')

const dbClient = require("../db/index");

// initialize chat client and
// return a thread after provisioning
// return a thread if already exists between
// the given two pair of users
const createThread = async (patientUser, threadName, doctorUser) => {
  try {
    let sender = await userService.findUser(patientUser);
    let receiver = await userService.findDoctor(doctorUser);

    var db = dbClient.getDB();
    let threads = await db.collection("Threads").find({}).toArray();

    if (threads != undefined && threads.length > 0) {
      // check if thread exists
      let thread = threads.find(
        (thread) =>
          thread.members.find((member) => member.user.communicationUserId === sender.spoolID) !=
          undefined &&
          thread.members.find((member) => member.user.communicationUserId === receiver.spoolID) !=
          undefined
      );

      if (thread != undefined) {
        console.log("thread already exists...");
        return thread;
      }
    }

    console.log("creating new thread...");
    let threadOptions = {
      topic: threadName,
      isStickyThread: false,

      members: [
        {
          user: {
            communicationUserId: await spoolService.getSpoolID(patientUser, 'Patient')
          },
          displayName: sender.name
        },
        {
          user: {
            communicationUserId: await spoolService.getSpoolID(doctorUser, 'Doctor')
          },
          displayName: receiver.name
        },
      ],
    };
    let endpointUrl = config.endpoint;

    // actual call to create the thread
    console.log("initializing chat client...");
    let chatClient = new ChatClient(endpointUrl, new CommunicationUserCredential(sender.spoolToken));

    console.log("creating thread...");
    try {
      let chatThread = await chatClient.createChatThread(threadOptions);
      threadOptions.threadId = chatThread.threadId;
      await db.collection("Threads").insertOne(threadOptions);
      return chatThread;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

// intialize a chat
// add second user to the thread
// return acknowledgment
const addUserToThread = (adminUsername, token, usernameToAdd, threadId) => { };

exports.createThread = createThread;
exports.addUserToThread = addUserToThread;
