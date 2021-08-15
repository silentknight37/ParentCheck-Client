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

class StudentAttendantCheck extends React.Component {
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
        await this.GetClassStudentAttendances();
    }

    GetClassStudentAttendances = async () => {
        const classStudentAttendanceList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`classRoom/getStudentAttendances`, requestOptions)
            .then(handleResponse)
            .then(response => {
                response.studentAttendances.map(i =>
                    classStudentAttendanceList.push({
                        id: i.id, attendance: i.isAttendance ?
                            <div>
                                <i className="icofont  icofont-check mr-2" style={{ color: "#18c435", fontSize: "25px" }}></i>
                            </div>
                            :
                            <div>
                                <i className="icofont  icofont-close mr-2" style={{ color: "#c41835", fontSize: "25px" }}></i>
                            </div>

                        , isMarked: i.isMarked, recordDate: new Date(i.recordDate).toDateString(), studentUserName: i.studentUserName, className: i.className
                    })
                )
                this.setState({
                    classStudentAttendances: classStudentAttendanceList
                });
            });
    }
    render() {
        const openDataColumns = [
            {
                name: 'Date',
                selector: 'recordDate',
                center: true,
                sortable: true
            },
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


        return (
            <Fragment>
                <Breadcrumb title="Student Attendance" parent="Class Room" isParentShow={false} />
                <div className="container-fluid">
                    <div className="row">
                        <Col>
                            <Accordion>
                                <Card>
                                    <div className="card-header">
                                        <h5>{"Student Attendance"}</h5>
                                    </div>
                                    <CardBody>
                                        <div className="table-responsive support-table">

                                            <DataTable
                                                columns={openDataColumns}
                                                data={this.state.classStudentAttendances}
                                                striped={true}
                                                pagination
                                            />

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

export default StudentAttendantCheck;