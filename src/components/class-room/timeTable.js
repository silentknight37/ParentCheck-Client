import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import { handleResponse, authHeader } from "../../services/service.backend";
import { Container, Row, Col, Card, CardHeader, CardBody } from 'reactstrap'
import { Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AlignCenter } from 'react-feather';
import { TextAsAction } from '../../constant';
class TimeTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            weekDays: [],
            userClass: null
        };
    }

    componentDidMount = async () => {
        await this.getTodayTimeTable();
    }

    getTodayTimeTable = async () => {
        const WeekdayList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`setting/getTimeTable`, requestOptions)
            .then(handleResponse)
            .then(response => {
                response.weekDays.map(i =>

                    WeekdayList.push({
                        Weekday: i.Weekday, TimeTables: i.TimeTables
                    })
                )
                this.setState({
                    weekDays: WeekdayList
                });
            });
    }

    generateSubjectTableList = (timeTable) => {
        return (
            <div>
                <div className="name">{timeTable.subject}</div>
                <div className="status"> {timeTable.fromTime} - {timeTable.toTime}</div>
                <hr/>
            </div>
            
        )
    }
    generateTimeTableList = (weekDay) => {
        return (
            <Card style={{textAlign:"center"}}>
                <CardHeader >
                    <h5 className="mb-0">
                        <Accordion.Toggle as={Card.Header} className="btn btn-link" color="default" eventKey={weekDay.Weekday}>
                            {weekDay.Weekday}
                        </Accordion.Toggle>
                    </h5>
                </CardHeader>
                <Accordion.Collapse eventKey={weekDay.Weekday}>
                    <CardBody>
                    {weekDay.TimeTables.map(i => this.generateSubjectTableList(i))}
                    </CardBody>
                </Accordion.Collapse>
            </Card>
        )
    }
    render() {
        return (
            <Fragment>
                <Breadcrumb title="Subjects" parent="Class Room" isParentShow={false} />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12">

                            <div className="row">
                                <Accordion className="col-6">
                                    <div className="default-according col-12" id="accordionclose">

                                            {this.state.weekDays.map(i => this.generateTimeTableList(i))}

                                    </div>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default TimeTable;