import React, { useEffect } from "react";
import { Route , Redirect } from "react-router-dom";

import Login from "../pages/authentication/Login"
import DashboardRoutes from "./dashboard.routes";
import DoctorDashboardRoutes from "./doctor-dashboard.routes";

import { connect } from "react-redux";
import { checkLogin } from "../data/actions/auth.actions";

const PrimaryRoutes = ({ checkLogin, authInfo }) => {

    useEffect(() => {
        if (authInfo.loggedIn === undefined) checkLogin()
    })

    return ((authInfo.loggedIn) ? (authInfo.userType == 'Patient' ? <Route><DashboardRoutes/></Route> : <Route><DoctorDashboardRoutes/></Route>) : <Route><Login/></Route>);
};

const mapStateToProps = (globalState) => ({
  authInfo: globalState.auth,
});

const mapDispatchToProps = {
  checkLogin,
};


export default connect(mapStateToProps, mapDispatchToProps)(PrimaryRoutes);