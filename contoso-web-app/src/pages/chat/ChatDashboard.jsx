import React, { useEffect, useState } from "react";
import UserCard from "./UserCard";
import SupportCard from "./SupportCard";
import ChatArea from "./ChatArea";
import CallCard from "./CallCard";

import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import { CallClient, LocalVideoStream } from "@azure/communication-calling";

import { connect } from "react-redux";
import { getChatClient } from "../../data/services/chat.service";
import { getActiveAppointments } from "../../data/actions/appointment.actions";
import { selectActiveBotThread } from "../../data/actions/chat.actions";

import AppBar from "../../shared/components/appbar/appbar";
import "./App.css";
import BotChatArea from "./BotChatArea";
import IncomingCallCard from "./IncomingCallCard";

const ChatDashboard = ({
  authInfo,
  appointmentsList,
  getActiveAppointments,
  selectActiveBotThread,
  supportThreads,
}) => {
  useEffect(() => {
    if (appointmentsList == undefined) getActiveAppointments();
  });

  const [selectedDoctor, setSelectedDoctor] = useState(undefined);
  const [selectedPatient, setSelectedPatient] = useState(undefined);
  const [selectedConversationType, setSelectedConversationType] = useState(
    "Appointments"
  );

  const [call, setCall] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callAgent, setCallAgent] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [cameraDeviceId, setCameraDevceId] = useState(null);
  const [speakerDeviceId, setSpeakerDeviceId] = useState(null);
  const [microphoneDeviceId, setMicrophoneDeviceId] = useState(null);
  const [deviceManager, setDeviceManager] = useState(null);
  const [cameraDeviceOptions, setCameraDeviceOptions] = useState(null);
  const [speakerDeviceOptions, setSpeakerDeviceOptions] = useState(null);
  const [microphoneDeviceOptions, setMicrophoneDeviceOptions] = useState(null);

  const initCallClient = async () => {
    try {
      const tokenCredential = new AzureCommunicationTokenCredential(
        authInfo.spoolToken
      );
      const callClient = new CallClient();
      const callAgent = await callClient.createCallAgent(tokenCredential);
      window.callAgent = callAgent;
      const deviceManager = await callClient.getDeviceManager();
      await deviceManager.askDevicePermission({
        audio: true,
        video: true,
      });
      callAgent.on("callsUpdated", (e) => {
        console.log(`callsUpdated, added=${e.added}, removed=${e.removed}`);

        e.added.forEach((call) => {
          setCall(call);
        });

        e.removed.forEach((call) => {
          if (call && call === call) {
            console.log(call.callEndReason);
            setCall(null);
          }
        });
      });

      callAgent.on("incomingCall", (args) => {
        // console.log('incoming call...')
        const incomingCall = args.incomingCall;
        if (call) {
          incomingCall.reject();
          setIncomingCall(null);
          return;
        }

        setIncomingCall(incomingCall);

        incomingCall.on("callEnded", (args) => {
          setIncomingCall(null);
          console.log(args.callEndReason);
        });
      });

      setDeviceManager(deviceManager);
      setCallAgent(callAgent);
    } catch (e) {
      console.log("call client initialization failed... refreshing page...");
      console.log(e);
      // failure might be because of pre-existing call client object
      // refresh the page

      //window.location.reload()
    }
  };

  const getCallOptions = async () => {
    let callOptions = {
      videoOptions: {
        localVideoStreams: undefined,
      },
      audioOptions: {
        muted: false,
      },
    };

    try {
      const cameras = await deviceManager.getCameras();
      const cameraDevice = cameras[0];
      if (!cameraDevice || cameraDevice.id === "camera:") {
        throw new Error("No camera devices found.");
      } else if (cameraDevice) {
        setCameraDevceId(cameraDevice.id);
        setCameraDeviceOptions(
          cameras.map((camera) => {
            return { key: camera.id, text: camera.name };
          })
        );
        const localVideoStream = new LocalVideoStream(cameraDevice);
        callOptions.videoOptions = { localVideoStreams: [localVideoStream] };
      }
    } catch (e) {
      console.log(e);
    }

    try {
      const speakers = await deviceManager.getSpeakers();
      const speakerDevice = speakers[0];
      if (!speakerDevice || speakerDevice.id === "speaker:") {
        throw new Error("No speaker devices found.");
      } else if (speakerDevice) {
        setSpeakerDeviceId(speakerDevice.id);
        setSpeakerDeviceOptions(
          speakers.map((speaker) => {
            return { key: speaker.id, text: speaker.name };
          })
        );
        await deviceManager.selectSpeaker(speakerDevice);
      }
    } catch (e) {
      console.log(e);
    }

    try {
      const microphones = await deviceManager.getMicrophones();
      const microphoneDevice = microphones[0];
      if (!microphoneDevice || microphoneDevice.id === "microphone:") {
        throw new Error("No microphone devices found.");
      } else {
        setMicrophoneDeviceId(microphoneDevice.id);
        setMicrophoneDeviceOptions(
          microphones.map((microphone) => {
            return { key: microphone.id, text: microphone.name };
          })
        );
        await deviceManager.selectMicrophone(microphoneDevice);
      }
    } catch (e) {
      console.log(e);
    }

    return callOptions;
  };

  const placeCall = async (selectedUser) => {
    // console.log('place call', selectedUser);
    try {
      callAgent.startCall(
        [{ communicationUserId: selectedUser.spoolID }],
        await getCallOptions()
      );
    } catch (e) {
      console.log("Failed to place a call", e);
    }
  };

  useEffect(() => {
    if (callAgent === null) {
      initCallClient();
    }

    if (chatClient === null) {
      setChatClient(getChatClient());
    }

    return () => {
      if (callAgent !== null) {
        try {
          console.log("trying to dispose off call client");
          callAgent.dispose();
        } catch (e) {
          console.log("error disposing call client");
          console.log(e);
        }
      }
    };
  }, [authInfo.spoolID]);

  return (
    <>
      <AppBar
        title={authInfo.userType == "Doctor" ? "My Patients" : "My Doctors"}
      />
      {call && call.callState !== "Disconnected" ? (
        <CallCard
          call={call}
          deviceManager={deviceManager}
          cameraDeviceOptions={cameraDeviceOptions}
          speakerDeviceOptions={speakerDeviceOptions}
          microphoneDeviceOptions={microphoneDeviceOptions}
          selectedDoctor={selectedDoctor}
          selectedPatient={selectedPatient}
        />
      ) : incomingCall && !call ? (
        <IncomingCallCard
          incomingCall={incomingCall}
          acceptCallOptions={async () => await getCallOptions()}
          onReject={() => {
            setIncomingCall(undefined);
          }}
          selectedDoctor={selectedDoctor}
          selectedPatient={selectedPatient}
        />
      ) : (
        <div className="chat-screen">
          <div className="chat-user-list">
            <div className="chat-user-list-header p-4">
              {authInfo.userType == "Doctor" ? "Patient" : "Doctor"} List
            </div>
            <div className="chat-users">
              {authInfo.userType == "Patient" ? (
                appointmentsList != undefined &&
                appointmentsList.length != 0 ? (
                  getDoctorsFromAppointments(appointmentsList).map(
                    (doctorEntry, index) => {
                      return (
                        <UserCard
                          key={index}
                          docInfo={doctorEntry.doctor}
                          onClick={() => {
                            setSelectedDoctor(doctorEntry.doctor);
                          }}
                          isSelected={
                            selectedDoctor?.id == doctorEntry.doctor.id
                          }
                        />
                      );
                    }
                  )
                ) : (
                  <div className="text-center m-5">
                    {authInfo.userType == "Patient"
                      ? "Book an appointment get access to doctors"
                      : "No active patients"}
                  </div>
                )
              ) : appointmentsList != undefined &&
                appointmentsList.length != 0 ? (
                getPatientsFromAppointments(appointmentsList).map(
                  (userEntry, index) => {
                    return (
                      <UserCard
                        key={index}
                        userInfo={userEntry.user}
                        onClick={() => {
                          setSelectedPatient(userEntry.user);
                          setSelectedConversationType("Appointments");
                        }}
                        isSelected={
                          selectedPatient?.id == userEntry.user.id &&
                          selectedConversationType == "Appointments"
                        }
                      />
                    );
                  }
                )
              ) : (
                <div className="text-center m-5">
                  {authInfo.userType == "Patient"
                    ? "Book an appointment get access to doctors"
                    : "No active patients"}
                </div>
              )}
            </div>

            <div
              className="chat-user-list-header p-4"
              style={{
                display:
                  authInfo.userType === "Doctor" && supportThreads.length > 0
                    ? "block"
                    : "none",
              }}
            >
              Support Conversations
            </div>
            <div className="chat-users">
              {supportThreads.map((thread) => (
                <SupportCard
                  key={thread.threadId}
                  threadInfo={thread}
                  onClick={() => {
                    selectActiveBotThread(thread);
                    setSelectedConversationType("Support");
                  }}
                  isSelected={selectedConversationType !== "Appointments"}
                />
              ))}
            </div>
          </div>
          <div className="chat-area">
            {selectedConversationType === "Appointments" ? (
              <ChatArea
                selectedDoctor={selectedDoctor}
                selectedPatient={selectedPatient}
                onCallPlaced={(selectedUser) => {
                  placeCall(selectedUser);
                }}
              />
            ) : (
              <BotChatArea />
            )}
          </div>
        </div>
      )}
    </>
  );
};

const getDoctorsFromAppointments = (appointmentsList) => {
  // this gives an object with dates as keys
  const groupedAppointments = appointmentsList.reduce((groups, appointment) => {
    const docId = appointment.docInfo.id;
    if (!groups[docId]) {
      groups[docId] = [];
    }
    groups[docId].push(appointment);
    return groups;
  }, {});

  // Edit: to add it in the array format instead
  const doctorsArray = Object.keys(groupedAppointments).map((docId) => {
    return {
      doctor: groupedAppointments[docId][0].docInfo,
      appointments: groupedAppointments[docId],
    };
  });
  return doctorsArray;
};

const getPatientsFromAppointments = (appointmentsList) => {
  // this gives an object with dates as keys
  const groupedAppointments = appointmentsList.reduce((groups, appointment) => {
    const patientId = appointment.user.email;
    if (!groups[patientId]) {
      groups[patientId] = [];
    }
    groups[patientId].push(appointment);
    return groups;
  }, {});

  // Edit: to add it in the array format instead
  const patientsArray = Object.keys(groupedAppointments).map((patientId) => {
    return {
      user: groupedAppointments[patientId][0].user,
      appointments: groupedAppointments[patientId],
    };
  });
  return patientsArray;
};

const mapStateToProps = (globalState) => ({
  authInfo: globalState.auth,
  appointmentsList: globalState.appointments.appointmentsList,
  supportThreads: globalState.chat.supportThreads,
});

const mapDispatchToProps = {
  getActiveAppointments,
  selectActiveBotThread,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatDashboard);
