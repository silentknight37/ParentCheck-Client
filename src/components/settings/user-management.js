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
            roleId: 0,
            studentUserid: 0,
            username: null,
            dateOfBirth: null,
            isActive: true,
            isSubmited: false,
            isValidSubmit: false,
            instituteUsers: [],
            isTemplateEditorOpen: false,
            students: [],
            roles: [],
            isEdit:false
        };
    }

    componentDidMount = async () => {
        await this.getInstituteUsers();
        await this.getRole(7);
        await this.getStudent(11);
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

    getRole = async (id) => {
        const roleList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`reference/getReference?id=${id}`, requestOptions)
            .then(handleResponse)
            .then(response => {

                response.references.map(i =>
                    roleList.push({ id: i.id, value: i.value })
                )
                this.setState({
                    roles: roleList,
                });
            });
    }

    getStudent = async (id) => {
        const studentList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`reference/getReference?id=${id}`, requestOptions)
            .then(handleResponse)
            .then(response => {

                response.references.map(i =>
                    studentList.push({ id: i.id, value: i.value })
                )
                this.setState({
                    students: studentList,
                });
            });
    }

    selectedTemplate = (data) => {
        this.setState({
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            roleId: data.role,
            studentUserid: data.studentUserid,
            isActive: data.isActive,
            isEdit:true
        });

        this.openModalToggle();
    }
    submitInstituteUser = async (e) => {
        e.preventDefault();
        this.setState({
            isSubmited: true
        });

        if (this.validate()) {
            const currentUser = localStorage.getItem('token');
            await fetch("setting/saveUsers", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json",
                    "Authorization": `Bearer ${currentUser}`
                },
                "body": JSON.stringify({
                    Id: this.state.id,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    roleId: +this.state.roleId,
                    studentUserid: +this.state.studentUserid,
                    username: this.state.username,
                    dateOfBirth: this.state.dateOfBirth,
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
                        isSmsSendOpen: false,
                        id: 0,
                        firstName: null,
                        lastName: null,
                        roleId: null,
                        studentUserid: null,
                        username: null,
                        dateOfBirth: null,
                        isActive: true,
                        isEdit:false
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
            id: 0,
            firstName: null,
            lastName: null,
            roleId: null,
            studentUserid: null,
            username: null,
            dateOfBirth: null,
            isActive: true,
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
        if (this.state.firstName === null || this.state.firstName === "") {
            return false;
        }

        if (this.state.lastName === null || this.state.lastName === "") {
            return false;
        }

        if (this.state.roleId === null || this.state.roleId === 0) {
            return false;
        }

        if (this.state.username === null || this.state.username === "") {
            return false;
        }

        if (this.state.dateOfBirth === null || this.state.dateOfBirth === "") {
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

        const studentsList = [];
        this.state.students.forEach(refVal => {
            studentsList.push(
                this.handleSelectOptions(
                    refVal
                )
            );
        });

        const rolesList = [];
        this.state.roles.forEach(refVal => {
            rolesList.push(
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
                                                                    <input className="form-control" id="firstName" type="text" aria-describedby="firstName" disabled={this.state.isEdit} value={this.state.firstName} onChange={e => this.handleChange({ firstName: e.target.value })} placeholder="First Name" />
                                                                    <span>{this.state.isSubmited && !this.state.firstName && 'First Name is required'}</span>
                                                                </div>
                                                                <div className="form-group col-6">
                                                                    <label className="col-form-label pt-0" htmlFor="lastName">{"Last Name"}</label>
                                                                    <input className="form-control" id="lastName" type="text" aria-describedby="lastName" disabled={this.state.isEdit} value={this.state.lastName} onChange={e => this.handleChange({ lastName: e.target.value })} placeholder="Last Name" />
                                                                    <span>{this.state.isSubmited && !this.state.lastName && 'Last Name is required'}</span>
                                                                </div>
                                                            </div>
                                                            {!this.state.isEdit && (
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
                                                            )}
                                                            <div className="form-row">
                                                                <div className="form-group col-6">
                                                                    <label htmlFor="roleId">{'Role'}</label>
                                                                    <select className="form-control digits" onChange={e => this.handleChange({ roleId: e.target.value })} defaultValue={this.state.roleId}>
                                                                        <option value={0}>All</option>
                                                                        {rolesList}
                                                                    </select>
                                                                    <span style={{ color: "#ff5370" }}>{this.state.isSubmited && (!this.state.roleId || this.state.roleId==0) && 'Role is required'}</span>
                                                                </div>
                                                                {this.state.roleId == 3 && (
                                                                    <div className="form-group col-6">
                                                                        <label htmlFor="studentUserid">{'Associate Student'}</label>
                                                                        <select onChange={e => this.handleChange({ studentUserid: e.target.value })} className="form-control digits" defaultValue={this.state.studentUserid}>
                                                                            <option value={0}>All</option>
                                                                            {studentsList}
                                                                        </select>
                                                                    </div>
                                                                )}
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