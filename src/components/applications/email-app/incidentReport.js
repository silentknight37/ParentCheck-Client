import React, { Fragment } from 'react';
import Breadcrumb from '../../common/breadcrumb';
import { handleResponse, authHeader } from "../../../services/service.backend";
import { Typeahead } from 'react-bootstrap-typeahead';
import { toast } from 'react-toastify';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import DataTable from 'react-data-table-component'
import CKEditors from "react-ckeditor-component";
import { Card, CardBody } from 'reactstrap'
import { Link } from 'react-router-dom';


class IncidentReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            incidentReports: [],
            isEmailSendOpen: false,
            isRequestEmailSendOpen: false,
            isEmailOpen: false,
            subject: null,
            message: null,
            instituteUserId: null,
            recordDate: null,
            isSubmited: false,
            isValidSubmit: false,
            isGroup: false,
            searchUser: null,
            toUsers: [],
            userContact: [],
        };
    }

    componentDidMount = async () => {
        await this.getIncidentReports();
        await this.getToUsers();
    }

    getIncidentReports = async () => {
        const incidentReportList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`classRoom/getIncidentReports`, requestOptions)
            .then(handleResponse)
            .then(response => {
                response.incidentReports.map(i =>
                    incidentReportList.push({ id: i.id, date: new Date(i.recordDate).toDateString(), subject: i.subject, message: <div dangerouslySetInnerHTML={{ __html: i.message }} />, incidentUserName: i.incidentUserName, responsibleUserName: i.responsibleUserName, type: 1 })
                )
                this.setState({
                    incidentReports: incidentReportList,
                });
            });
    }
    getToUsers = async () => {
        const userContactList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`reference/getAllUserContacts?sendType=${1}`, requestOptions)
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


    handleToChange(e) {
        if (e["e"].length > 0) {
            this.setState({
                instituteUserId: e["e"][0].id
            });

            this.setState({
                isSubmited: false
            });
        }
    }

    submitEmail = async () => {
        this.setState({
            isSubmited: true
        });
        if (this.validate()) {
            const currentUser = localStorage.getItem('token');
            await fetch("classRoom/saveIncidentReport", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json",
                    "Authorization": `Bearer ${currentUser}`
                },
                "body": JSON.stringify({
                    subject: this.state.subject,
                    message: this.stateText.value,
                    instituteUserId: this.state.instituteUserId
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
                        instituteUserId: null,
                        recordDate: null,
                    });

                    this.stateText.value = "";
                    toast.success(response.Value.SuccessMessage)

                    await this.getIncidentReports();
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

        if (this.state.instituteUserId === null && this.state.instituteUserId === "") {
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

    render() {
        const roleId = localStorage.getItem('roleId');
        const onChange = (evt) => {
            const newContent = evt.editor.getData();
            if (!(newContent == "" && this.stateText.value == "")) {
                this.stateText.value = newContent;
            }
        }

        const openDataColumns = [
            {
                name: 'Date',
                selector: 'date',
                sortable: true
            },
            {
                name: 'Report From',
                selector: 'responsibleUserName',
                sortable: true,
                wrap: true
            },
            {
                name: 'Report To',
                selector: 'incidentUserName',
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
                <Breadcrumb title="Incident Report" parent="Incident Report" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{"Incident Report"}</h5>
                                </div>
                                <div className="card-body">
                                    {(roleId == 2 || roleId == 4 || roleId == 5) && (
                                        <div className="card-header">
                                            <Button color="primary mr-2" onClick={this.openModalToggle}>Send Report</Button>
                                        </div>
                                    )}
                                    <DataTable
                                        columns={openDataColumns}
                                        data={this.state.incidentReports}
                                        striped={true}
                                        pagination
                                        responsive={true}
                                    />
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
                                                                    <Typeahead
                                                                        id="user-typeahead"
                                                                        labelKey="fullName"
                                                                        options={this.state.userContact}
                                                                        placeholder="Choose a users..."
                                                                        onChange={e => this.handleToChange({ e })}
                                                                    />
                                                                    <span style={{ color: "#ff5370" }}>{this.state.isSubmited && !this.state.instituteUserId && 'Sending participant is required'}</span>
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
};

export default IncidentReport;