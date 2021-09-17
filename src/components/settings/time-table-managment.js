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
import { Link } from 'react-router-dom';
import { UncontrolledTooltip } from 'reactstrap';
import SweetAlert from 'sweetalert2'
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
            weekDays: []

        };
    }

    componentDidMount = async () => {
        await this.getTimeTable(this.props.id);
        await this.getSubjects(15);
        await this.getWeekDays(16);
    }

    getTimeTable = async (id) => {
        const timeTableList = [];
        let timeList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`setting/getAllTimeTable?classId=${id}`, requestOptions)
            .then(handleResponse)
            .then(response => {
                response.weekDays.map(i => {
                    timeList = [];
                    i.TimeTables.map(x => {
                        timeList.push({
                            subject: x.subject, fromTime: x.fromTime, toTime: x.toTime, action:
                                <div>
                                    <Link className="btn btn-light" id="btn_Edit" onClick={() => this.removeItem(x)}><i className="icofont icofont-ui-close"></i></Link>
                                    <UncontrolledTooltip placement="top" target="btn_Edit">
                                        {"Remove"}
                                    </UncontrolledTooltip>

                                </div>
                        })
                    })
                    timeTableList.push({
                        Weekday: i.Weekday, TimeTables: timeList
                    })
                })
                this.setState({
                    timeTables: timeTableList
                });
            });
    }
    removeItem = async (item) => {
        SweetAlert.fire({
            title: "Are you sure you want remove timeslot?",
            cancelButtonText: "No",
            confirmButtonText: "Yes",
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                this.handleDelete(item);
            }
        });
    }

    handleDelete = async (item) => {
        const currentUser = localStorage.getItem('token');

        await fetch("setting/removeTimeSlot", {
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "accept": "application/json",
                "Authorization": `Bearer ${currentUser}`
            },
            "body": JSON.stringify({
                id: item.id
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
            })
            .catch(err => {
                toast.error(err)
            })
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
                    fromTime: this.state.fromTime,
                    toTime: this.state.toTime,
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
                        isEdit: false,
                        subjectId: 0,
                        classId: 0,
                        weekdayId: 0,
                        fromTime: null,
                        toTime: null,
                        isActive: true
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

        if ((this.state.fromTime === null || this.state.fromTime === "")) {
            return false;
        }

        if ((this.state.toTime === null || this.state.toTime === "")) {
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
        const openDataColumns = [
            {
                name: 'Subject',
                selector: 'subject',
                sortable: true,
                wrap: true
            },
            {
                name: 'From Time',
                selector: 'fromTime',
                sortable: true,
                wrap: true
            },
            {
                name: 'To Time',
                selector: 'toTime',
                sortable: true,
                wrap: true
            },
            {
                name: 'Action',
                selector: 'action',
                center: true
            }
        ];
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

                    <DataTable
                        columns={openDataColumns}
                        data={weekDay.TimeTables}
                        striped={true}
                        persistTableHead
                        responsive={true}
                    />
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
                                                                    <input className="form-control digits" type="time" name="time" id="fromTime" aria-describedby="fromTime" value={this.state.fromTime} onChange={e => this.handleChange({ fromTime: e.target.value })} />
                                                                    {/* {this.renderTrigger(1)} */}
                                                                    <span style={{ color: "#ff5370" }}>{this.state.isSubmited && (!this.state.fromTime || this.state.fromTime == "") && 'From Time is required'}</span>
                                                                </div>
                                                                <div className="form-group col-6">
                                                                    <label className="col-form-label pt-0" htmlFor="toTime">{"To Time"}</label>
                                                                    <input className="form-control digits" type="time" name="time" id="toTime" aria-describedby="toTime" value={this.state.toTime} onChange={e => this.handleChange({ toTime: e.target.value })} />
                                                                    {/* {this.renderTrigger(2)} */}
                                                                    <span style={{ color: "#ff5370" }}>{this.state.isSubmited && (!this.state.toTime || this.state.toTime == "") && 'To Time is required'}</span>
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
                                    <Accordion className="col-12">
                                        <div className="default-according" id="accordionclose">

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