import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import { handleResponse, authHeader } from "../../services/service.backend";
import createLink from '../../helpers/createLink';
import { Link } from 'react-router-dom';
import { Col, Card, CardBody } from 'reactstrap';
import { Accordion } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { Button } from 'reactstrap';
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";

class StudentAttendant extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            classes: [],
            recordDate: null,
            classId: null,
            classStudentAttendances: []
        };
    }

    componentDidMount = async () => {
        await this.getClass(4);
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

    handleChange(changeObject) {
        this.setState(changeObject);
        this.setState({
            isSubmited: false
        });
    }

    handleDateChange(changeObject) {
        this.setState(changeObject);
        this.setState({
            isSubmited: false
        });
    }


    GetClassStudentAttendances = async () => {
        const classStudentAttendanceList = [];
        this.setState({
            isSubmited: true
        });

        if (this.validate()) {
            const requestOptions = { method: 'GET', headers: authHeader() };
            return fetch(`classRoom/getClassStudentAttendances?classId=${this.state.classId}&recordDate=${this.state.recordDate}`, requestOptions)
                .then(handleResponse)
                .then(response => {
                    response.studentAttendances.map(i =>
                        classStudentAttendanceList.push({
                            id: i.id, attendance: i.isMarked ? i.isAttendance ?
                                <div>
                                    <i className="icofont  icofont-check mr-2" style={{ color: "#18c435", fontSize: "25px" }}></i>
                                    <Button className="btn btn-warning" onClick={() => this.SaveAttendance(false, i.instituteUserId, i.instituteClassId,true)}><i className="icofont icofont-refresh" style={{ fontSize: "20px" }}></i></Button>
                                </div>
                                :
                                <div>
                                    <i className="icofont  icofont-close mr-2" style={{ color: "#c41835", fontSize: "25px" }}></i>
                                    <Button className="btn btn-warning" onClick={() => this.SaveAttendance(false, i.instituteUserId, i.instituteClassId,true)}><i className="icofont icofont-refresh" style={{ fontSize: "20px" }}></i></Button>
                                </div>
                                :
                                <div>
                                    <Button className="btn btn-success mr-2" onClick={() => this.SaveAttendance(true, i.instituteUserId, i.instituteClassId,false)}><i className="icofont icofont-check" style={{ fontSize: "20px" }}></i></Button>
                                    <Button className="btn btn-danger mr-2" onClick={() => this.SaveAttendance(false, i.instituteUserId, i.instituteClassId,false)}><i className="icofont icofont-close" style={{ fontSize: "20px" }}></i></Button>
                                </div>
                            , isMarked: i.isMarked, recordDate: new Date(i.recordDate).toDateString(), studentUserName: i.studentUserName, className: i.className
                        })
                    )
                    this.setState({
                        classStudentAttendances: classStudentAttendanceList,
                        isSubmited: false
                    });
                });
        }
    }

    validate = () => {

        if (this.state.recordDate === null || this.state.recordDate === "") {
            return false;
        }

        if (this.state.classId === null || this.state.classId === "") {
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

    SaveAttendance = async (isAttendance, instituteUserId, instituteClassId,isReset) => {
        const currentUser = localStorage.getItem('token');
        await fetch("classRoom/saveClassStudentAttendance", {
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "accept": "application/json",
                "Authorization": `Bearer ${currentUser}`
            },
            "body": JSON.stringify({
                instituteUserId: instituteUserId,
                instituteClassId: instituteClassId,
                isAttendance: isAttendance,
                recordDate: this.state.recordDate,
                isReset:isReset
            })
        })
            .then(response => response.json())
            .then(async (response) => {
                await this.GetClassStudentAttendances();
            })
            .catch(err => {
                toast.error(err)
            });
    }
    render() {
        const openDataColumns = [
            {
                name: 'Student Name',
                selector: 'studentUserName',
                sortable: true
            },
            {
                name: 'Attendance',
                selector: 'attendance',
                center: true,
                sortable: true
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

        return (
            <Fragment>
                <Breadcrumb title="Student Attendance" parent="Class Room" isParentShow={false} />
                <div className="container-fluid">
                    <div className="row">
                        <Col>
                            <Accordion>
                                <Card>
                                    <CardBody>
                                        <div className="table-responsive support-table">
                                            <Card>
                                                <CardBody>
                                                    <div className="col-sm-12">
                                                        <div className="card">
                                                            <div className="card-body">
                                                                <form className="theme-form needs-validation" noValidate="">
                                                                    <div className="form-row">
                                                                        <div className="form-group col-6">
                                                                            <label htmlFor="exampleFormControlSelect9">{'Class'}</label>
                                                                            <select onChange={e => this.handleChange({ classId: e.target.value })} className="form-control digits" defaultValue="0">
                                                                                <option value={0}>All</option>
                                                                                {classList}
                                                                            </select>
                                                                            <span style={{ color: "#ff5370" }}>{this.state.isSubmited && !this.state.classId && 'Class is required'}</span>
                                                                        </div>
                                                                        <div className="form-group col-6">
                                                                            <label className="col-form-label pt-0" htmlFor="recordDate">{"Record Date"}</label>
                                                                            <input className="form-control" data-date-format="YYYY MMMM DD" id="recordDate" onChange={e => this.handleChange({ recordDate: e.target.value })} type="date" aria-describedby="fromDate" placeholder="Enter From Date" />
                                                                            <span>{this.state.isSubmited && !this.state.recordDate && 'Date is required'}</span>
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                            <div className="card-footer">
                                                                <Button color="primary mr-1" disabled={this.state.isSubmited && this.state.isValidSubmit} onClick={(e) => this.GetClassStudentAttendances(e)}>Get Attendance</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <DataTable
                                                        columns={openDataColumns}
                                                        data={this.state.classStudentAttendances}
                                                        striped={true}
                                                        pagination
                                                    />
                                                </CardBody>
                                            </Card>

                                        </div>
                                    </CardBody>
                                </Card>
                            </Accordion>
                        </Col>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default StudentAttendant;