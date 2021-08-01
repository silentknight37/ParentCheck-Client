import React, { useEffect,useState } from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import {firebase_app,auth0} from './data/config';
import { configureBackend ,authHeader, handleResponse } from "./services/service.backend";
import { BrowserRouter, Switch, Route,Redirect } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

// ** Import custom components for redux **
import { Provider } from 'react-redux';
import store from './store';
import App from "./components/app";
import { Auth0Provider } from '@auth0/auth0-react'

// Import custom Components 

import Dashboard from './components/dashboard/dashboard';
import Project from './components/dashboard/project/project';

// class-room
import ClassRoomOverview from './components/class-room/class-room-overview';
import Subjects from './components/class-room/subjects';
import Chapters from './components/class-room/chapters';
import TopicContent from './components/class-room/topicContent';

// Calender
import Calender from './components/calender/calender';

// pages 
import Login from './pages/login';
import LoginWithBgImg from './pages/loginWithBgImg';
import LoginWithVideo from './pages/loginWithVideo';
import Signup from './pages/signup';
import SignupWithImg from './pages/signupWithImg';
import SignupWithVideo from './pages/signupWithVideo';
import UnlockUser from './pages/unlockUser';
import ForgetPwd from './pages/forgetPwd';
import ResetPwd from './pages/resetPwd';
import ComingSoon from './pages/comingsoon';
import ComingSoonImg from './pages/comingsoonImg';
import ComingSoonVideo from './pages/comingsoonVideo';
import Maintenance from './pages/maintenance';
import Error400 from './pages/errors/error400';
import Error401 from './pages/errors/error401';
import Error403 from './pages/errors/error403';
import Error404 from './pages/errors/error404';
import Error500 from './pages/errors/error500';
import Error503 from './pages/errors/error503';

import SweetAlert from './components/advance/sweetAlert';
import ModalComponent from './components/base/modalComponent';

// Import Applications Components
import EmailDefault from './components/applications/email-app/emailDefault';
import EmailDetail from './components/applications/email-app/emailDetail';
import SMS from './components/applications/email-app/sms';
import Template from './components/applications/email-app/template';
import Signin from './auth/signin';
import SystemSignin from './auth/systemsignin';
import Library from './components/applications/file-manager/library'

import AddSupportTicket from './components/support-ticket/addSupportTicket';
import DetailTicket from './components/support-ticket/detailTicket';
import SupportTicket from './components/support-ticket/supportTicket';
import MySupportTickets from './components/support-ticket/mysupportTickets';

//config data
import configDB from './data/customizer/config'

import Callback from './auth/callback'
import { template } from 'lodash';

// setup backend
configureBackend();


const Root = () => {

    const abortController = new AbortController();
    const [currentUser, setCurrentUser] = useState(false);
    const [authenticated,setAuthenticated] = useState(false)
    const jwt_token = localStorage.getItem('token');

    useEffect(() => {

        const requestOptions = { method: 'GET', headers: authHeader() };
        fetch('/users', requestOptions).then(handleResponse)
        const color = localStorage.getItem('color')
        console.log(color);
        const layout = localStorage.getItem('layout_version') || configDB.data.color.layout_version
        firebase_app.auth().onAuthStateChanged(setCurrentUser);
        setAuthenticated(JSON.parse(localStorage.getItem("authenticated")))
        document.body.classList.add(layout);
        console.ignoredYellowBox = ['Warning: Each', 'Warning: Failed'];
        console.disableYellowBox = true;
        document.getElementById("color").setAttribute("href", `${process.env.PUBLIC_URL}/assets/css/${color}.css`);

        return function cleanup() {
            abortController.abort();
        }
        
    // eslint-disable-next-line
    }, []);

    return (
        <div className="App">
            <Auth0Provider domain={auth0.domain} clientId={auth0.clientId} redirectUri={auth0.redirectUri}>
            <Provider store={store}>
                <BrowserRouter basename={`/`}>
                        <Switch>
                            <Route path={`${process.env.PUBLIC_URL}/login`} component={Signin} />
                            <Route path={`${process.env.PUBLIC_URL}/parent-check/login`} component={SystemSignin} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/login`} component={Login} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/loginWithBgImg`} component={LoginWithBgImg} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/loginWithVideo`} component={LoginWithVideo} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/signup`} component={Signup} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/signupWithImg`} component={SignupWithImg} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/signupWithVideo`} component={SignupWithVideo} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/unlockUser`} component={UnlockUser} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/forgetPwd`} component={ForgetPwd} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/resetPwd`} component={ResetPwd} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/comingsoon`} component={ComingSoon} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/comingsoonImg`} component={ComingSoonImg} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/comingsoonVideo`} component={ComingSoonVideo} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/maintenance`} component={Maintenance} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/errors/error400`} component={Error400} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/errors/error401`} component={Error401} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/errors/error403`} component={Error403} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/errors/error404`} component={Error404} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/errors/error500`} component={Error500} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/errors/error503`} component={Error503} />
                            <Route  path={`${process.env.PUBLIC_URL}/callback`} render={() => <Callback/>} />
                            
                            {currentUser !== null || authenticated || jwt_token ?
                            
                                <App>
                                    {/* dashboard menu */}
                                    <Route exact path={`${process.env.PUBLIC_URL}/`} render={() => {
                                        return (<Redirect to={`${process.env.PUBLIC_URL}/dashboard`} />)
                                    }} />
                                    <Route path={`${process.env.PUBLIC_URL}/dashboard`} component={Dashboard} />
                                    <Route path={`${process.env.PUBLIC_URL}/sysdashboard`} component={Project} />

                                    <Route path={`${process.env.PUBLIC_URL}/class-room-overview`} component={ClassRoomOverview} />
                                    <Route path={`${process.env.PUBLIC_URL}/subjects`} component={Subjects} />
                                    <Route path={`${process.env.PUBLIC_URL}/content/:topicId`} component={TopicContent} />
                                    <Route path={`${process.env.PUBLIC_URL}/chapters/:subjectId`} component={Chapters} />

                                    <Route path={`${process.env.PUBLIC_URL}/library`} component={Library} />

                                    <Route path={`${process.env.PUBLIC_URL}/calendar`} component={Calender} />
                                    <Route path={`${process.env.PUBLIC_URL}/advance/sweetAlert`} component={SweetAlert} />
                                    <Route path={`${process.env.PUBLIC_URL}/base/modalComponent`} component={ModalComponent} />

                                    <Route path={`${process.env.PUBLIC_URL}/support/new-ticket`} component={AddSupportTicket} />
                                    <Route path={`${process.env.PUBLIC_URL}/support/detail-ticket/:ticketId`} component={DetailTicket} />
                                    <Route path={`${process.env.PUBLIC_URL}/support/users-tickets`} component={SupportTicket} />
                                    <Route path={`${process.env.PUBLIC_URL}/support/my-ticket`} component={MySupportTickets} />

                                    <Route path={`${process.env.PUBLIC_URL}/Communication/email`} component={EmailDefault} />
                                    <Route path={`${process.env.PUBLIC_URL}/Communication/emailDetail/:id/:type`} component={EmailDetail} />
                                    <Route path={`${process.env.PUBLIC_URL}/Communication/sms`} component={SMS} />
                                    <Route path={`${process.env.PUBLIC_URL}/Communication/template`} component={Template} />
                                </App>
                             :
                                <Redirect to={`${process.env.PUBLIC_URL}/login`} />
                            } 
                        </Switch>
                </BrowserRouter>
            </Provider>
            </Auth0Provider>
        </div>
    );
}

ReactDOM.render(<Root />, document.getElementById('root'));

serviceWorker.unregister();