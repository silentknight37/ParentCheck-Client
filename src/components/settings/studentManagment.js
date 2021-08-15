import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import { handleResponse, authHeader } from "../../services/service.backend";
import createLink from '../../helpers/createLink';
import { Link } from 'react-router-dom';
import { Col, Card, CardBody } from 'reactstrap';
import { Accordion } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";

class StudentManagment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            classes: [],
            recordDate: null,
            classId: 0,
            studentId: 0,
            academicYear: 0,
            classStudents: [],
            yearAcademics: [],
            students: [],
            isActive: true
        };
    }

    componentDidMount = async () => {
        await this.getClass(10);
        await this.GetClassStudentAttendances();
        await this.getYearAcademics(8);
        await this.getStudents(11);
    }

    getStudents = async (id) => {
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

    getClass = async (id) => {
        const classList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`reference/getReference?id=${id}`, requestOptions)
            .then(handleResponse)
            .then(response => {

                response.references.map(i =>
                    classList.push({ id: i.id, value: i.value })
                )
                this.setState({
                    classes: classList,
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

    handleChange = async (changeObject) => {
        this.setState(changeObject);
        this.setState({
            isSubmited: false
        });
    }

    GetClassStudentAttendances = async () => {
        const classStudentList = [];
        this.setState({
            isSubmited: true
        });
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`setting/getStudentEnroll?classId=${this.state.classId}&academicYear=${this.state.academicYear}`, requestOptions)
            .then(handleResponse)
            .then(response => {
                response.studentEnrolls.map(i =>
                    classStudentList.push({ id: i.id, studentUserName: i.studentUserName, studentUserId: i.studentUserId, className: i.className, academicYear: i.academicYear, classId: i.classId, action: <Link className="btn btn-light" onClick={() => this.selectedTemplate(i)}><i className="icofont icofont-ui-edit"></i></Link> })
                )
                this.setState({
                    classStudents: classStudentList,
                    isSubmited: false
                });
            });
    }

    validate = () => {

        if (this.state.classId === null || this.state.classId === 0) {
            return false;
        }

        if (this.state.studentId === null || this.state.studentId === 0) {
            return false;
        }

        if (this.state.academicYear === null || this.state.academicYear === 0) {
            return false;
        }
        this.setState({
            isValidSubmit: true
        });

        return true;
    }

    submit = async (e) => {
        e.preventDefault();
        this.setState({
            isSubmited: true
        });
        if (this.validate()) {
            const currentUser = localStorage.getItem('token');
            await fetch("setting/saveStudentEnroll", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json",
                    "Authorization": `Bearer ${currentUser}`
                },
                "body": JSON.stringify({
                    id: this.state.id,
                    academicYear: +this.state.academicYear,
                    classId: +this.state.classId,
                    studentId: +this.state.studentId,
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
                    this.setState({
                        isSubmited: false,
                        isSmsSendOpen: false,
                        classId: 0,
                        academicYear: 0,
                        studentId: 0,
                        isEdit: false
                    });
                    await this.GetClassStudentAttendances();


                })
                .catch(err => {
                    toast.error(err)
                });
        }
    }

    selectedTemplate = (data) => {
        this.setState({
            id: data.id,
            classId: data.classId,
            academicYear: data.academicYear,
            studentId: data.studentUserId,
            isActive: data.isActive,
            isEdit: true
        });

        this.openModalToggle();
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
            isEdit: false,
            classId: 0,
            academicYear: 0,
            studentId: 0
        });
    }

    handleSelectOptions = (refVal) => {
        return (
            <option value={refVal.id}>{refVal.value}</option>
        );
    }

    render() {

        const openDataColumns = [
            {
                name: 'Student Name',
                selector: 'studentUserName',
                sortable: true
            },
            {
                name: 'Class',
                selector: 'className',
                center: true,
                sortable: true
            },
            {
                name: 'Action',
                selector: 'action'
            }
        ];
        const classList = [];
        this.state.classes.forEach(refVal => {
            classList.push(
                this.handleSelectOptions(
                    refVal
                )
            );
        });

        const studentsList = [];
        this.state.students.forEach(refVal => {
            studentsList.push(
                this.handleSelectOptions(
                    refVal
                )
            );
        });

        const yearAcademicsList = [];
        this.state.yearAcademics.forEach(refVal => {
            yearAcademicsList.push(
                this.handleSelectOptions(
                    refVal
                )
            );
        });

        return (
            <Fragment>
                <Breadcrumb title="Student Attendance" parent="Class Room" isParentShow={false} />
                <div className="container-fluid">
                    <div className="row">
                        <Col>
                            <Accordion>
                                <CardBody>
                                    <div className="table-responsive support-table">
                                        <Card>
                                            <CardBody>
                                                <div className="col-sm-12">
                                                    <div className="card">
                                                        <div className="card-header">
                                                            <Button color="primary" onClick={this.openModalToggle}>Class Enroll</Button>
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
                                                                                            <label className="col-form-label pt-0" htmlFor="studentId">{"Student"}</label>
                                                                                            <select onChange={e => this.handleChange({ studentId: e.target.value })} className="form-control digits" defaultValue={this.state.studentId}>
                                                                                                <option value={0}>All</option>
                                                                                                {studentsList}
                                                                                            </select>
                                                                                            <span style={{ color: "#ff5370" }}>{this.state.isSubmited && !this.state.studentId && 'Student is required'}</span>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="form-row">
                                                                                        <div className="form-group col-12">
                                                                                            <label className="col-form-label pt-0" htmlFor="classId">{"Class"}</label>
                                                                                            <select onChange={e => this.handleChange({ classId: e.target.value })} className="form-control digits" defaultValue={this.state.classId}>
                                                                                                <option value={0}>All</option>
                                                                                                {classList}
                                                                                            </select>
                                                                                            <span style={{ color: "#ff5370" }}>{this.state.isSubmited && !this.state.classId && 'Class is required'}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="form-row">
                                                                                        <div className="form-group col-12">
                                                                                            <label className="col-form-label pt-0" htmlFor="academicYear">{"Academic Year"}</label>
                                                                                            <select onChange={e => this.handleChange({ academicYear: e.target.value })} className="form-control digits" defaultValue={this.state.academicYear}>
                                                                                                <option value={0}>All</option>
                                                                                                {yearAcademicsList}
                                                                                            </select>
                                                                                            <span style={{ color: "#ff5370" }}>{this.state.isSubmited && !this.state.academicYear && 'Academic Year is required'}</span>
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
                                                        </div>
                                                        <div className="card-body">

                                                            <form className="theme-form needs-validation" noValidate="">
                                                                <div className="form-row">
                                                                    <div className="form-group col-6">
                                                                        <label htmlFor="classId">{'Class'}</label>
                                                                        <select onChange={e => this.handleChange({ classId: e.target.value })} className="form-control digits" defaultValue="0">
                                                                            <option value={0}>All</option>
                                                                            {classList}
                                                                        </select>
                                                                    </div>
                                                                    <div className="form-group col-6">
                                                                        <label htmlFor="academicYearId">{'Acadamic Year'}</label>
                                                                        <select onChange={e => this.handleChange({ academicYear: e.target.value })} className="form-control digits" defaultValue="0">
                                                                            <option value={0}>All</option>
                                                                            {yearAcademicsList}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <Button color="primary mr-1" onClick={(e) => this.GetClassStudentAttendances(e)}>Filter</Button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                                <DataTable
                                                    columns={openDataColumns}
                                                    data={this.state.classStudents}
                                                    striped={true}
                                                    pagination
                                                />
                                            </CardBody>
                                        </Card>

                                    </div>
                                </CardBody>
                            </Accordion>
                        </Col>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default StudentManagment;