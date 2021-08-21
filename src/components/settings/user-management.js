import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import DataTable from 'react-data-table-component'
import { Card, CardBody } from 'reactstrap'
import { handleResponse, authHeader } from "../../services/service.backend";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import createLink from '../../helpers/createLink';
import { Link } from 'react-router-dom';
import { UncontrolledTooltip } from 'reactstrap';
class UserManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            instituteUsers: [],
            searchVal: ""
        };
    }

    componentDidMount = async () => {
        await this.getInstituteUsers(this.state.searchVal);
    }

    getInstituteUsers = async (searchVal) => {
        const instituteUserList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`setting/getUsers?searchValue=${searchVal}`, requestOptions)
            .then(handleResponse)
            .then(response => {
                response.instituteUsers.map(i =>
                    instituteUserList.push({
                        id: i.id, firstName: i.firstName, lastName: i.lastName, mobile: i.mobile, admission: i.admission, role: i.role, dateOfBirth: new Date(i.dateOfBirth).toDateString(), dateOfBirthFormated: i.dateOfBirthFormated, userName: i.userName,
                        isActive: i.isActive ? <i className="icofont  icofont-check mr-2" style={{ color: "#18c435", fontSize: "25px" }}></i> : <i className="icofont  icofont-close mr-2" style={{ color: "#c41835", fontSize: "25px" }}></i>,
                        action: <div>
                            <Link className="btn btn-light" id="btn_subject" to={createLink('/add-user/:id',{id:i.id})}><i className="icofont icofont-book-alt"></i></Link>
                            <UncontrolledTooltip placement="top" target="btn_subject">
                                {"Edit"}
                            </UncontrolledTooltip>
                        </div>
                    })
                )
                this.setState({
                    instituteUsers: instituteUserList,
                });
            });
    }

    handleChange = async (changeObject) => {
        await this.getInstituteUsers(changeObject);
        this.setState({
            searchVal: changeObject
        });
    }
    render() {

        const openDataColumns = [
            {
                name: 'First Name',
                warp: true,
                width: '110px',
                selector: 'firstName',
                sortable: true
            },
            {
                name: 'Last Name',
                warp: true,
                width: '120px',
                selector: 'lastName',
                sortable: true
            },
            {
                name: 'Role',
                warp: true,
                selector: 'role',
                sortable: true
            },
            {
                name: 'DOB',
                warp: true,
                width: '105px',
                selector: 'dateOfBirthFormated',
                sortable: true
            },
            {
                name: 'User Name',
                width: '270px',
                selector: 'userName',
                sortable: true
            },
            {
                name: 'Mobile',
                warp: true,
                width: '120px',
                selector: 'mobile',
                sortable: true
            },
            {
                name: 'Admission',
                warp: true,
                width: '90px',
                selector: 'admission',
                sortable: true
            },
            {
                name: 'Active',
                warp: true,
                width: '50px',
                selector: 'isActive',
                sortable: true,
                wrap: true
            },
            {
                name: 'Action',
                center: true,
                selector: 'action',
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
                                        <Link className="btn btn-primary" id="btn_subject" to={createLink('/add-user/:id',{id:0})}>Add User</Link>
                                    </div>
                                    <div className="card-body">
                                        <input className="form-control" id="search" type="text" aria-describedby="search" value={this.state.search} onChange={e => this.handleChange(e.target.value)} placeholder="Search" />

                                    </div>
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