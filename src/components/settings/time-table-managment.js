import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import DataTable from 'react-data-table-component'
import { handleResponse, authHeader } from "../../services/service.backend";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Container, Row, Col, Card, CardHeader, CardBody } from 'reactstrap'
import { Accordion } from 'react-bootstrap';
import createLink from '../../helpers/createLink';
import TimePicker from 'react-times';

// use material theme
import 'react-times/css/material/default.css';
// or you can use classic theme
import 'react-times/css/classic/default.css';
class TimeTableManagment extends React.Component {
    constructor(props) {
        super(props);
        const { meridiem, focused, showTimezone, timezone } = props;
        let hour = '';
        let minute = '';
        this.state = {
            id: 0,
            subjectId: 0,
            classId: 0,
            weekdayId: 0,
            fromTime: null,
            toTime: null,
            isActive: true,
            isSubmited: false,
            isValidSubmit: false,
            iconWithTab: '1',
            timeTables: [],
            isTemplateEditorOpen: false,
            isEdit: false,
            subjects: [],
            weekDays: [],

            1: {
                hour,
                minute,
                meridiem,
                focused,
                timezone,
                showTimezone,
            },
            2: {
                hour,
                minute,
                meridiem,
                focused,
                timezone,
                showTimezone,
            }
        };

        this.onFocusChange = this.onFocusChange.bind(this);
        this.onTimeChange = this.onTimeChange.bind(this);
        this.handleFocusedChange = this.handleFocusedChange.bind(this);
    }

    componentDidMount = async () => {
        await this.getTimeTable(this.props.id);
        await this.getSubjects(15);
        await this.getWeekDays(16);
    }

    getTimeTable = async (id) => {
        const timeTableList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`setting/getAllTimeTable?classId=${id}`, requestOptions)
            .then(handleResponse)
            .then(response => {
                response.weekDays.map(i =>

                    timeTableList.push({
                        Weekday: i.Weekday, TimeTables: i.TimeTables
                    })
                )
                this.setState({
                    timeTables: timeTableList
                });
            });
    }

    getWeekDays = async (id) => {
        const weekDaysList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`reference/getReference?id=${id}`, requestOptions)
            .then(handleResponse)
            .then(response => {

                response.references.map(i =>
                    weekDaysList.push({ id: i.id, value: i.value })
                )
                this.setState({
                    weekDays: weekDaysList,
                });
            });
    }

    getSubjects = async (id) => {
        const subjectList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`reference/getReference?id=${id}&contextId=${this.props.id}`, requestOptions)
            .then(handleResponse)
            .then(response => {

                response.references.map(i =>
                    subjectList.push({ id: i.id, value: i.value })
                )
                this.setState({
                    subjects: subjectList,
                });
            });
    }

    submit = async (e) => {
        debugger
        e.preventDefault();
        this.setState({
            isSubmited: true
        });

        
        if (this.validate()) {
            var fromTime=`${this.state[1].hour}:${this.state[1].minute}`;
            var toTime=`${this.state[2].hour}:${this.state[2].minute}`;
            const currentUser = localStorage.getItem('token');
            await fetch("setting/saveTimeTable", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json",
                    "Authorization": `Bearer ${currentUser}`
                },
                "body": JSON.stringify({
                    id: this.state.id,
                    classId: +this.props.id,
                    subjectId: +this.state.subjectId,
                    fromTime: fromTime,
                    toTime: toTime,
                    weekDayId: +this.state.weekDayId,
                })
            })
                .then(response => response.json())
                .then(async (response) => {

                    if (!response.Value.Created) {
                        toast.error(response.Value.Error.Message)
                        return;
                    }

                    toast.success(response.Value.SuccessMessage)

                    await this.getTimeTable(this.props.id);

                    this.setState({
                        isSubmited: false,
                        isSmsSendOpen: false,
                        isEdit: false
                    });
                })
                .catch(err => {
                    toast.error(err)
                });
        }
    }

    openModalToggle = () => {
        this.setState({
            isSmsSendOpen: true
        });
    }

    handleModalToggle = () => {
        this.setState({
            isSmsSendOpen: false,
            isSubmited: false,
            isEdit: false
        });
    }

    handleChange(changeObject) {
        debugger
        this.setState(changeObject);
        this.setState({
            isSubmited: false
        });
    }


    validate = () => {
        if (this.state.subjectId === null || this.state.subjectId === "0") {
            return false;
        }

        if ((this.state[1].hour === null || this.state[1].hour === "") || (this.state[1].minute === null || this.state[1].minute === "")) {
            return false;
        }

        if ((this.state[2].hour === null || this.state[2].hour === "") || (this.state[2].minute === null || this.state[2].minute === "")) {
            return false;
        }
        
        this.setState({
            isValidSubmit: true
        });

        return true;
    }
    generateSubjectTableList = (timeTable) => {
        return (
            <div>
                <div className="name">{timeTable.subject}</div>
                <div className="status"> {timeTable.fromTime} - {timeTable.toTime}</div>
                <hr />
            </div>

        )
    }
    generateTimeTableList = (weekDay) => {
        return (
            <Card style={{ textAlign: "center" }}>
                <CardHeader >
                    <h5 className="mb-0">
                        <Accordion.Toggle as={Card.Header} className="btn btn-link" color="default" eventKey={weekDay.Weekday}>
                            {weekDay.Weekday}
                        </Accordion.Toggle>
                    </h5>
                </CardHeader>
                <Accordion.Collapse eventKey={weekDay.Weekday}>
                    <CardBody>
                        {weekDay.TimeTables.map(i => this.generateSubjectTableList(i))}
                    </CardBody>
                </Accordion.Collapse>
            </Card>
        )
    }
    handleSelectOptions = (refVal) => {
        return (
            <option value={refVal.id}>{refVal.value}</option>
        );
    }
    get basicTrigger() {
        const { hour, minute } = this.state;
        return (
            <div
                onClick={this.handleFocusedChange}
                className="time_picker_trigger"
            >
                <div>
                    {"Click to open panel"}<br />
                    {hour}:{minute}
                </div>
            </div>
        );
    }
    onTimeChange(section) {

        return (options) => {
            const {
                hour,
                minute,
                meridiem
            } = options;

            this.setState({
                [section]: Object.assign({}, this.state[section], {
                    hour, minute, meridiem
                })
            });
        };
    }

    onFocusChange(section) {
        return focused => this.setState({
            [section]: Object.assign({}, this.state[section], {
                focused
            })
        });
    }

    handleFocusedChange(section) {
        return () => this.setState({
            [section]: Object.assign({}, this.state[section], {
                focused: !this.state[section].focused
            })
        });
    }

    getBasicTrigger() {
        const { hour, minute } = this.state;
        return (
            <div
                onClick={this.handleFocusedChange}
                className="time_picker_trigger"
            >
                <div>
                    {"Click to open panel"}<br />
                    {hour}:{minute}
                </div>
            </div>
        );
    }

    getCustomTrigger() {
        return (
            <div
                onClick={this.handleFocusedChange}
                className="time_picker_trigger"
            >
                {/* {ICONS.time} */}
            </div>
        );
    }

    getTrigger(section) {
        const { customTriggerId } = this.props;
        const triggers = {
            0: (<div />),
            1: this.getBasicTrigger(section),
            2: this.getCustomTrigger()
        };
        return triggers[customTriggerId] || null;
    }

    renderTrigger(section) {
        const {
            hour,
            minute,
            focused,
            meridiem,
            timezone,
            showTimezone,
        } = this.state[section];

        return (
            <TimePicker
                id={section}
                trigger={this.getTrigger(section)}
                {...this.props}
                focused={focused}
                meridiem={meridiem}
                timezone={timezone}
                onFocusChange={this.onFocusChange(section)}
                onTimeChange={this.onTimeChange(section)}
                showTimezone={showTimezone}
                time={hour && minute ? `${hour}:${minute}` : null}
            />
        );
    }

    render() {

        const subjectList = [];
        this.state.subjects.forEach(refVal => {
            subjectList.push(
                this.handleSelectOptions(
                    refVal
                )
            );
        });

        const weekDaysList = [];
        this.state.weekDays.forEach(refVal => {
            weekDaysList.push(
                this.handleSelectOptions(
                    refVal
                )
            );
        });

        return (
            <Fragment>
                <Breadcrumb title="Time Table" parent="Academic Classes" parentLink={createLink('/class-management')} isParentShow={true} />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{"Time Table"}</h5>
                                </div>
                                <div className="card-body">
                                    <div className="card-header">
                                        <Button color="primary" onClick={this.openModalToggle}>Add Time Slot</Button>
                                    </div>
                                    {
                                        <Modal isOpen={this.state.isSmsSendOpen} toggle={this.handleModalToggle} size="lg">
                                            <ModalHeader toggle={this.handleModalToggle}>

                                            </ModalHeader>
                                            <ModalBody>
                                                <div className="card-body">
                                                    <form className="theme-form needs-validation" noValidate="">
                                                        <div className="card-body">

                                                            <div>
                                                                <div className="form-row">
                                                                    <div className="form-group col-12">
                                                                        <label className="col-form-label pt-0" htmlFor="subjectId">{"Subject"}</label>
                                                                        <select onChange={e => this.handleChange({ subjectId: e.target.value })} className="form-control digits" defaultValue={this.state.subjectId}>
                                                                            <option value={0}>All</option>
                                                                            {subjectList}
                                                                        </select>
                                                                        <span style={{ color: "#ff5370" }}>{this.state.isSubmited && !this.state.subjectId && 'Subject is required'}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="form-row">
                                                                <div className="form-group col-12">
                                                                    <label className="col-form-label pt-0" htmlFor="weekDayId">{"Week Day"}</label>
                                                                    <select onChange={e => this.handleChange({ weekDayId: e.target.value })} className="form-control digits" defaultValue={this.state.weekDayId}>
                                                                        <option value={0}>All</option>
                                                                        {weekDaysList}
                                                                    </select>
                                                                    <span style={{ color: "#ff5370" }}>{this.state.isSubmited && (!this.state.weekDayId || this.state.weekDayId == 0) && 'Week Day is required'}</span>
                                                                </div>
                                                            </div>

                                                            <div className="form-row">
                                                                <div className="form-group col-6">
                                                                    <label className="col-form-label pt-0" htmlFor="fromTime">{"From Time"}</label>
                                                                    {/* <input className="form-control digits" type="time" name="time" id="fromTime" aria-describedby="fromTime" value={this.state.fromTime} onChange={e => this.handleChange({ fromTime: e.target.value })} /> */}
                                                                    {this.renderTrigger(1)}
                                                                    <span style={{ color: "#ff5370" }}>{this.state.isSubmited && ((!this.state[1].hour || !this.state[1].minute) || (this.state[1].hour=="" || this.state[1].minute=="")) && 'From Time is required'}</span>
                                                                </div>
                                                                <div className="form-group col-6">
                                                                    <label className="col-form-label pt-0" htmlFor="toTime">{"To Time"}</label>
                                                                    {/* <input className="form-control digits" type="time" name="time" id="toTime" aria-describedby="toTime" value={this.state.toTime} onChange={e => this.handleChange({ toTime: e.target.value })} /> */}
                                                                    {this.renderTrigger(2)}
                                                                    <span style={{ color: "#ff5370" }}>{this.state.isSubmited && ((!this.state[2].hour || !this.state[2].minute) || (this.state[2].hour=="" || this.state[2].minute=="")) && 'To Time is required'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </ModalBody>
                                            <ModalFooter>
                                                <button className="btn btn-primary mr-1" disabled={this.state.isSubmited && this.state.isValidSubmit} type="button" onClick={(e) => this.submit(e)}>{'Submit'}</button>
                                            </ModalFooter>
                                        </Modal>
                                    }
                                    <Accordion className="col-6">
                                        <div className="default-according col-12" id="accordionclose">

                                            {this.state.timeTables.map(i => this.generateTimeTableList(i))}

                                        </div>
                                    </Accordion>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
};
const mapStateToProps = (state, params) => {
    return {
        id: params.match.params.id
    };
};

const mapDispatchToProps = (dispatch, params) => ({

});
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(TimeTableManagment));