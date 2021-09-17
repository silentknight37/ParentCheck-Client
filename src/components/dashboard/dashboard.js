import React, { Fragment, useEffect } from 'react';
import Countup from 'react-countup';
import { HelpCircle, Mic, Zap } from 'react-feather';
import teamsLogo from '../../assets/images/teamsLogo.png';
import Breadcrumb from '../common/breadcrumb';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { DemoContent, QuizCompition, SingingCompition, DiwaliCelebration, Notifications } from '../../constant'
import { handleResponse, authHeader } from "../../services/service.backend";
class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEventOpen: false,
            performances: [],
            calenderEvents: []
        };
    }

    componentDidMount = async () => {
        await this.getPerformance();
        await this.getTodayEvents();
    }

    getPerformance = async () => {
        const performancesList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`setting/getPerformance`, requestOptions)
            .then(handleResponse)
            .then(response => {
                response.performances.map(i =>
                    performancesList.push({
                        notComplete: i.notComplete, completed: i.completed, percentage: i.percentage, performanceType: i.performanceType
                    })
                )
                this.setState({
                    performances: performancesList,
                });
            });
    }

    getTodayEvents = async () => {
        const calenderEventsList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`calender/getTodayEvents`, requestOptions)
            .then(handleResponse)
            .then(response => {
                response.calenderEvents.map(i =>
                    calenderEventsList.push({
                        id: i.id, subject: i.subject, description: i.description, fromDate: i.fromDate, toDate: i.toDate, type: i.type, colorCode: i.colorCode
                    })
                )
                this.setState({
                    calenderEvents: calenderEventsList,
                });

                if(calenderEventsList.length>0){
                    this.setState({
                        isEventOpen: true
                    });
                }
            });
    }

    getHtmlContent(val) {
        return (
            <div dangerouslySetInnerHTML={{ __html: val }} />
        );
    }

    handleCalenderEvents = (refVal) => {
        return (
            <div className="media-body">
                <div className="circle-left"></div>
                <h6>{refVal.subject}<span className="pull-right f-12">{new Date(refVal.fromDate).toDateString()} - {new Date(refVal.toDate).toDateString()}</span></h6>
                <h6>{this.getHtmlContent(refVal.description)}</h6>
            </div>
        );
    }
    handleEventModalToggle = () => {
        this.setState({
            isEventOpen: false
        });
    }
    render() {
        const roleId = localStorage.getItem('roleId');
        var Knob = require('knob')// browserify require
        var primary = localStorage.getItem('primary_color') || '#4466f2';
        const assignmentPerformance = this.state.performances.filter(i => i.performanceType == "Assignment");

        const calenderEventsList = [];
        this.state.calenderEvents.forEach(refVal => {
            calenderEventsList.push(
                this.handleCalenderEvents(
                    refVal
                )
            );
        });

        return (
            <Fragment>
                <Breadcrumb parent="Dashboard" title="Dashboard" />
                <div className="container-fluid">
                    <div className="row">
                        {
                            <Modal isOpen={this.state.isEventOpen} toggle={this.handleEventModalToggle} size="lg">
                                <ModalHeader toggle={this.handleEventModalToggle}>

                                </ModalHeader>
                                <ModalBody>
                                    <div className="card-body">
                                        {calenderEventsList}
                                    </div>
                                </ModalBody>
                            </Modal>
                        }
                        {(roleId != 2 && roleId != 4 && roleId != 5) && (
                            <div className="col-xl-3 col-sm-6">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="media">
                                            <h5 className="mb-0">{"Assignment"}</h5>
                                        </div>
                                        <div className="project-widgets text-center">
                                            <h1 className="font-primary counter">
                                                {assignmentPerformance.length > 0 && (<Countup end={parseInt(assignmentPerformance[0].completed)} />)}
                                                {assignmentPerformance.length == 0 && (<Countup end={0} />)}
                                            </h1>
                                            <h6 className="mb-0">{"Completed"}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {(roleId != 2 && roleId != 4 && roleId != 5) && (
                            <div className="col-xl-3 col-sm-6">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="media">
                                            <h5 className="mb-0">{"Assignment"}</h5>
                                        </div>
                                        <div className="project-widgets text-center">
                                            <h1 className="font-primary counter">
                                                {assignmentPerformance.length > 0 && (<Countup end={parseInt(assignmentPerformance[0].notComplete)} />)}
                                                {assignmentPerformance.length == 0 && (<Countup end={0} />)}
                                            </h1>
                                            <h6 className="mb-0">{"Not Completed"}</h6>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}
                        <div className="col-xl-3 col-sm-6">
                            <div className="card">
                                <div className="card-body">
                                    <div className="project-widgets text-center">
                                        <a href="https://teams.microsoft.com/" target="blank"><img width="45%" src={teamsLogo} alt="" /></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">

                        <div className="col-xl-10 xl-100">
                            <div className="card height-equal">
                                <div className="card-header">
                                    <h5>{Notifications}</h5>
                                </div>
                                <div className="card-body">
                                    <div className="notifiaction-media">
                                        <div className="media">
                                            {calenderEventsList}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Dashboard;