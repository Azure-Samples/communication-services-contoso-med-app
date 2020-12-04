import React, { useState, useEffect } from "react";
import { Card, Button, Form, FormControl, InputGroup, Container, Row, Col } from 'react-bootstrap';

import { connect } from "react-redux";
import { loginUser, loginDoctor } from "../../data/actions/auth.actions";

import contosoBackground from "../../assets/images/contoso_med.png"
import "./Login.scss";
import "./loader.scss";

const Login = ({ loginUser, loginDoctor, authInfo }) => {

    // state
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const [userType, setUserType] = useState("Patient")

    useEffect(() => {
        if (authInfo.errorMessage) {
            alert('Please check your username and password')
        }
    }, [authInfo.errorMessage])

    return (
        <Container fluid className="login-page">
            {
                authInfo.loading &&
                <div className="loading-overlay">
                    <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                    <div className="text-white h3">
                        Signing You In..
                    </div>
                </div>
            }
            <Row>
                <Col style={{
                    display: "flex",
                    height: "100vh"
                }}>
                    <div className="center">
                        <img src={contosoBackground} alt="background"></img>
                    </div>
                </Col>
                <Col className="login-bgimage" style={{ padding: '0  ' }}>
                    <div className="gradient">
                        <div className="loginform">
                            <h2>Sign In</h2>
                            <div className='container-fluid usertype-toggle-container'>
                                <div className='row'>
                                    <button
                                        className={userType == 'Patient' ? "col-md-6 toggle-switch toggle-switch-active" : "col-md-6 toggle-switch"}
                                        onClick={() => {setUserType('Patient')}}>
                                        Patient
                                </button>
                                    <button
                                        className={userType == 'Doctor' ? "col-md-6 toggle-switch toggle-switch-active" : "col-md-6 toggle-switch"}
                                        onClick={() => {setUserType('Doctor')}}>
                                        Doctor
                                </button>
                                </div>
                            </div>
                            <Form>
                                <Form.Group>
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control type="text" placeholder="Enter username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </Form.Group>
                                <Button className="login-btn" variant="primary" onClick={() => {
                                    userType == 'Doctor' ? loginDoctor({ username, password }) : loginUser({ username, password })
                                }} style={{ marginTop: '1.5rem' }}>
                                    Login
                                </Button>

                                <Row>
                                    <Col>
                                        <Form.Group style={{ marginTop: '0.8rem' }}>
                                            <div><a href="#" className="forgot-pwd">Forgot Password?</a></div>
                                        </Form.Group>
                                    </Col>
                                    {/* <Col className='text-right'>
                                        <Form.Group style={{ marginTop: '0.8rem' }}>
                                            <div><a href="#" onClick={() => { setUserType(userType == 'Doctor' ? 'Patient' : 'Doctor') }} className="forgot-pwd">Looking for {(userType == 'Patient') ? (<span>Doctor</span>) : (<span>Patient</span>)} Login?</a></div>
                                        </Form.Group>
                                    </Col> */}
                                </Row>
                            </Form>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

const mapStateToProps = (globalState) => ({
    authInfo: globalState.auth
})

const mapDispatchToProps = {
    loginUser,
    loginDoctor
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);