import React, { useState,useEffect } from "react";
import { Route, Redirect, Switch, useHistory } from "react-router-dom";

import Header from "../shared/components/header/Header"
import PatientDashboard from "../pages/dashboard/PatientDashboard";

import DoctorList from "../pages/booking/DoctorList/DoctorList";
import Booking from "../pages/booking/AppointmentBooking/Booking"
import Appointments from "../pages/booking/Appointments/Appointments"
import ChatDashboard from "../pages/chat/ChatDashboard"

import NavItemsComponent from './navitems.component'

import "./dashboard.routes.scss";

export const NavItems = [
  {
    url:
      "https://raw.githubusercontent.com/microsoft/fluentui-system-icons/master/assets/Home/SVG/ic_fluent_home_20_regular.svg",
    title: "Home",
    link: '/'
  },
  // {
  //   url:
  //     "https://raw.githubusercontent.com/microsoft/fluentui-system-icons/master/assets/Heart/SVG/ic_fluent_heart_16_regular.svg",
  //   title: "My Doctors",
  // },
  {
    url:
      "https://raw.githubusercontent.com/microsoft/fluentui-system-icons/master/assets/Checkbox%20Checked/SVG/ic_fluent_checkbox_checked_20_regular.svg",
    title: "My Bookings",
    link: '/appointments'
  },
  {
    url:
      "https://raw.githubusercontent.com/microsoft/fluentui-system-icons/master/assets/Chat/SVG/ic_fluent_chat_20_regular.svg",
    title: "Chats",
    link: '/chat'
  },
  {
    url:
      "https://raw.githubusercontent.com/microsoft/fluentui-system-icons/master/assets/Settings/SVG/ic_fluent_settings_20_regular.svg",
    title: "Settings",
  },
  {
    url:
      "https://raw.githubusercontent.com/microsoft/fluentui-system-icons/master/assets/Sign%20Out/SVG/ic_fluent_sign_out_24_regular.svg",
    title: "Log Out",
  },
];

const contoso_logo =
  "https://res.cloudinary.com/dtldj8hpa/image/upload/v1598636037/projects/AcsTeleMed/contoso_med.png";

const navigation_url =
  "https://raw.githubusercontent.com/microsoft/fluentui-system-icons/master/assets/Navigation/SVG/ic_fluent_navigation_24_regular.svg";

const DashboardRoutes = () => {

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="body">
      <div className="drawer">
        <div className="header">
          <img src={navigation_url} alt="nav-icon" className="nav-icon" />
          <img className="logo-drawer" src={contoso_logo} alt="company name" />
        </div>

        <div className="list-actions">
          {NavItems.map((item, index) => {
            return <NavItemsComponent 
              key={index} 
              title={item.title} 
              isSelected={index === selectedIndex}
              onClick={(index) => {
                //props.onChanged(index);
                setSelectedIndex(index);
              }}
              itemLogo={item.url} 
              link={item.link} />;
          })}
        </div>
      </div>
      <div className="router-body" style={{paddingLeft: '5rem'}}>
        {/* <Header/> */}
        <Switch>
            <Route path="/" exact>
                <PatientDashboard/>
            </Route>
            <Route path="/doctors" exact>
              <DoctorList/>
            </Route>
            <Route path="/appointments" exact>
              <Appointments/>
            </Route>
            <Route path="/booking" exact>
              <Booking/>
            </Route>
            <Route path="/chat" exact>
              <ChatDashboard/>
            </Route>
        </Switch>
      </div>
    </div>
  );
};


export default DashboardRoutes;