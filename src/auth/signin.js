import React, { useState, useEffect } from 'react';
import logo from '../assets/images/logo_without_bg.png';
import avatar from '../assets/images/mascot-animate.gif';
import man from '../assets/images/dashboard/user.png';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { withRouter } from "react-router";
import { handleResponse } from "../services/service.backend";
import { Login, LOGIN, YourName, Password, RememberMe} from '../constant';
const Signin = ({ history }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [value, setValue] = useState(
        localStorage.getItem('profileURL' || man)
    );

    useEffect(() => {
        if (value !== null)
            localStorage.setItem('profileURL', value);
        else
            localStorage.setItem('profileURL', man);
    }, [value]);

    const login = async (email, password) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: (JSON.stringify({ username: email, password: password }))
        };

        return fetch(`user/authenticate`, requestOptions)
            .then(handleResponse)
            .then(response => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                setValue(man);
                localStorage.setItem('token', response.user.token);
                window.location.href = `${process.env.PUBLIC_URL}/dashboard`
                return response;
            });
    }

    return (
        <div>
            <div className="page-wrapper">
                <div className="auth-bg">
                    {/* <!-- login page start--> */}
                    <div className="authentication-main">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="auth-innerright">
                                    <div className="authentication-box">
                                        <div className="text-center">
                                            <div className="row">
                                                <div className="col-10">
                                                    <img src={logo} alt="" className="logo-img" width="40%" /></div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-6">
                                                <img src={avatar} className="avatar-image" width="100%" alt="" />
                                            </div>
                                            <div className="col-6">
                                                <div className="card mt-4">
                                                    <div className="card-body">
                                                        <div className="text-center">
                                                            <h4>{LOGIN}</h4>
                                                            <h6>{"Enter your Username and Password"} </h6>
                                                        </div>
                                                        <form className="theme-form" >
                                                            <div className="form-group">
                                                                <label className="col-form-label pt-0">{YourName}</label>
                                                                <input className="form-control" type="email" name="email"
                                                                    value={email}
                                                                    onChange={e => setEmail(e.target.value)}
                                                                    placeholder="Email address"
                                                                />

                                                            </div>
                                                            <div className="form-group">
                                                                <label className="col-form-label">{Password}</label>
                                                                <input className="form-control" type="password" name="password"
                                                                    value={password}
                                                                    onChange={e => setPassword(e.target.value)}
                                                                    placeholder="Password"
                                                                />

                                                            </div>
                                                            <div className="checkbox p-0">
                                                                <input id="checkbox1" type="checkbox" />
                                                                <label htmlFor="checkbox1">{RememberMe}</label>
                                                            </div>
                                                            <div className="form-group form-row mt-3 mb-0">
                                                                <button className="btn btn-primary btn-block" type="button" onClick={() => login(email, password)} >{Login}</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ToastContainer />
                    {/* <!-- login page end--> */}

                </div>
            </div>
        </div>
    );
};

export default withRouter(Signin);