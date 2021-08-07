import React, { Fragment } from 'react';
import Breadcrumb from '../../common/breadcrumb';
import { handleResponse } from "../../../services/service.backend";
import { Typeahead } from 'react-bootstrap-typeahead';
import { toast } from 'react-toastify';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { NoMailFound } from '../../../constant';
import CKEditors from "react-ckeditor-component";
import createLink from '../../../helpers/createLink';
import { Link } from 'react-router-dom';
var images = require.context('../../../assets/images', true);


class Email extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messageInbox: [],
            messageOutbox: [],
            boxType: 'Inbox',
            isEmailSendOpen: false,
            isRequestEmailSendOpen: false,
            isEmailOpen: false,
            selectedOpenEmail: null,
            subject: null,
            message: null,
            template: null,
            isSubmited: false,
            isValidSubmit: false,
            isGroup: false,
            searchUser: null,
            toUsers: [],
            toGroups: [],
            userContact: [],
            templates: []
        };
    }

    componentDidMount = async () => {
        await this.getInbox();
        await this.getOutbox();
        await this.getToUsers();
        await this.getTemplate();
    }

    getTemplate = async () => {
        const templatesList = [];
        return fetch(`communication/getCommunicationTemplate`)
            .then(handleResponse)
            .then(response => {
                response.templates.map(i =>
                    templatesList.push({ id: i.id, name: i.name, content: i.content, isSenderTemplate: i.isSenderTemplate, isActive: i.isActive })
                )
                this.setState({
                    templates: templatesList,
                });
            });
    }

    getInbox = async () => {
        const messagesList = [];
        return fetch(`communication/getCommunicationInbox`)
            .then(handleResponse)
            .then(response => {
                response.messages.map(i =>
                    messagesList.push({ id: i.id, date: new Date(i.date).toDateString(), subject: i.subject, message: i.message, toUser: i.toUser, fromUser: i.fromUser, type: i.type, templateId: i.templateId, templateName: i.templateName, templateContent: i.templateContent })
                )
                this.setState({
                    messageInbox: messagesList,
                });
            });
    }

    getOutbox = async () => {
        const messagesList = [];
        return fetch(`communication/getCommunicationOutbox`)
            .then(handleResponse)
            .then(response => {
                response.messages.map(i =>
                    messagesList.push({ id: i.id, date: new Date(i.date).toDateString(), subject: i.subject, message: i.message, toUser: i.toUser, fromUser: i.fromUser, type: i.type })
                )
                this.setState({
                    messageOutbox: messagesList,
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

    getCommunicationBox = (data, i) => {
        return (
            <div>
                <div className="media" key={1} >
                    <Link className="media-body" to={createLink('/Communication/emailDetail/:id/:type', { id: data.id, type: this.state.boxType == "Inbox" ? 1 : 2 })}>
                        <h6>{data.fromUser}  <small className="f-right"><span className="digits">({data.date})</span></small></h6>
                        <p>{data.subject},</p>
                    </Link>
                </div>

            </div>
        )
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

    handleTemplateChange(e) {
        this.stateRequestFormText.value = "";
        var template = e["e"][0];
        if (template) {
            this.setState({
                template: template
            });

            if (template.isSenderTemplate) {
                this.stateRequestFormText.value = template.content
            }
        }
        else {
            this.setState({
                template: null
            });
        }

        this.setState({
            isSubmited: false
        });
    }

    submitEmail = async () => {
        this.setState({
            isSubmited: true
        });

        if (this.validate()) {
            await fetch("communication/composeCommunication", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json"
                },
                "body": JSON.stringify({
                    subject: this.state.subject,
                    messageText: this.stateText.value,
                    toUsers: this.state.toUsers,
                    toGroups: this.state.toGroups,
                    isGroup: this.state.isGroup,
                    communicationType: 1,
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

                    await this.getInbox();
                    await this.getOutbox();


                })
                .catch(err => {
                    toast.error(err)
                });
        }
    }

    submitRequestFormEmail = async () => {
        this.setState({
            isSubmited: true
        });

        if (this.validateRequestForm()) {
            await fetch("communication/composeCommunication", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json"
                },
                "body": JSON.stringify({
                    subject: this.state.subject,
                    messageText: this.stateRequestFormText.value,
                    toUsers: this.state.toUsers,
                    toGroups: this.state.toGroups,
                    isGroup: this.state.isGroup,
                    templateId: this.state.template.id,
                    communicationType: 5,
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
                        isRequestEmailSendOpen: false,
                        subject: null,
                        message: null,
                        template: null,
                        isGroup: false,
                        toUsers: [],
                        toGroups: []
                    });

                    this.stateRequestFormText.value = "";
                    toast.success(response.Value.SuccessMessage)

                    await this.getInbox();
                    await this.getOutbox();


                })
                .catch(err => {
                    toast.error(err)
                });
        }
    }

    validate = () => {
        if (this.state.subject === null || this.state.subject === "") {
            return false;
        }

        if (this.stateText.value === null || this.stateText.value === "") {
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

    validateRequestForm = () => {
        if (this.state.subject === null || this.state.subject === "") {
            return false;
        }

        if (this.stateRequestFormText.value === null || this.stateRequestFormText.value === "") {
            return false;
        }

        if (this.state.toUsers.length === 0 && this.state.toGroups.length === 0) {
            return false;
        }

        if (this.state.template === null || this.state.template === "") {
            return false;
        }

        this.setState({
            isValidSubmit: true
        });

        return true;
    }

    handleBox = (box) => {
        this.setState({
            boxType: box
        });
    }

    openModalToggle = () => {
        this.setState({
            isEmailSendOpen: true
        });
    }

    openRequestFormModalToggle = () => {
        this.setState({
            isRequestEmailSendOpen: true
        });
    }

    openEmailModalToggle = (data) => {
        this.setState({
            isEmailOpen: true,
            selectedOpenEmail: data
        });
    }

    handleEmailSendModalToggle = () => {
        this.setState({
            isEmailSendOpen: false,
            isSubmited: false
        });
    }

    handleRequestFormEmailSendModalToggle = () => {
        this.setState({
            isRequestEmailSendOpen: false,
            isSubmited: false
        });
    }

    handleEmailModalToggle = () => {
        this.setState({
            isEmailOpen: false
        });
    }

    handleChange(changeObject) {
        this.setState(changeObject);
        this.setState({
            isSubmited: false
        });
    }

    handleEditorChange() {
        var l = this.stateText.value;

        this.setState({
            isSubmited: false
        });
    }

    stateText = {
        value: ""
    }

    stateRequestFormText = {
        value: ""
    }
    getHtmlContent() {
        return (
            <div dangerouslySetInnerHTML={{ __html: this.state.selectedOpenEmail.message }} />
        );
    }


    render() {

        const inboxList = [];
        const outboxList = [];

        const onChange = (evt) => {
            const newContent = evt.editor.getData();
            if (!(newContent == "" && this.stateText.value == "")) {
                this.stateText.value = newContent;
            }
        }

        const onRequestFormChange = (evt) => {
            const newContent = evt.editor.getData();
            if (!(newContent == "" && this.stateRequestFormText.value == "")) {
                this.stateRequestFormText.value = newContent;
            }
        }

        this.state.messageInbox.map((data, i) => {
            inboxList.push(
                this.getCommunicationBox(data, i)
            )
        })

        this.state.messageOutbox.map((data, i) => {
            outboxList.push(
                this.getCommunicationBox(data, i)
            )
        })
        return (
            <Fragment>
                <Breadcrumb title="Email" parent="Email" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{"Email"}</h5>
                                </div>
                                <div className="card-body">
                                    <div className="card-header">
                                        <Button color="primary mr-2" onClick={this.openModalToggle}>Send Email</Button>
                                        <Button color="primary" onClick={this.openRequestFormModalToggle}>Send Request Form</Button>
                                    </div>
                                    <div className="email-wrap">
                                        <div className="row">
                                            <div className="col-xl-3 col-md-6">
                                                <div className="email-left-aside">
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <div className="email-app-sidebar">
                                                                <ul className="nav main-menu" role="tablist">
                                                                    <li className="nav-item" >
                                                                        <a className={`btn ${this.state.boxType === "Inbox" ? 'btn-primary' : 'btn-light'} font-white`} color="primary" id="pills-darkprofile-tab" data-toggle="pill" href="#pills-darkprofile" onClick={() => this.handleBox('Inbox')}
                                                                            role="tab" aria-controls="pills-darkprofile" aria-selected="false">
                                                                            <span className="title">
                                                                                <i className="icon-import"></i>
                                                                                {'Inbox'}
                                                                            </span>
                                                                            <span className="badge pull-right digits">
                                                                                ({this.state.messageInbox.length})
                                                                            </span>
                                                                        </a>
                                                                    </li>
                                                                    <li className="nav-item" >
                                                                        <a className={`btn ${this.state.boxType === "Outbox" ? 'btn-primary' : 'btn-light'} font-white`} color="primary" id="pills-darkprofile-tab" data-toggle="pill" href="#pills-darkprofile" onClick={() => this.handleBox('Outbox')}
                                                                            role="tab" aria-controls="pills-darkprofile" aria-selected="false">
                                                                            <span className="title">
                                                                                <i className="icon-import"></i>
                                                                                {'Outbox'}
                                                                            </span>
                                                                            <span className="badge pull-right digits">
                                                                                ({this.state.messageOutbox.length})
                                                                            </span>
                                                                        </a>
                                                                    </li>

                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xl-9 col-md-9">
                                                <div className="email-right-aside">
                                                    <div className="card email-body">
                                                        <div className="pr-0 b-r-light">
                                                            <div className="email-top">
                                                                <div className="row">
                                                                    <div className="col">
                                                                        <h5>{this.state.boxType}</h5>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="inbox custom-scrollbar">

                                                                {
                                                                    this.state.boxType === "Inbox" && (
                                                                        inboxList.length > 0 ? inboxList :
                                                                            <div className="search-not-found text-center ng-star-inserted" >
                                                                                <div className="">
                                                                                    <img alt="" className="second-search" src={images(`./search-not-found.png`)} />
                                                                                    <p className="mb-0">{NoMailFound}</p>
                                                                                </div>
                                                                            </div>
                                                                    )
                                                                }

                                                                {
                                                                    this.state.boxType === "Outbox" && (
                                                                        outboxList.length > 0 ? outboxList :
                                                                            <div className="search-not-found text-center ng-star-inserted" >
                                                                                <div className="">
                                                                                    <img alt="" className="second-search" src={images(`./search-not-found.png`)} />
                                                                                    <p className="mb-0">{NoMailFound}</p>
                                                                                </div>
                                                                            </div>
                                                                    )

                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
                                                <button className="btn btn-primary mr-1" disabled={this.state.isSubmited && this.state.isValidSubmit} type="button" onClick={() => this.submitEmail()}>{'Submit'}</button>
                                            </ModalFooter>
                                        </Modal>
                                    }

                                    {
                                        <Modal isOpen={this.state.isRequestEmailSendOpen} toggle={this.handleRequestFormEmailSendModalToggle} size="lg">
                                            <ModalHeader toggle={this.handleRequestFormEmailSendModalToggle}>

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
                                                                <div className="form-group col-12">
                                                                    <label className="col-form-label pt-0" htmlFor="subject">{"Subject"}</label>
                                                                    <input className="form-control" id="subject" type="text" aria-describedby="subject" onChange={e => this.handleChange({ subject: e.target.value })} placeholder="Subject" />
                                                                    <span>{this.state.isSubmited && !this.state.subject && 'Subject is required'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col-12">
                                                                    <label className="col-form-label pt-0" htmlFor="template-typeahead">{"Request Form"}</label>
                                                                    <Typeahead
                                                                        id="template-typeahead"
                                                                        labelKey="name"
                                                                        options={this.state.templates}
                                                                        placeholder="Choose a users..."
                                                                        onChange={e => this.handleTemplateChange({ e })}
                                                                    />
                                                                    <span style={{ color: "#ff5370" }}>{this.state.isSubmited && this.state.template == null && 'Request Form is required'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col-12">
                                                                    <label className="col-form-label pt-0" htmlFor="message">{"Message"}</label>
                                                                    <CKEditors id="message"
                                                                        content={this.stateRequestFormText.value}
                                                                        events={{
                                                                            "change": onRequestFormChange
                                                                        }}
                                                                    />

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </ModalBody>
                                            <ModalFooter>
                                                <button className="btn btn-primary mr-1" disabled={this.state.isSubmited && this.state.isValidSubmit} type="button" onClick={() => this.submitRequestFormEmail()}>{'Submit'}</button>
                                            </ModalFooter>
                                        </Modal>
                                    }


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
};

export default Email;