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
import StudentAttendant from './components/class-room/studentAttendant';
import StudentAttendantCheck from './components/class-room/studentAttendantCheck';
import Subjects from './components/class-room/subjects';
import Chapters from './components/class-room/chapters';
import TopicContent from './components/class-room/topicContent';
import TimeTable from './components/class-room/timeTable';

// Calender
import Calender from './components/calender/calender';
import GenerateEvent from './components/calender/generateEvent';

// pages 
import UnlockUser from './pages/unlockUser';
import ForgetPwd from './pages/forgetPwd';
import ResetPwd from './pages/resetPwd';

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

import IncidentReport from './components/applications/email-app/incidentReport';
import InvoiceType from './components/payment/invoiceType';
import Invoices from './components/payment/invoices';
import GenerateInvoices from './components/payment/generate-invoices';
import InvoiceDetails from './components/payment/invoicesDetails';
import GenerateInvoiceDetails from './components/payment/generateinvoiceDetails';

import UserManagement from './components/settings/user-management';
import AcademicYear from './components/settings/academic';
import Term from './components/settings/term';
import InstituteClass from './components/settings/instituteClass';
import ClassSubjectStudentManagment from './components/settings/classSubjectManagment';
import Subject from './components/settings/subject';
import StudentManagment from './components/settings/studentManagment';
import UserClassSubject from './components/settings/userClassSubject';
import SubjectChapter from './components/settings/subjectChapter';
import ChapterTopic from './components/settings/chapterTopic';
import TopicContents from './components/settings/topicContents';
import TimeTableManagment from './components/settings/time-table-managment';
import AddUser from './components/settings/add-user';
import EditUser from './components/settings/edit-user';

import UserEdit from './components/users/userEdit';


//config data
import configDB from './data/customizer/config'

import Callback from './auth/callback'

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
                            <Route path={`${process.env.PUBLIC_URL}/pages/unlockUser`} component={UnlockUser} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/forgetPwd`} component={ForgetPwd} />
                            <Route path={`${process.env.PUBLIC_URL}/pages/resetPwd`} component={ResetPwd} />
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
                                    <Route path={`${process.env.PUBLIC_URL}/timetable`} component={TimeTable} />

                                    <Route path={`${process.env.PUBLIC_URL}/library`} component={Library} />

                                    <Route path={`${process.env.PUBLIC_URL}/users/userEdit`} component={UserEdit} />

                                    <Route path={`${process.env.PUBLIC_URL}/calendar`} component={Calender} />
                                    <Route path={`${process.env.PUBLIC_URL}/event-management`} component={GenerateEvent} />
                                    <Route path={`${process.env.PUBLIC_URL}/advance/sweetAlert`} component={SweetAlert} />
                                    <Route path={`${process.env.PUBLIC_URL}/base/modalComponent`} component={ModalComponent} />

                                    <Route path={`${process.env.PUBLIC_URL}/support/new-ticket`} component={AddSupportTicket} />
                                    <Route path={`${process.env.PUBLIC_URL}/support/detail-ticket/:ticketId`} component={DetailTicket} />
                                    <Route path={`${process.env.PUBLIC_URL}/support/users-tickets`} component={SupportTicket} />
                                    <Route path={`${process.env.PUBLIC_URL}/support/my-ticket`} component={MySupportTickets} />

                                    <Route path={`${process.env.PUBLIC_URL}/communication/email`} component={EmailDefault} />
                                    <Route path={`${process.env.PUBLIC_URL}/communication/emailDetail/:id/:type`} component={EmailDetail} />
                                    <Route path={`${process.env.PUBLIC_URL}/communication/sms`} component={SMS} />
                                    <Route path={`${process.env.PUBLIC_URL}/communication/template`} component={Template} />

                                    <Route path={`${process.env.PUBLIC_URL}/incident-report`} component={IncidentReport} />
                                    <Route path={`${process.env.PUBLIC_URL}/students-attendant`} component={StudentAttendant} />
                                    <Route path={`${process.env.PUBLIC_URL}/student-attendant`} component={StudentAttendantCheck} />

                                    <Route path={`${process.env.PUBLIC_URL}/payment/invoiceType`} component={InvoiceType} />
                                    <Route path={`${process.env.PUBLIC_URL}/payment/invoices`} component={Invoices} />
                                    <Route path={`${process.env.PUBLIC_URL}/payment/generate-invoices`} component={GenerateInvoices} />
                                    <Route path={`${process.env.PUBLIC_URL}/payment/invoice/:id`} component={InvoiceDetails} />
                                    <Route path={`${process.env.PUBLIC_URL}/payment/generate-invoice/:id`} component={GenerateInvoiceDetails} />

                                    <Route path={`${process.env.PUBLIC_URL}/user-management`} component={UserManagement} />
                                    <Route path={`${process.env.PUBLIC_URL}/academic-year-management`} component={AcademicYear} />
                                    <Route path={`${process.env.PUBLIC_URL}/term-management`} component={Term} />
                                    <Route path={`${process.env.PUBLIC_URL}/time-table-management/:id`} component={TimeTableManagment} />
                                    <Route path={`${process.env.PUBLIC_URL}/class-management`} component={InstituteClass} />
                                    <Route path={`${process.env.PUBLIC_URL}/class-subject-management/:id`} component={ClassSubjectStudentManagment} />
                                    <Route path={`${process.env.PUBLIC_URL}/subject-management`} component={Subject} />
                                    <Route path={`${process.env.PUBLIC_URL}/enroll-management`} component={StudentManagment} />
                                    <Route path={`${process.env.PUBLIC_URL}/chapter-management`} component={UserClassSubject} />
                                    <Route path={`${process.env.PUBLIC_URL}/subject-chapter-management/:id`} component={SubjectChapter} />
                                    <Route path={`${process.env.PUBLIC_URL}/chapter-topic-management/:subjectChapter/:id`} component={ChapterTopic} />
                                    <Route path={`${process.env.PUBLIC_URL}/topic-content-management/:subjectChapter/:chapterTopic/:id`} component={TopicContents} />
                                    <Route path={`${process.env.PUBLIC_URL}/add-user`} component={AddUser} />
                                    <Route path={`${process.env.PUBLIC_URL}/edit-user/:id`} component={EditUser} />


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