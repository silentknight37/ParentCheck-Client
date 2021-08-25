import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import DataTable from 'react-data-table-component'
import { Card, CardBody } from 'reactstrap'
import { handleResponse, authHeader } from "../../services/service.backend";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import createLink from '../../helpers/createLink';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
class EditUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            parentId: 0,
            firstName: null,
            lastName: null,
            roleId: 0,
            role: null,
            studentUserid: 0,
            username: null,
            admission: null,
            mobile: null,
            dateOfBirth: null,
            parentFirstName: null,
            parentLastName: null,
            parentUsername: null,
            parentMobile: null,
            parentDateOfBirth: null,
            lastName: null,
            isActive: true,
            isSubmited: false,
            isValidSubmit: false,
            instituteUser: null,
            isTemplateEditorOpen: false,
            students: [],
            roles: [],
            isEdit: false
        };
    }

    componentDidMount = async () => {
        await this.getInstituteUsers(this.props.id);
        await this.getRole(17);
    }

    getInstituteUsers = async (id) => {
        const instituteUserList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`setting/getUserById?id=${id}`, requestOptions)
            .then(handleResponse)
            .then(response => {
                response.instituteUsers.map(i =>
                    instituteUserList.push({ id: i.id, firstName: i.firstName, lastName: i.lastName, role: i.role, roleId: i.roleId, dateOfBirth: new Date(i.dateOfBirth), parentDateOfBirth: new Date(i.parentDateOfBirth), parentId: i.parentId, parentFirstName: i.parentFirstName, parentLastName: i.parentLastName, parentUsername: i.parentUsername, parentMobile: i.parentMobile, admission: i.admission, username: i.userName, mobile: i.mobile, isActive: i.isActive })
                )

                if (instituteUserList.length == 1) {
                    this.setState({
                        id: instituteUserList[0].id,
                        firstName: instituteUserList[0].firstName,
                        lastName: instituteUserList[0].lastName,
                        dateOfBirth: instituteUserList[0].dateOfBirth,
                        admission: instituteUserList[0].admission,
                        username: instituteUserList[0].username,
                        mobile: instituteUserList[0].mobile,
                        roleId: instituteUserList[0].roleId,
                        role: instituteUserList[0].role,
                        parentId: instituteUserList[0].parentId,
                        parentFirstName: instituteUserList[0].parentFirstName,
                        parentLastName: instituteUserList[0].parentLastName,
                        parentDateOfBirth: instituteUserList[0].parentDateOfBirth,
                        parentUsername: instituteUserList[0].parentUsername,
                        parentMobile: instituteUserList[0].parentMobile,
                        isActive: instituteUserList[0].isActive,
                    });
                }

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

    submit = async (e) => {
        e.preventDefault();
        this.setState({
            isSubmited: true
        });
        debugger
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
                    id: this.state.id,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    roleId: +this.state.roleId,
                    username: this.state.username,
                    dateOfBirth: this.state.dateOfBirth,
                    admission: this.state.admission,
                    mobile: this.state.mobile,
                    parentId: this.state.parentId,
                    parentFirstName: this.state.parentFirstName,
                    parentLastName: this.state.parentLastName,
                    parentUsername: this.state.parentUsername,
                    parentMobile: this.state.parentMobile,
                    parentDateOfBirth: this.state.parentDateOfBirth,
                    isActive: this.state.isActive
                })
            })
                .then(response => response.json())
                .then(async (response) => {

                    if (!response.Value.Created) {
                        toast.error(response.Value.Error.Message);
                        this.setState({
                            isSubmited: false
                        });
                        return;
                    }

                    toast.success(response.Value.SuccessMessage);

                    this.setState({
                        isSubmited: false
                    });
                })
                .catch(err => {
                    toast.error(err)
                });
        }
    }

    resetPassword = async (id) => {
        this.setState({
            isSubmited: true
        });
        const currentUser = localStorage.getItem('token');
        await fetch("setting/resetPasswordUsers", {
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "accept": "application/json",
                "Authorization": `Bearer ${currentUser}`
            },
            "body": JSON.stringify({
                Id: id
            })
        })
            .then(response => response.json())
            .then(async (response) => {

                if (!response.Value.Created) {
                    toast.error(response.Value.Error.Message);
                    this.setState({
                        isSubmited: false
                    });
                    return;
                }

                toast.success(response.Value.SuccessMessage);

                this.setState({
                    isSubmited: false
                });
            })
            .catch(err => {
                toast.error(err)
            });
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
            admission: null,
            mobile: null,
            dateOfBirth: null,
            parentFirstName: null,
            parentLastName: null,
            parentUsername: null,
            parentMobile: null,
            isActive: true,
            isEdit: false
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

        if (this.state.mobile === null || this.state.mobile === "") {
            return false;
        }

        if (this.state.roleId == 1 && (this.state.parentFirstName === null || this.state.parentFirstName === "")) {
            return false;
        }

        if (this.state.roleId == 1 && (this.state.parentLastName === null || this.state.parentLastName === "")) {
            return false;
        }

        if (this.state.roleId == 1 && (this.state.parentUsername === null || this.state.parentUsername === "")) {
            return false;
        }

        if (this.state.roleId == 1 && (this.state.parentMobile === null || this.state.parentMobile === "")) {
            return false;
        }

        if (this.state.roleId == 1 && (this.state.parentDateOfBirth === null || this.state.parentDateOfBirth === "")) {
            return false;
        }

        this.setState({
            isValidSubmit: true
        });

        return true;
    }

    handleSelectOptions = (refVal, isSelected) => {
        return (
            <option value={refVal.id} selected={isSelected}>{refVal.value}</option>
        );
    }

    handleEmailPattern = (refVal) => {
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(refVal)) {
            return false;
        }
        return true;
    }

    render() {
        var disableRole = this.props.id > 0 && this.state.roleId === 1;
        const rolesList = [];
        this.state.roles.forEach(refVal => {
            rolesList.push(
                this.handleSelectOptions(
                    refVal, this.state.roleId === refVal.id
                )
            );
        });


        return (
            <Fragment>
                <Breadcrumb title="User" parent="User Management" parentLink={createLink('/user-management')} isParentShow={true} />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
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
                                                    <input className="form-control" defaultValue={this.state.dateOfBirth == null ? "" : new Date(this.state.dateOfBirth).toISOString().substr(0, 10)} data-date-format="YYYY MMMM DD" id="dateOfBirth" onChange={e => this.handleChange({ dateOfBirth: e.target.value })} type="date" aria-describedby="dateOfBirth" placeholder="Date Of Birth" />
                                                    <span>{this.state.isSubmited && !this.state.dateOfBirth && 'Date of birth is required'}</span>
                                                </div>
                                                <div className="form-group col-6">
                                                    <label className="col-form-label pt-0" htmlFor="admission">{"Index/Admission No"}</label>
                                                    <input className="form-control" id="admission" type="tel" aria-describedby="admission" value={this.state.admission} onChange={e => this.handleChange({ admission: e.target.value })} placeholder="Admission No" />
                                                    <span>{this.state.isSubmited && !this.state.admission && 'Admission No is required'}</span>
                                                </div>
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group col-6">
                                                    <label className="col-form-label pt-0" htmlFor="username">{"User Name(Email)"}</label>
                                                    <input className="form-control" id="username" type="email" aria-describedby="username" value={this.state.username} onChange={e => this.handleChange({ username: e.target.value })} placeholder="User Name" />
                                                    <span>{this.state.isSubmited && !this.state.username && 'User Name is required'}</span>
                                                    <span>{this.state.isSubmited && this.state.username && !this.handleEmailPattern(this.state.username) && 'User Name is not valid'}</span>
                                                </div>
                                                <div className="form-group col-6">
                                                    <label className="col-form-label pt-0" htmlFor="mobile">{"Mobile"}</label>
                                                    <PhoneInput
                                                        placeholder="Enter phone number"
                                                        value={this.state.mobile}
                                                        inputClass="form-control"
                                                        country={'lk'}
                                                        enableSearch={true}
                                                        countryCodeEditable={false}
                                                        onChange={e => this.handleChange({ mobile: e })} />
                                                    <span style={{ color: "#ff5370" }}>{this.state.isSubmited && !this.state.mobile && 'Mobile is required'}</span>
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group col-6">
                                                    <label htmlFor="roleId">{'Role'}</label>
                                                    <select className="form-control digits" disabled={disableRole} onChange={e => this.handleChange({ roleId: e.target.value })} defaultValue={this.state.roleId}>
                                                        <option value={0}>All</option>
                                                        {rolesList}
                                                    </select>
                                                    <span style={{ color: "#ff5370" }}>{this.state.isSubmited && (!this.state.roleId || this.state.roleId == 0) && 'Role is required'}</span>
                                                </div>

                                            </div>

                                            {this.state.roleId == 1 && (
                                                <div><hr />
                                                    <h6>Parent Informations</h6>
                                                    <br />
                                                    <div className="form-row">
                                                        <div className="form-group col-6">
                                                            <label className="col-form-label pt-0" htmlFor="parentFirstName">{"First Name"}</label>
                                                            <input className="form-control" id="parentFirstName" type="text" aria-describedby="parentFirstName" value={this.state.parentFirstName} onChange={e => this.handleChange({ parentFirstName: e.target.value })} placeholder="First Name" />
                                                            <span>{this.state.isSubmited && this.state.roleId == 1 && !this.state.parentFirstName && 'First Name is required'}</span>
                                                        </div>
                                                        <div className="form-group col-6">
                                                            <label className="col-form-label pt-0" htmlFor="parentLastName">{"Last Name"}</label>
                                                            <input className="form-control" id="parentLastName" type="text" aria-describedby="parentLastName" value={this.state.parentLastName} onChange={e => this.handleChange({ parentLastName: e.target.value })} placeholder="Last Name" />
                                                            <span>{this.state.isSubmited && this.state.roleId == 1 && !this.state.parentLastName && 'Last Name is required'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="form-group col-6">
                                                            <label className="col-form-label pt-0" htmlFor="parentDateOfBirth">{"Date Of Birth"}</label>
                                                            <input className="form-control" defaultValue={this.state.parentDateOfBirth == null ? "" : new Date(this.state.parentDateOfBirth).toISOString().substr(0, 10)} data-date-format="YYYY MMMM DD" id="parentDateOfBirth" onChange={e => this.handleChange({ parentDateOfBirth: e.target.value })} type="date" aria-describedby="parentDateOfBirth" placeholder="Date Of Birth" />
                                                            <span>{this.state.isSubmited && this.state.roleId == 1 && !this.state.parentDateOfBirth && 'Date Of Birth is required'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="form-group col-6">
                                                            <label className="col-form-label pt-0" htmlFor="parentUsername">{"User Name(Email)"}</label>
                                                            <input className="form-control" id="parentUsername" type="email" aria-describedby="parentUsername" value={this.state.parentUsername} onChange={e => this.handleChange({ parentUsername: e.target.value })} placeholder="User Name" />
                                                            <span>{this.state.isSubmited && this.state.roleId == 1 && !this.state.parentUsername && 'User Name is required'}</span>
                                                            <span>{this.state.isSubmited && this.state.roleId == 1 && this.state.parentUsername && !this.handleEmailPattern(this.state.parentUsername) && 'User Name is not valid'}</span>
                                                        </div>
                                                        <div className="form-group col-6">
                                                            <label className="col-form-label pt-0" htmlFor="parentMobile">{"Mobile"}</label>
                                                            <PhoneInput
                                                                placeholder="Enter phone number"
                                                                value={this.state.parentMobile}
                                                                inputClass="form-control"
                                                                country={'lk'}
                                                                enableSearch={true}
                                                                countryCodeEditable={false}
                                                                onChange={e => this.handleChange({ parentMobile: e })} />
                                                            <span style={{ color: "#ff5370" }}>{this.state.isSubmited && this.state.roleId == 1 && !this.state.parentMobile && 'Mobile is required'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="form-row">
                                                <div className="form-group col-12">
                                                    <label className="d-block" htmlFor="isActive">
                                                        <input checked={this.state.isActive} className="checkbox_animated" id="isActive" type="checkbox" onChange={e => this.handleChange({ isActive: !this.state.isActive })} />
                                                        {Option} {"Active"}
                                                    </label>
                                                </div>
                                            </div>
                                            <button className="btn btn-primary mr-1" disabled={this.state.isSubmited && this.state.isValidSubmit} type="button" onClick={(e) => this.submit(e)}>{'Submit'}</button>
                                            {this.state.id > 0 && (<button className="btn btn-primary mr-1" disabled={this.state.isSubmited} type="button" onClick={(e) => this.resetPassword(this.state.id)}>{`${this.state.role} Reset Password`}</button>)}
                                            {this.state.roleId == 1 && (<button className="btn btn-primary mr-1" disabled={this.state.isSubmited} type="button" onClick={(e) => this.resetPassword(this.state.parentId)}>{`Parent Reset Password`}</button>)}
                                        </div>
                                    </form>
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
    connect(mapStateToProps, mapDispatchToProps)(EditUser));
