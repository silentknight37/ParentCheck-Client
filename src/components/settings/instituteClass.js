import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import DataTable from 'react-data-table-component'
import { handleResponse, authHeader } from "../../services/service.backend";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { UncontrolledTooltip } from 'reactstrap';
import createLink from '../../helpers/createLink';
class InstituteClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            yearAcademic: null,
            academicClass: null,
            responsibleUserId: 0,
            isActive: true,
            isSubmited: false,
            isValidSubmit: false,
            iconWithTab: '1',
            academicClasses: [],
            isTemplateEditorOpen: false,
            isEdit: false,
            yearAcademics: [],
            responsibleUsers: []
        };
    }

    componentDidMount = async () => {
        await this.getClasses();
        await this.getYearAcademics(8);
        await this.getResponsibleUsers(9);
    }

    getClasses = async () => {
        const academicClassList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`setting/getClasses`, requestOptions)
            .then(handleResponse)
            .then(response => {
                response.academicClasses.map(i =>
                    academicClassList.push({
                        id: i.id, className: i.className, yearAcademic: i.yearAcademic, responsibleUserId: i.responsibleUserId, responsibleUser: i.responsibleUser, isActive: i.isActive ? "True" : "False", action: 
                        <div>
                            <Link className="btn btn-light" id="btn_Edit" onClick={() => this.selectedTemplate(i)}><i className="icofont icofont-ui-edit"></i></Link>
                            <UncontrolledTooltip placement="top" target="btn_Edit">
                                {"Edit"}
                            </UncontrolledTooltip>
                            
                            <Link className="btn btn-light" id="btn_time_table" to={createLink('/class-subject-management/:id', { id: i.id })}><i className="icofont icofont-book-alt"></i></Link>
                            <UncontrolledTooltip placement="top" target="btn_time_table">
                                {"Setup Subjects"}
                            </UncontrolledTooltip>
                        </div>
                    })
                )
                this.setState({
                    academicClasses: academicClassList,
                });
            });
    }

    getResponsibleUsers = async (id) => {
        const responsibleUserList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`reference/getReference?id=${id}`, requestOptions)
            .then(handleResponse)
            .then(response => {

                response.references.map(i =>
                    responsibleUserList.push({ id: i.id, value: i.value })
                )
                this.setState({
                    responsibleUsers: responsibleUserList,
                });
            });
    }

    getYearAcademics = async (id) => {
        const yearAcademicsList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`reference/getReference?id=${id}`, requestOptions)
            .then(handleResponse)
            .then(response => {

                response.references.map(i =>
                    yearAcademicsList.push({ id: i.id, value: i.value })
                )
                this.setState({
                    yearAcademics: yearAcademicsList,
                });
            });
    }

    selectedTemplate = (data) => {
        this.setState({
            id: data.id,
            academicClass: data.className,
            yearAcademic: data.yearAcademic,
            responsibleUserId: data.responsibleUserId,
            isActive: data.isActive,
            isEdit: true
        });

        this.openModalToggle();
    }
    submit = async (e) => {
        e.preventDefault();
        this.setState({
            isSubmited: true
        });
        if (this.validate()) {
            const currentUser = localStorage.getItem('token');
            await fetch("setting/saveClasses", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json",
                    "Authorization": `Bearer ${currentUser}`
                },
                "body": JSON.stringify({
                    id: this.state.id,
                    academicClass: this.state.academicClass,
                    yearAcademic: +this.state.yearAcademic,
                    responsibleUserId: +this.state.responsibleUserId,
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

                    await this.getClasses();

                    this.setState({
                        isSubmited: false,
                        isSmsSendOpen: false,
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
        this.setState(changeObject);
        this.setState({
            isSubmited: false
        });
    }


    validate = () => {
        if (this.state.yearAcademic === null || this.state.yearAcademic === "") {
            return false;
        }

        if (this.state.academicClass === null || this.state.academicClass === "") {
            return false;
        }

        if (this.state.responsibleUserId === null || this.state.responsibleUserId === "0") {
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

        const yearAcademicList = [];
        this.state.yearAcademics.forEach(refVal => {
            yearAcademicList.push(
                this.handleSelectOptions(
                    refVal
                )
            );
        });

        const responsibleUserList = [];
        this.state.responsibleUsers.forEach(refVal => {
            responsibleUserList.push(
                this.handleSelectOptions(
                    refVal
                )
            );
        });

        const openDataColumns = [
            {
                name: 'Class',
                selector: 'className',
                sortable: true
            },
            {
                name: 'Responsible User',
                selector: 'responsibleUser',
                sortable: true,
                wrap: true
            },
            {
                name: 'Active',
                selector: 'isActive',
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
            <Fragment>
                <Breadcrumb title="Academic Classes" parent="Academic Classes" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{"Academic Classes"}</h5>
                                </div>
                                <div className="card-body">
                                    <div className="card-header">
                                        <Button color="primary" onClick={this.openModalToggle}>Add Academic Class</Button>
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
                                                                    <label className="col-form-label pt-0" htmlFor="academicClass">{"Academic Class"}</label>
                                                                    <input className="form-control" id="academicClass" disabled={this.state.isEdit} type="text" aria-describedby="academicClass" value={this.state.academicClass} onChange={e => this.handleChange({ academicClass: e.target.value })} placeholder="Academic Class" />
                                                                    <span>{this.state.isSubmited && !this.state.academicClass && 'Academic Class is required'}</span>
                                                                </div>
                                                            </div>
                                                            {!this.state.isEdit && (
                                                                <div>
                                                                    <div className="form-row">
                                                                        <div className="form-group col-12">
                                                                            <label className="col-form-label pt-0" htmlFor="yearAcademic">{"Academic Year"}</label>
                                                                            <select onChange={e => this.handleChange({ yearAcademic: e.target.value })} className="form-control digits" defaultValue="0">
                                                                                <option value={0}>All</option>
                                                                                {yearAcademicList}
                                                                            </select>
                                                                            <span style={{ color: "#ff5370" }}>{this.state.isSubmited && !this.state.yearAcademic && 'Academic Year is required'}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div className="form-row">
                                                                <div className="form-group col-12">
                                                                    <label className="col-form-label pt-0" htmlFor="responsibleUserId">{"Responsible User"}</label>
                                                                    <select onChange={e => this.handleChange({ responsibleUserId: e.target.value })} className="form-control digits" defaultValue={this.state.responsibleUserId}>
                                                                        <option value={0}>All</option>
                                                                        {responsibleUserList}
                                                                    </select>
                                                                    <span style={{ color: "#ff5370" }}>{this.state.isSubmited && (!this.state.responsibleUserId || this.state.responsibleUserId == 0) && 'Responsible User is required'}</span>
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
                                                <button className="btn btn-primary mr-1" disabled={this.state.isSubmited && this.state.isValidSubmit} type="button" onClick={(e) => this.submit(e)}>{'Submit'}</button>
                                            </ModalFooter>
                                        </Modal>
                                    }
                                    <DataTable
                                        columns={openDataColumns}
                                        data={this.state.academicClasses}
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

export default InstituteClass;