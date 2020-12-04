import React, { useEffect, useState } from "react";
import UserCard from "./UserCard";
import SupportCard from "./SupportCard";
import ChatArea from "./ChatArea";
import CallCard from './CallCard';

import { AzureCommunicationUserCredential } from '@azure/communication-common';
import { CallClient, LocalVideoStream } from '@azure/communication-calling';

import { connect } from "react-redux";
import { getChatClient } from "../../data/services/chat.service";
import { getActiveAppointments } from "../../data/actions/appointment.actions";
import { selectActiveBotThread } from "../../data/actions/chat.actions";

import AppBar from "../../shared/components/appbar/appbar";
import "./App.css";
import BotChatArea from "./BotChatArea";

const ChatDashboard = ({ authInfo, appointmentsList, getActiveAppointments, selectActiveBotThread, supportThreads }) => {
  useEffect(() => {
    if (appointmentsList == undefined) getActiveAppointments();
  })

  const [selectedDoctor, setSelectedDoctor] = useState(undefined)
  const [selectedPatient, setSelectedPatient] = useState(undefined)
  const [selectedConversationType, setSelectedConversationType] = useState('Appointments')

  const [call, setCall] = useState(null)
  const [callAgent, setCallAgent] = useState(null)
  const [chatClient, setChatClient] = useState(null)
  const [cameraDeviceId, setCameraDevceId] = useState(null)
  const [speakerDeviceId, setSpeakerDeviceId] = useState(null)
  const [microphoneDeviceId, setMicrophoneDeviceId] = useState(null)
  const [deviceManager, setDeviceManager] = useState(null)

  const initCallClient = async () => {
    const tokenCredential = new AzureCommunicationUserCredential(authInfo.spoolToken);

    try {
      // initialize call client
      var callClient = new CallClient();
      // create call agent
      var clAgent = await callClient.createCallAgent(tokenCredential);
      let devcManager = await callClient.getDeviceManager();
      setDeviceManager(devcManager);
      clAgent.on('callsUpdated', e => {
        console.log("Call init");
        console.log(e);

        e.added.forEach(call => {
          console.log(typeof call)
          if (typeof call !== "undefined") {
            if (call && call.state.isIncoming) {
              call.reject();
              return;
            }
          }
          setCall(call)
        });

        e.removed.forEach(call => {
          if (call && call === call) {
            setCall(null);
          }
        });
      });

      setCallAgent(clAgent)
    }
    catch (e) {
      console.log('call client initialization failed... refreshing page...')
      console.log(e)
      // failure might be because of pre-existing call client object
      // refresh the page
      
      //window.location.reload()
    }
  }

  const getPlaceCallOptions = () => {
    let callOptions = {
      videoOptions: {
        localVideoStreams: undefined
      },
      audioOptions: {
        muted: false
      }
    };

    const cameraDevice = deviceManager.getCameraList()[0];
    if (!cameraDevice || cameraDevice.id === 'camera:') {
      console.error("No camera found");
    } else if (cameraDevice) {
      setCameraDevceId(cameraDevice.id);
      const localVideoStream = new LocalVideoStream(cameraDevice);
      callOptions.videoOptions = { localVideoStreams: [localVideoStream] };
    }

    return callOptions;
  }

  const placeCall = async (selectedUser) => {
    try {
      callAgent.call([{communicationUserId: selectedUser.spoolID}], getPlaceCallOptions());
    } catch (e) {
      console.log('Failed to place a call', e);
    }
  };

  useEffect(() => {
    if (callAgent === null) {
      initCallClient();
    }

    if (chatClient === null) {
      setChatClient(getChatClient())
    }

    return () => {
      if (callAgent !== null) {
        try {
          console.log('trying to dispose off call client')
          callAgent.dispose();
        }
        catch (e) {
          console.log('error disposing call client')
          console.log(e);
        }
      }
    }
  }, [authInfo.spoolID])

  return (
    <>
      <AppBar title={authInfo.userType == 'Doctor' ? 'My Patients' : 'My Doctors'} />
      {call ?
        (
          <CallCard call={call}
            deviceManager={deviceManager}
            callClient={callAgent}
            selectedCameraDeviceId={cameraDeviceId}
            selectedSpeakerDeviceId={speakerDeviceId}
            selectedMicrophoneDeviceId={microphoneDeviceId}
            selectedDoctor={selectedDoctor} selectedPatient={selectedPatient} />
        ) :
        (
          <div className="chat-screen">
            <div className="chat-user-list">
              <div className="chat-user-list-header p-4">{authInfo.userType == 'Doctor' ? 'Patient' : 'Doctor'} List</div>
              <div className="chat-users">
                {authInfo.userType == 'Patient' ? (appointmentsList != undefined && appointmentsList.length != 0) ? (
                  getDoctorsFromAppointments(appointmentsList).map(doctorEntry => {
                    return (<UserCard key={doctorEntry.doctor.id} docInfo={doctorEntry.doctor} onClick={() => { setSelectedDoctor(doctorEntry.doctor) }} isSelected={selectedDoctor?.id == doctorEntry.doctor.id} />)
                  })
                ) : (
                    <div className="text-center m-5">{authInfo.userType == 'Patient' ? 'Book an appointment get access to doctors' : 'No active patients'}</div>
                  ) : (appointmentsList != undefined && appointmentsList.length != 0) ? (
                    getPatientsFromAppointments(appointmentsList).map(userEntry => {
                      return (<UserCard key={userEntry.user.id} userInfo={userEntry.user} onClick={() => { setSelectedPatient(userEntry.user); setSelectedConversationType('Appointments'); }} isSelected={(selectedPatient?.id == userEntry.user.id) && (selectedConversationType == 'Appointments')} />)
                    })
                  ) : (
                      <div className="text-center m-5">{authInfo.userType == 'Patient' ? 'Book an appointment get access to doctors' : 'No active patients'}</div>
                    )}
              </div>

              <div className="chat-user-list-header p-4" style={{ display: authInfo.userType === 'Doctor' && supportThreads.length > 0 ? 'block' : 'none' }}>Support Conversations</div>
              <div className="chat-users">
                {supportThreads.map(thread => (
                  <SupportCard key={thread.threadId} threadInfo={thread} onClick={() => { selectActiveBotThread(thread); setSelectedConversationType('Support'); }} isSelected={selectedConversationType !== 'Appointments'} />
                ))}
              </div>

            </div>
            <div className="chat-area">
              {
                selectedConversationType === 'Appointments' 
                ? <ChatArea selectedDoctor={selectedDoctor} selectedPatient={selectedPatient} onCallPlaced={(selectedUser) => { placeCall(selectedUser); }} />
                : <BotChatArea />
              }
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
      appointments: groupedAppointments[docId]
    };
  });
  return doctorsArray;
}

const getPatientsFromAppointments = (appointmentsList) => {
  // this gives an object with dates as keys
  const groupedAppointments = appointmentsList.reduce((groups, appointment) => {
    const patientId = appointment.user.id;
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
      appointments: groupedAppointments[patientId]
    };
  });
  return patientsArray;
}

const mapStateToProps = (globalState) => ({
  authInfo: globalState.auth,
  appointmentsList: globalState.appointments.appointmentsList,
  supportThreads: globalState.chat.supportThreads
})

const mapDispatchToProps = {
  getActiveAppointments,
  selectActiveBotThread
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatDashboard);