import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import DataTable from 'react-data-table-component'
import { Card, CardBody } from 'reactstrap'
import { handleResponse, authHeader } from "../../services/service.backend";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import CKEditors from "react-ckeditor-component";
import { Link } from 'react-router-dom';
import { Typeahead } from 'react-bootstrap-typeahead';
import SweetAlert from 'sweetalert2'
class GenerateEvent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,            
            yearAcademic: null,
            fromDate: null,
            toDate: null,
            isActive: true,
            isSubmited: false,
            isValidSubmit: false,
            iconWithTab: '1',
            isTemplateEditorOpen: false,
            isEdit: false,
            isEmailSendOpen: false,
            isGroup: false,
            searchUser: null,
            toUsers: [],
            toGroups: [],
            userContact: [],
            isEventOpen: false,
            selectedEvent: null,
            isPersonalEventOpen: false,
            subject: null,
            description: null,
            type: null,
            calenderEvents:[],
            eventDate: new Date().toDateString(),
        };
    }

    componentDidMount = async () => {
        await this.getEvents();
        await this.getToUsers();
    }

    getEvents = async () => {
        const calanderEventsList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`calender/getAllEvent`, requestOptions)
            .then(handleResponse)
            .then(response => {
                response.calenderEvents.map(i =>
                    calanderEventsList.push({ id: i.id, start: new Date(i.fromDate).toDateString(), end: new Date(i.toDate).toDateString(), title: i.subject,  eventDetails: this.getHtmlContent(i.description),action:<Link className="btn btn-light" onClick={() => this.removeCalander(i)}><i style={{ color: "#ff5370" }} className="icofont icofont-ui-close"></i></Link>  })
                )
                this.setState({
                    calenderEvents: calanderEventsList
                });
            });
    }
    removeCalander = async (data) => {
        SweetAlert.fire({
            title: "Are you sure you want remove event?",
            cancelButtonText: "No",
            confirmButtonText: "Yes",
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                this.removeCalanderEvent(data);
            }
        });
    }
    removeCalanderEvent = async (data) => {
        const currentUser = localStorage.getItem('token');
        await fetch("calender/eventRemove", {
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "accept": "application/json",
                "Authorization": `Bearer ${currentUser}`
            },
            "body": JSON.stringify({
                id: data.id
            })
        })
            .then(response => response.json())
            .then(response => {


                if (!response.Value.Created) {
                    toast.error(response.Value.Error.Message)
                    return;
                }

                toast.success(response.Value.SuccessMessage)
                this.getEvents(this.state.eventDate);
                this.setState({
                    isEmailSendOpen: false,
                    isEventOpen: false
                });
            })
            .catch(err => {
                toast.error(err)
            });
    }
    getToUsers = async () => {
        const userContactList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`reference/getAllUserContacts?sendType=${1}`,requestOptions)
            .then(handleResponse)
            .then(response => {
                response.userContacts.map(i =>
                    userContactList.push({ id: i.id, toValue: i.fullName, email: i.email, mobile: i.mobile })
                )
                this.setState({
                    userContact: userContactList,
                });
            });
    }

    getToGroups = async () => {
        const groupList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`reference/getReference?id=${3}`,requestOptions)
            .then(handleResponse)
            .then(response => {

                response.references.map(i =>
                    groupList.push({ id: i.id, toValue: i.value , email:"", mobile: ""})
                )
                this.setState({
                    userContact: groupList,
                });
            });
    }
    stateText = {
        value: ""
    }
    submit = async () => {
        this.setState({
            isSubmited: true
        });
        if (this.validate()) {
            const currentUser = localStorage.getItem('token');
            await fetch("communication/composeCommunication", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json",
                    "Authorization": `Bearer ${currentUser}`
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

                    toast.success(response.Value.SuccessMessage)

                    await this.getEvents();

                    this.setState({
                        isSubmited: false,
                        isEmailSendOpen: false,
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
            isEmailSendOpen: true
        });
    }

    handleModalToggle = () => {
        this.setState({
            isSmsSendOpen: false,
            isSubmited: false,
            isEdit:false
        });
    }

    handleChange(changeObject) {
        this.setState(changeObject);
        this.setState({
            isSubmited: false
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

        this.setState({
            isValidSubmit: true
        });

        return true;
    }

    handleEmailSendModalToggle = () => {
        this.setState({
            isEmailSendOpen: false,
            isSubmited: false
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
    getHtmlContent(details) {
        return (
            <div dangerouslySetInnerHTML={{ __html: details }} />
        );
    }
    render() {
        const onChange = (evt) => {
            const newContent = evt.editor.getData();
            if (!(newContent == "" && this.stateText.value == "")) {
                this.stateText.value = newContent;
            }
        }
        const openDataColumns = [
            {
                name: 'Subject',
                selector: 'title',
                sortable: true
            },
            {
                name: 'From Date',
                selector: 'start',
                sortable: true,
                wrap: true
            },
            {
                name: 'To Date',
                selector: 'end',
                sortable: true,
                wrap: true
            },
            {
                name: 'Details',
                selector: 'eventDetails',
                sortable: true,
                wrap: true
            },
            {
                name: 'Action',
                selector: 'action',
                center:true
            }
        ];
        return (
            <Fragment>
                <Breadcrumb title="Add Events" parent="Add Events" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{"Add Events"}</h5>
                                </div>
                                <div className="card-body">
                                    <div className="card-header">
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
                                                                        {Option} {"To Group"}
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col-12">
                                                                        <Typeahead
                                                                            id="user-typeahead"
                                                                            labelKey="toValue"
                                                                            multiple
                                                                            options={this.state.userContact}
                                                                            placeholder="Choose a users..."
                                                                            onChange={e => this.handleToChange({ e })}
                                                                        />
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
                                                <button className="btn btn-primary mr-1" disabled={this.state.isSubmited && this.state.isValidSubmit} type="button" onClick={() => this.submit()}>{'Submit'}</button>
                                            </ModalFooter>
                                        </Modal>
                                    }
                                    <DataTable
                                        columns={openDataColumns}
                                        data={this.state.calenderEvents}
                                        striped={true}
                                        pagination
                                        responsive={true}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
};

export default GenerateEvent;