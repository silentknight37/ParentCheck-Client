import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import DataTable from 'react-data-table-component'
import { Card, CardBody } from 'reactstrap'
import { handleResponse, authHeader } from "../../services/service.backend";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import CKEditors from "react-ckeditor-component";
import { Link } from 'react-router-dom';
class UserManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            firstName: null,
            lastName: null,
            roleId: null,
            studentUserId: null,
            parentUserid: null,
            classTeacherUserId: null,
            headTeacherUserId: null,
            communicationGroup: null,
            username: null,
            dateOfBirth: null,
            isActive: true,
            isSubmited: false,
            isValidSubmit: false,
            instituteUsers: [],
            isTemplateEditorOpen: false,
            communicationGroup: []
        };
    }

    componentDidMount = async () => {
        await this.getInstituteUsers();
        await this.getCommunicationGroup(3);
    }

    getInstituteUsers = async () => {
        const instituteUserList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`setting/getUsers`, requestOptions)
            .then(handleResponse)
            .then(response => {
                response.instituteUsers.map(i =>
                    instituteUserList.push({ id: i.id, firstName: i.firstName, lastName: i.lastName, role: i.role, dateOfBirth: new Date(i.dateOfBirth).toDateString(), userName: i.userName, isActive: i.isActive ? "True" : "False", action: <Link className="btn btn-light" onClick={() => this.selectedTemplate(i)}><i className="icofont icofont-ui-edit"></i></Link> })
                )
                this.setState({
                    instituteUsers: instituteUserList,
                });
            });
    }

    getCommunicationGroup = async (id) => {
        const communicationGroupList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`reference/getReference?id=${id}`,requestOptions)
            .then(handleResponse)
            .then(response => {

                response.references.map(i =>
                    communicationGroupList.push({ id: i.id, value: i.value })
                )
                this.setState({
                    communicationGroup: communicationGroupList,
                });
            });
    }

    selectedTemplate = (data) => {
        this.setState({
            id: data.id,
            name: data.name,
            isSenderTemplate: data.isSenderTemplate,
            isActive: data.isActive
        });

        this.stateText.value = data.content;
        this.openModalToggle();
    }
    submitInstituteUser = async (e) => {
        e.preventDefault();
        this.setState({
            isSubmited: true
        });

        if (this.validate()) {
            const currentUser = localStorage.getItem('token');
            await fetch("communication/saveCommunicationTemplate", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json",
                    "Authorization": `Bearer ${currentUser}`
                },
                "body": JSON.stringify({
                    Id: this.state.id,
                    name: this.state.name,
                    content: this.stateText.value,
                    isSenderTemplate: this.state.isSenderTemplate,
                    isActive: this.state.isActive
                })
            })
                .then(response => response.json())
                .then(async (response) => {

                    if (!response.Value.Created) {
                        toast.error(response.Value.Error.Message)
                        return;
                    }

                    toast.success(response.Value.SuccessMessage)

                    await this.getInstituteUsers();

                    this.setState({
                        isSubmited: false,
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


    validate = () => {
        if (this.state.subject === null || this.state.subject === "") {
            return false;
        }

        if (this.stateText.value === null || this.stateText.value === "") {
            return false;
        }

        this.setState({
            isValidSubmit: true
        });

        return true;
    }

    handleSelectOptions = (refVal) => {
        return (
            <option value={refVal.id}>{refVal.value}</option>
        );
    }

    render() {

        const communicationGroupList = [];
        this.state.communicationGroup.forEach(refVal => {
            communicationGroupList.push(
                this.handleSelectOptions(
                    refVal
                )
            );
        });
        const openDataColumns = [
            {
                name: 'First Name',
                selector: 'firstName',
                sortable: true
            },
            {
                name: 'Last Name',
                selector: 'lastName',
                sortable: true
            },
            {
                name: 'Role',
                selector: 'role',
                sortable: true
            },
            {
                name: 'Date Of Birth',
                selector: 'dateOfBirth',
                sortable: true
            },
            {
                name: 'User Name',
                selector: 'userName',
                sortable: true
            },
            {
                name: 'Active',
                selector: 'isActive',
                sortable: true,
                wrap: true
            },
            {
                name: 'Action',
                selector: 'action'
            }
        ];

        return (
            <Fragment>
                <Breadcrumb title="User Management" parent="User Management" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{"User Management"}</h5>
                                </div>
                                <div className="card-body">
                                    <div className="card-header">
                                        <Button color="primary" onClick={this.openModalToggle}>Add User</Button>
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
                                                                <div className="form-group col-6">
                                                                    <label className="col-form-label pt-0" htmlFor="firstName">{"First Name"}</label>
                                                                    <input className="form-control" id="firstName" type="text" aria-describedby="firstName" value={this.state.firstName} onChange={e => this.handleChange({ firstName: e.target.value })} placeholder="First Name" />
                                                                    <span>{this.state.isSubmited && !this.state.firstName && 'First Name is required'}</span>
                                                                </div>
                                                                <div className="form-group col-6">
                                                                    <label className="col-form-label pt-0" htmlFor="lastName">{"Last Name"}</label>
                                                                    <input className="form-control" id="lastName" type="text" aria-describedby="lastName" value={this.state.lastName} onChange={e => this.handleChange({ lastName: e.target.value })} placeholder="Last Name" />
                                                                    <span>{this.state.isSubmited && !this.state.lastName && 'Last Name is required'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col-6">
                                                                    <label className="col-form-label pt-0" htmlFor="dateOfBirth">{"Date Of Birth"}</label>
                                                                    <input className="form-control" data-date-format="YYYY MMMM DD" id="dateOfBirth" onChange={e => this.handleChange({ dateOfBirth: e.target.value })} type="date" aria-describedby="dateOfBirth" placeholder="Date Of Birth" />
                                                                    <span>{this.state.isSubmited && !this.state.dateOfBirth && 'Date of birth is required'}</span>
                                                                </div>
                                                                <div className="form-group col-6">
                                                                    <label className="col-form-label pt-0" htmlFor="username">{"User Name"}</label>
                                                                    <input className="form-control" id="username" type="email" aria-describedby="username" value={this.state.username} onChange={e => this.handleChange({ username: e.target.value })} placeholder="User Name" />
                                                                    <span>{this.state.isSubmited && !this.state.username && 'User Name is required'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col-6">
                                                                    <label htmlFor="communicationGroup">{'Communication Group'}</label>
                                                                    <select onChange={e => this.handleChange({ communicationGroup: e.target.value })} className="form-control digits" defaultValue="0">
                                                                        <option value={0}>All</option>
                                                                        {communicationGroupList}
                                                                    </select>
                                                                </div>
                                                                <div className="form-group col-6">
                                                                    <label htmlFor="exampleFormControlSelect9">{'Terms'}</label>
                                                                    <select className="form-control digits" defaultValue="0">
                                                                        <option value={0}>All</option>
                                                                        {communicationGroupList}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col-12">
                                                                    <label className="d-block" htmlFor="isActive">
                                                                        <input checked={this.state.isActive} className="checkbox_animated" id="isActive" type="checkbox" onChange={e => this.handleChange({ isActive: !this.state.isActive })} />
                                                                        {Option} {"Active"}
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </ModalBody>
                                            <ModalFooter>
                                                <button className="btn btn-primary mr-1" disabled={this.state.isSubmited && this.state.isValidSubmit} type="button" onClick={(e) => this.submitInstituteUser(e)}>{'Submit'}</button>
                                            </ModalFooter>
                                        </Modal>
                                    }
                                    <DataTable
                                        columns={openDataColumns}
                                        data={this.state.instituteUsers}
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

export default UserManagement;