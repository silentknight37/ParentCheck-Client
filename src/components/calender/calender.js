import React, { Fragment } from 'react';
import Breadcrumb from "../common/breadcrumb";
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/sass/styles.scss';
import { Typeahead } from 'react-bootstrap-typeahead';
import { handleResponse } from "../../services/service.backend";
import event_banner from '../../assets/images/calender/calender_event_banner.jpeg';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import SweetAlert from 'sweetalert2'
import CKEditors from "react-ckeditor-component";

const localizer = momentLocalizer(moment)
let allViews = Object.keys(Views).map(k => Views[k])
class Calender extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            calanderEvents: [],
            isEventOpen: false,
            selectedEvent: null,
            isPersonalEventOpen: false,
            id: null,
            fromDate: null,
            toDate: null,
            subject: null,
            description: null,
            type: null,
            isSubmited: false,
            isValidSubmit: false,
            eventDate: new Date().toDateString(),
            isEmailSendOpen: false,
            isGroup: false,
            searchUser: null,
            toUsers: [],
            toGroups: [],
            userContact: []
        };
    }

    componentDidMount = async () => {
        await this.getEvent(new Date().toDateString());
        await this.getToUsers();
    }
    getEvent = async (date) => {

        this.setState({
            eventDate: date
        });
        const calanderEventsList = [];
        return fetch(`calender/event?requestedDate=${date}&eventType=0`)
            .then(handleResponse)
            .then(response => {

                response.calenderEvents.map(i =>
                    calanderEventsList.push({ id: i.id, start: new Date(i.fromDate), end: new Date(i.toDate), title: i.subject, color: i.colorCode, eventDetails: i.description, type: i.type })
                )


                this.setState({
                    calanderEvents: calanderEventsList
                });
            });
    }
    getToUsers = async () => {
        const userContactList = [];
        return fetch(`reference/getAllUserContacts?sendType=${1}`)
            .then(handleResponse)
            .then(response => {
                response.userContacts.map(i =>
                    userContactList.push({ id: i.id, fullName: i.fullName, email: i.email, mobile: i.mobile })
                )
                this.setState({
                    userContact: userContactList,
                });
            });
    }

    getToGroups = async () => {
        const groupList = [];

        return fetch(`reference/getReference?id=${3}`)
            .then(handleResponse)
            .then(response => {

                response.references.map(i =>
                    groupList.push({ id: i.id, value: i.value })
                )
                this.setState({
                    userContact: groupList,
                });
            });
    }
    eventClick = event => {
        this.setState({
            isEventOpen: true,
            selectedEvent: event
        });
    };

    openModalToggle = () => {
        this.setState({
            isEmailSendOpen: true
        });
    }
    handleEmailSendModalToggle = () => {
        this.setState({
            isEmailSendOpen: false,
            isSubmited: false
        });
    }
    handleModalToggle = () => {
        this.setState({
            isEventOpen: false
        });
    }

    handleRadioChange = async (changeObject, getType) => {
        if (!getType) {
            await this.getToUsers();
        }
        else if (getType) {
            await this.getToGroups();
        }
        this.setState(changeObject);
    }

    handleToChange(e) {
        if (!this.state.isGroup) {
            this.setState({
                toUsers: e["e"]
            });
        }
        else if (this.state.isGroup) {
            this.setState({
                toGroups: e["e"]
            });
        }

        this.setState({
            isSubmited: false
        });
    }

    handlePeronalModalToggle = () => {
        this.setState({
            isPersonalEventOpen: false,
            id: null,
            fromDate: null,
            toDate: null,
            subject: null,
            description: null,
            type: null,
            isSubmited: false
        });
    }

    openPeronalModalToggle = () => {
        this.setState({
            isPersonalEventOpen: true
        });
    }

    handleChange(changeObject) {
        this.setState(changeObject);
        this.setState({
            isSubmited: false
        });
    }

    handleEditorChange = (evt) => {
        this.setState({
            description: evt.editor.getData()
        });
    }

    submitEvent = async (e) => {
        e.preventDefault();
        this.setState({
            isSubmited: true
        });

        if (this.validate()) {
            await fetch("calender/eventCreate", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json"
                },
                "body": JSON.stringify({
                    fromDate: this.state.fromDate,
                    toDate: this.state.toDate,
                    subject: this.state.subject,
                    description: this.state.description,
                    type: 1
                })
            })
                .then(response => response.json())
                .then(response => {


                    if (!response.Value.Created) {
                        toast.error(response.Value.Error.Message)
                        return;
                    }

                    toast.success(response.Value.SuccessMessage)
                    this.getEvent(this.state.eventDate);
                    this.setState({
                        isPersonalEventOpen: false
                    });
                    this.handlePeronalModalToggle();
                })
                .catch(err => {
                    toast.error(err)
                });
        }
    }

    submitCommunicationEvent = async () => {
        this.setState({
            isSubmited: true
        });

        if (this.validateEvent()) {
            await fetch("communication/composeCommunication", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json"
                },
                "body": JSON.stringify({
                    subject: this.state.subject,
                    messageText: this.stateText.value,
                    fromDate: this.state.fromDate,
                    toDate: this.state.toDate,
                    toUsers: this.state.toUsers,
                    toGroups: this.state.toGroups,
                    isGroup: this.state.isGroup,
                    communicationType: 3,
                })
            })
                .then(response => response.json())
                .then(async (response) => {

                    if (!response.Value.Created) {
                        toast.error(response.Value.Error.Message)
                        return;
                    }
                    this.setState({
                        isSubmited: false,
                        isEmailSendOpen: false,
                        subject: null,
                        message: null,
                        template: null,
                        isGroup: false,
                        toUsers: [],
                        toGroups: []
                    });

                    this.stateText.value = "";
                    toast.success(response.Value.SuccessMessage)
                    this.getEvent(this.state.eventDate);
                    this.setState({
                        isPersonalEventOpen: false
                    });
                    this.handlePeronalModalToggle();


                })
                .catch(err => {
                    toast.error(err)
                });
        }
    }

    removeCalander = async (e) => {
        SweetAlert.fire({
            title: "Are you sure you want remove event?",
            cancelButtonText: "No",
            confirmButtonText: "Yes",
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                this.removeCalanderEvent(e);
            }
        });
    }

    removeCalanderEvent = async (e) => {

        await fetch("calender/eventRemove", {
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "accept": "application/json"
            },
            "body": JSON.stringify({
                id: this.state.selectedEvent.id
            })
        })
            .then(response => response.json())
            .then(response => {


                if (!response.Value.Created) {
                    toast.error(response.Value.Error.Message)
                    return;
                }

                toast.success(response.Value.SuccessMessage)
                this.getEvent(this.state.eventDate);
                this.setState({
                    isPersonalEventOpen: false,
                    isEventOpen: false
                });
            })
            .catch(err => {
                toast.error(err)
            });
    }

    validate = () => {
        if (this.state.fromDate === null || this.state.fromDate === "") {
            return false;
        }

        if (this.state.toDate === null || this.state.toDate === "") {
            return false;
        }

        if (new Date(this.state.toDate).getTime() < new Date(this.state.fromDate).getTime()) {
            return false;
        }

        if (this.state.subject === null || this.state.subject === "") {
            return false;
        }

        if (this.state.description === null || this.state.description === "") {
            return false;
        }

        this.setState({
            isValidSubmit: true
        });

        return true;
    }

    validateEvent = () => {
        if (this.state.fromDate === null || this.state.fromDate === "") {
            return false;
        }

        if (this.state.toDate === null || this.state.toDate === "") {
            return false;
        }

        if (new Date(this.state.toDate).getTime() < new Date(this.state.fromDate).getTime()) {
            return false;
        }

        if (this.state.subject === null || this.state.subject === "") {
            return false;
        }

        this.setState({
            isValidSubmit: true
        });

        return true;
    }

    stateText = {
        value: ""
    }

    getEventForMonth = (newDate, view, action) => {
        this.getEvent(newDate.toDateString());
    }
    getHtmlContent() {
        return (
            <div dangerouslySetInnerHTML={{ __html: this.state.selectedEvent.eventDetails }} />
        );
    }
    render() {
        const onChange = (evt) => {
            const newContent = evt.editor.getData();
            if (!(newContent == "" && this.stateText.value == "")) {
                this.stateText.value = newContent;
            }
        }
        return (
            <div>
                <Fragment>
                    <Breadcrumb parent="Calender" title="Calender" isParentShow={false} />
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-header">
                                        <Button color="primary mr-2" onClick={this.openPeronalModalToggle}>Add Personal Tasks</Button>
                                        <Button color="primary " onClick={this.openModalToggle}>Add Event</Button>
                                    </div>
                                    {
                                        <Modal isOpen={this.state.isEmailSendOpen} toggle={this.handleEmailSendModalToggle} size="lg">
                                            <ModalHeader toggle={this.handleEmailSendModalToggle}>

                                            </ModalHeader>
                                            <ModalBody>
                                                <div className="card-body">
                                                    <form className="theme-form needs-validation" noValidate="">
                                                        <div className="card-body">
                                                            <div className="form-row">
                                                                <div className="form-group col-12">

                                                                    <label htmlFor="option-user">
                                                                        <input className="radio_animated" id="option-user" type="radio" name="rdo-ani" defaultChecked onChange={e => this.handleRadioChange({ isGroup: false }, false)} />
                                                                        {Option} {"To Users"}
                                                                    </label>
                                                                    <br />
                                                                    <label htmlFor="option-group">
                                                                        <input className="radio_animated" id="option-group" type="radio" name="rdo-ani" onChange={e => this.handleRadioChange({ isGroup: true }, true)} />
                                                                        {Option} {"To Groups"}
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col-12">
                                                                    {!this.state.isGroup && (
                                                                        <Typeahead
                                                                            id="user-typeahead"
                                                                            labelKey="fullName"
                                                                            multiple
                                                                            options={this.state.userContact}
                                                                            placeholder="Choose a users..."
                                                                            onChange={e => this.handleToChange({ e })}
                                                                        />
                                                                    )}
                                                                    {this.state.isGroup && (
                                                                        <Typeahead
                                                                            id="group-typeahead"
                                                                            labelKey="value"
                                                                            multiple
                                                                            options={this.state.userContact}
                                                                            placeholder="Choose a users..."
                                                                            onChange={e => this.handleToChange({ e })}
                                                                        />
                                                                    )}
                                                                    <span style={{ color: "#ff5370" }}>{this.state.isSubmited && (this.state.toUsers.length === 0 && this.state.toGroups.length === 0) && 'Sending participant is required'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group">
                                                                    <label className="col-form-label pt-0" htmlFor="fromDate">{"From Date"}</label>
                                                                    <input className="form-control" id="fromDate" onChange={e => this.handleChange({ fromDate: e.target.value })} type="datetime-local" aria-describedby="fromDate" placeholder="Enter From Date" />
                                                                    <span>{this.state.isSubmited && !this.state.fromDate && 'From Date is required'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group">
                                                                    <label className="col-form-label pt-0" htmlFor="toDate">{"To Date"}</label>
                                                                    <input className="form-control" id="toDate" type="datetime-local" aria-describedby="toDate" onChange={e => this.handleChange({ toDate: e.target.value })} placeholder="Enter To Date" />
                                                                    <span>{this.state.isSubmited && !this.state.toDate && 'To Date is required'}</span>
                                                                    <span>{this.state.isSubmited && this.state.toDate && !this.state.fromDate && 'From Date select first'}</span>
                                                                    <span>{this.state.isSubmited && this.state.toDate < this.state.fromDate && 'From Date less than To Date'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col-12">
                                                                    <label className="col-form-label pt-0" htmlFor="subject">{"Subject"}</label>
                                                                    <input className="form-control" id="subject" type="text" aria-describedby="subject" onChange={e => this.handleChange({ subject: e.target.value })} placeholder="Subject" />
                                                                    <span>{this.state.isSubmited && !this.state.subject && 'Subject is required'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col-12">
                                                                    <label className="col-form-label pt-0" htmlFor="message">{"Message"}</label>
                                                                    <CKEditors id="message"
                                                                        events={{
                                                                            "change": onChange
                                                                        }}
                                                                    />

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </ModalBody>
                                            <ModalFooter>
                                                <button className="btn btn-primary mr-1" disabled={this.state.isSubmited && this.state.isValidSubmit} type="button" onClick={() => this.submitCommunicationEvent()}>{'Submit'}</button>
                                            </ModalFooter>
                                        </Modal>
                                    }
                                    <div className="card-body">
                                        <Calendar
                                            onNavigate={(newDate, view, action) => this.getEventForMonth(newDate, view, action)}
                                            localizer={localizer}
                                            scrollToTime={new Date(1970, 1, 1, 6)}
                                            defaultDate={new Date()}
                                            onSelectEvent={this.eventClick
                                            }
                                            views={allViews}
                                            events={this.state.calanderEvents}
                                            eventOverlap
                                            dragRevertDuration={500}
                                            dragScroll
                                            showMultiDayTimes
                                            step={60}
                                            startAccessor="start"
                                            endAccessor="end"
                                            eventPropGetter={
                                                (event, start, end, isSelected) => {
                                                    let newStyle = {
                                                        backgroundColor: event.color,
                                                        color: '#fff',
                                                        borderRadius: "0px",
                                                        border: "none"
                                                    };

                                                    return {
                                                        className: "",
                                                        style: newStyle
                                                    };
                                                }
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>

                {
                    this.state.selectedEvent && (<Modal isOpen={this.state.isEventOpen} toggle={this.handleModalToggle} size="lg">
                        <ModalBody>
                            <div className="col-sm-12 col-xl-12">
                                <div className="ribbon-wrapper card">
                                    <div className="card-body">
                                        <div className="ribbon ribbon-clip" style={{ backgroundColor: this.state.selectedEvent.color }}>{this.state.selectedEvent.title}</div>
                                        <img className="blur-up lazyloaded m-b-20" src={event_banner} alt="" width={"100%"} />
                                        <div className="row">
                                            <label className="col-sm-3"><b>Event From Date</b></label>
                                            <div className="col-sm-9">
                                                {
                                                    this.state.selectedEvent.start.toDateString()}
                                            </div>
                                        </div>

                                        <div className="row">
                                            <label className="col-sm-3"><b>Event To Date</b></label>
                                            <div className="col-sm-9">
                                                {this.state.selectedEvent.end.toDateString()}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <label className="col-sm-3"><b>Event Details</b></label>
                                            <div className="col-sm-9">
                                                {this.getHtmlContent()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </ModalBody>
                        <ModalFooter>
                            {this.state.selectedEvent.type === 1 && (<Button color="danger" onClick={this.removeCalander}>Remove</Button>)}
                            <Button color="secondary" onClick={this.handleModalToggle}>Close</Button>
                        </ModalFooter>
                    </Modal>)
                }

                {
                    <Modal isOpen={this.state.isPersonalEventOpen} toggle={this.handlePeronalModalToggle} size="lg">
                        <ModalHeader toggle={this.handlePeronalModalToggle}>

                        </ModalHeader>
                        <ModalBody>
                            <div className="card-body">
                                <form className="theme-form needs-validation" noValidate="">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="col-form-label pt-0" htmlFor="fromDate">{"From Date"}</label>
                                            <input className="form-control" id="fromDate" onChange={e => this.handleChange({ fromDate: e.target.value })} type="datetime-local" aria-describedby="fromDate" placeholder="Enter From Date" />
                                            <span>{this.state.isSubmited && !this.state.fromDate && 'From Date is required'}</span>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="col-form-label pt-0" htmlFor="toDate">{"To Date"}</label>
                                            <input className="form-control" id="toDate" type="datetime-local" aria-describedby="toDate" onChange={e => this.handleChange({ toDate: e.target.value })} placeholder="Enter To Date" />
                                            <span>{this.state.isSubmited && !this.state.toDate && 'To Date is required'}</span>
                                            <span>{this.state.isSubmited && this.state.toDate && !this.state.fromDate && 'From Date select first'}</span>
                                            <span>{this.state.isSubmited && this.state.toDate < this.state.fromDate && 'From Date less than To Date'}</span>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="col-form-label pt-0" htmlFor="subject">{"Subject"}</label>
                                            <input className="form-control" id="subject" type="text" aria-describedby="subject" onChange={e => this.handleChange({ subject: e.target.value })} placeholder="Subject" />
                                            <span>{this.state.isSubmited && !this.state.subject && 'Subject is required'}</span>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group col-md-12 mb-12">
                                            <label className="col-form-label pt-0" htmlFor="description">{"Description"}</label>
                                            <textarea className="form-control" rows="5" cols="12" id="description" onChange={e => this.handleChange({ description: e.target.value })}></textarea>
                                            <span>{this.state.isSubmited && !this.state.description && 'Description is required'}</span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" disabled={this.state.isSubmited && this.state.isValidSubmit} onClick={(e) => this.submitEvent(e)}>Add</Button>
                            <Button color="secondary" disabled={this.state.isSubmited && this.state.isValidSubmit} onClick={this.handlePeronalModalToggle}>Close</Button>
                        </ModalFooter>
                    </Modal>
                }
            </div>
        );
    }
}

export default Calender;