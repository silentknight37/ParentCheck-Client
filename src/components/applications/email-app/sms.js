import React, { Fragment } from 'react';
import Breadcrumb from '../../common/breadcrumb';
import DataTable from 'react-data-table-component'
import { Card, CardBody } from 'reactstrap'
import { handleResponse,authHeader } from "../../../services/service.backend";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import { Typeahead } from 'react-bootstrap-typeahead';
class SMS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subject: null,
            message: null,
            isSubmited: false,
            isValidSubmit: false,
            iconWithTab: '1',
            messagesTickets: [],
            isSmsSendOpen: false,
            isGroup: false,
            searchUser: null,
            toUsers: [],
            toGroups: [],
            userContact: [],
            isLoading:false
        };
    }

    componentDidMount = async () => {
        await this.getSMS();
        await this.getToUsers();
    }

    getSMS = async () => {
        const messagesList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`communication/getSmsCommunicationOutbox`,requestOptions)
            .then(handleResponse)
            .then(response => {
                response.messages.map(i =>
                    messagesList.push({ id: i.id, date: i.date, subject: i.subject, message: i.message, toUser: i.toUser })
                )
                this.setState({
                    messagesTickets: messagesList,
                });
            });
    }

    getToUsers = async () => {
        this.setState({
            isLoading: true,
        });
        const userContactList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`reference/getAllUserContacts?sendType=${2}`,requestOptions)
            .then(handleResponse)
            .then(response => {
                response.userContacts.map(i =>
                    userContactList.push({ id: i.id, toValue: `${i.fullName} (${i.mobile})`, email: i.email, mobile: i.mobile })
                )
                this.setState({
                    userContact: userContactList,
                    isLoading: false,
                });
            });
    }

    getToGroups = async () => {
        this.setState({
            isLoading: true,
        });
        const groupList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`reference/getReference?id=${3}`,requestOptions)
            .then(handleResponse)
            .then(response => {

                response.references.map(i =>
                    groupList.push({ id: i.id, toValue: i.value, email:"", mobile: ""})
                )
                this.setState({
                    userContact: groupList,
                    isLoading: false,
                });
            });
    }

    submitSMS = async (e) => {
        e.preventDefault();
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
                    messageText: this.state.message,
                    toUsers: this.state.toUsers,
                    toGroups: this.state.toGroups,
                    isGroup: this.state.isGroup,
                    communicationType: 2,
                })
            })
                .then(response => response.json())
                .then(async (response) => {

                    if (!response.Value.Created) {
                        toast.error(response.Value.Error.Message)
                        return;
                    }

                    toast.success(response.Value.SuccessMessage)

                    await this.getSMS();

                    this.setState({
                        isSubmited: false,
                        toUsers:[],
                        toGroups:[],
                        isSmsSendOpen: false
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
            isSubmited: false
        });
    }

    handleChange(changeObject) {
        this.setState(changeObject);
        this.setState({
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

    validate = () => {
        if (this.state.subject === null || this.state.subject === "") {
            return false;
        }

        if (this.state.message === null || this.state.message === "") {
            return false;
        }

        if (this.state.toUsers.length === 0 && this.state.toGroups.length === 0) {
            return false;
        }

        this.setState({
            isValidSubmit: true
        });

        return true;
    }

    render() {
        const openDataColumns = [
            {
                name: 'Date',
                selector: 'date',
                sortable: true
            },
            {
                name: 'To Users',
                selector: 'toUser',
                sortable: true,
                wrap: true
            },
            {
                name: 'Subject',
                selector: 'subject',
                sortable: true,
                wrap: true
            },
            {
                name: 'Message',
                selector: 'message',
                sortable: true,
                wrap: true
            }
        ];

        return (
            <Fragment>
                <Breadcrumb title="SMS" parent="SMS" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{"SMS"}</h5>
                                </div>
                                <div className="card-body">
                                    <div className="card-header">
                                        <Button color="primary" onClick={this.openModalToggle}>Send SMS</Button>
                                    </div>
                                    {
                                        <Modal isOpen={this.state.isSmsSendOpen} toggle={this.handleModalToggle} size="lg">
                                            <ModalHeader toggle={this.handleModalToggle}>

                                            </ModalHeader>
                                            <ModalBody>
                                                <div className="card-body">
                                                    <form className="theme-form needs-validation" noValidate="">
                                                        <div className="card-body">
                                                            <div className="form-row">
                                                                <div className="form-group col-12">

                                                                    <label htmlFor="edo-ani">
                                                                        <input className="radio_animated" id="edo-ani" type="radio" name="rdo-ani" defaultChecked onChange={e => this.handleRadioChange({ isGroup: false }, false)} />
                                                                        {Option} {"To Users"}
                                                                    </label>
                                                                    <br />
                                                                    <label htmlFor="edo-ani1">
                                                                        <input className="radio_animated" id="edo-ani1" type="radio" name="rdo-ani" onChange={e => this.handleRadioChange({ isGroup: true }, true)} />
                                                                        {Option} {"To Group"}
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col-12">
                                                                        <Typeahead
                                                                            id="multiple-typeahead"
                                                                            labelKey="toValue"
                                                                            multiple
                                                                            disabled={this.state.isLoading}
                                                                            options={this.state.userContact}
                                                                            placeholder="Choose a users..."
                                                                            onChange={e => this.handleToChange({ e })}
                                                                        />
                                                                    <span style={{ color: "#ff5370" }}>{this.state.isSubmited && (this.state.toUsers.length === 0 && this.state.toGroups.length === 0) && 'Sending participant is required'}</span>
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
                                                                    <textarea className="form-control" rows="5" cols="12" id="message" placeholder="Message" onChange={e => this.handleChange({ message: e.target.value })}></textarea>
                                                                    <span>{this.state.isSubmited && !this.state.message && 'Description is required'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </ModalBody>
                                            <ModalFooter>
                                                <button className="btn btn-primary mr-1" disabled={this.state.isSubmited && this.state.isValidSubmit} type="button" onClick={(e) => this.submitSMS(e)}>{'Submit'}</button>
                                            </ModalFooter>
                                        </Modal>
                                    }

                                </div>
                                <div className="card-body datatable-react">
                                    <Card>
                                        <CardBody>
                                            <DataTable
                                                columns={openDataColumns}
                                                data={this.state.messagesTickets}
                                                striped={true}
                                                pagination
                                                persistTableHead
                                                responsive={true}
                                            />
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
};

export default SMS;