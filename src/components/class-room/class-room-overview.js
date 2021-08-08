import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import { handleResponse,authHeader } from "../../services/service.backend";
import createLink from '../../helpers/createLink';
import { Link } from 'react-router-dom';
import { Col, Card, CardBody } from 'reactstrap';
import { Accordion } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { Button} from 'reactstrap';
import { toast } from 'react-toastify';

class ClassRoomOverview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subjects: [],
            instituteTerms: [],
            fromDate: null,
            toDate: null,
            subjectId: '0',
            instituteTermsId: '0',
            filterExpand: false,
            isToday: true,
            isThisWeek: false,
            isNextWeek: false,
            isCustom: false,
            classRoomOverviews: []
        };
    }

    componentDidMount = async () => {
        await this.getClassRoomOverview();
        await this.getSubjects(1);
        await this.getInstituteTerms(2);
    }


    getClassRoomOverview = async () => {
        const classRoomOverviewList = [];
        const currentUser = localStorage.getItem('token');
        await fetch("classRoom/filterClassRoom", {
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "accept": "application/json",
                "Authorization": `Bearer ${currentUser}`
            },
            "body": JSON.stringify({
                fromDate: this.state.fromDate,
                toDate: this.state.toDate,
                subjectId: this.state.subjectId,
                instituteTermsId: this.state.instituteTermsId,
                isToday: this.state.isToday,
                isThisWeek: this.state.isThisWeek,
                isNextWeek: this.state.isNextWeek,
                isCustom: this.state.isCustom
            })
        })
            .then(response => response.json())
            .then(response => {

                response.classRoomOverviews.map(i =>
                    classRoomOverviewList.push({ date: new Date(i.date).toDateString(), term: i.term, subject: i.subject, chapter: i.chapter, topic: i.topic, action: <Link className="btn btn-light" to={createLink('/content/:topicId', { topicId: i.topicId })}><i className="icofont icofont-ui-note"></i></Link> })
                )
                this.setState({
                    classRoomOverviews: classRoomOverviewList,
                });
                this.setState({
                    isSubmited: false
                });

            })
            .catch(err => {
                toast.error(err)
            });
    }

    getSubjects = async (id) => {
        const subjectsList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`reference/getReference?id=${id}`,requestOptions)
            .then(handleResponse)
            .then(response => {

                response.references.map(i =>
                    subjectsList.push({ id: i.id, value: i.value })
                )
                this.setState({
                    subjects: subjectsList,
                });
            });
    }

    getInstituteTerms = async (id) => {
        const instituteTermsList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`reference/getReference?id=${id}`,requestOptions)
            .then(handleResponse)
            .then(response => {

                response.references.map(i =>
                    instituteTermsList.push({ id: i.id, value: i.value })
                )
                this.setState({
                    instituteTerms: instituteTermsList,
                });
            });
    }

    changeAccordion = () => {
        this.setState({
            filterExpand: !this.state.filterExpand
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

    handleChangeRadio(changeObject, linkObject) {
        if (linkObject !== 'isCustom') {
            this.setState({
                isCustom: false
            });
        }

        if (linkObject !== 'isToday') {
            this.setState({
                isToday: false
            });
        }

        if (linkObject !== 'isThisWeek') {
            this.setState({
                isThisWeek: false
            });
        }

        if (linkObject !== 'isNextWeek') {
            this.setState({
                isNextWeek: false
            });
        }

        this.setState(changeObject);
        this.setState({
            isSubmited: false
        });
    }

    submitEvent = async (e) => {
        const classRoomOverviewList = [];
        e.preventDefault();
        this.setState({
            isSubmited: true
        });

        if (this.validate()) {
            const currentUser = localStorage.getItem('token');
            await fetch("classRoom/filterClassRoom", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json",
                    "Authorization": `Bearer ${currentUser}`
                },
                "body": JSON.stringify({
                    fromDate: this.state.fromDate,
                    toDate: this.state.toDate,
                    subjectId: this.state.subjectId,
                    instituteTermsId: this.state.instituteTermsId,
                    isToday: this.state.isToday,
                    isThisWeek: this.state.isThisWeek,
                    isNextWeek: this.state.isNextWeek,
                    isCustom: this.state.isCustom
                })
            })
                .then(response => response.json())
                .then(response => {


                    response.classRoomOverviews.map(i =>
                        classRoomOverviewList.push({ date: new Date(i.date).toDateString(), term: i.term, subject: i.subject, chapter: i.chapter, topic: i.topic, action: <Link className="btn btn-light" to={createLink('/content/:topicId', { topicId: i.topicId })}><i className="icofont icofont-ui-note"></i></Link> })
                    )
                    this.setState({
                        classRoomOverviews: classRoomOverviewList,
                    });

                    this.setState({
                        isSubmited: false
                    });

                })
                .catch(err => {
                    toast.error(err)
                });
        }
    }

    validate = () => {
        if (this.state.isCustom) {
            if (this.state.fromDate === null || this.state.fromDate === "") {
                return false;
            }

            if (this.state.toDate === null || this.state.toDate === "") {
                return false;
            }

            if (new Date(this.state.toDate).getTime() < new Date(this.state.fromDate).getTime()) {
                return false;
            }
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
        const openDataColumns = [
            {
                name: 'Date',
                selector: 'date',
                sortable: true
            },
            {
                name: 'Term',
                selector: 'term',
                sortable: true
            },
            {
                name: 'Subject',
                selector: 'subject',
                sortable: true
            },
            {
                name: 'Chapter',
                selector: 'chapter'
            },
            {
                name: 'Topic',
                selector: 'topic'
            },
            {
                name: 'Open Lesson',
                selector: 'action'
            }
        ];

        const subjectsList = [];
        this.state.subjects.forEach(refVal => {
            subjectsList.push(
                this.handleSelectOptions(
                    refVal
                )
            );
        });

        const instituteTermsList = [];
        this.state.instituteTerms.forEach(refVal => {
            instituteTermsList.push(
                this.handleSelectOptions(
                    refVal
                )
            );
        });
        return (
            <Fragment>
                <Breadcrumb title="Class Room Overview" parent="Class Room" isParentShow={false} />
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
                                                                        <div className="form-group m-t-15 m-checkbox-inline mb-0 ml-1">
                                                                            <label htmlFor="edo-ani">
                                                                                <input className="radio_animated" id="edo-ani" type="radio" name="rdo-ani" defaultChecked onChange={e => this.handleChangeRadio({ isToday: true }, 'isToday')} />
                                                                                {Option} {"Today"}
                                                                            </label>
                                                                            <label htmlFor="edo-ani1">
                                                                                <input className="radio_animated" id="edo-ani1" type="radio" name="rdo-ani" onChange={e => this.handleChangeRadio({ isThisWeek: true }, 'isThisWeek')} />
                                                                                {Option} {"This Week"}
                                                                            </label>
                                                                            <label htmlFor="edo-ani2">
                                                                                <input className="radio_animated" id="edo-ani2" type="radio" name="rdo-ani" onChange={e => this.handleChangeRadio({ isNextWeek: true }, 'isNextWeek')} />
                                                                                {Option} {"Next Week"}
                                                                            </label>
                                                                            <label htmlFor="edo-ani13">
                                                                                <input className="radio_animated" id="edo-ani13" type="radio" name="rdo-ani" onChange={e => this.handleChangeRadio({ isCustom: true }, 'isCustom')} />
                                                                                {Option} {"Custom"}
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    {
                                                                        this.state.isCustom && (
                                                                            <div className="form-row">
                                                                                <div className="form-group col-6">
                                                                                    <label className="col-form-label pt-0" htmlFor="fromDate">{"From Date"}</label>
                                                                                    <input className="form-control" data-date-format="YYYY MMMM DD" id="fromDate" onChange={e => this.handleChange({ fromDate: e.target.value })} type="date" aria-describedby="fromDate" placeholder="Enter From Date" />
                                                                                    <span>{this.state.isSubmited && this.state.isCustom && !this.state.fromDate && 'From Date is required'}</span>
                                                                                </div>
                                                                                <div className="form-group col-6">
                                                                                    <label className="col-form-label pt-0" htmlFor="toDate">{"To Date"}</label>
                                                                                    <input className="form-control" id="toDate" type="date" aria-describedby="toDate" onChange={e => this.handleChange({ toDate: e.target.value })} placeholder="Enter To Date" />
                                                                                    <span>{this.state.isSubmited && this.state.isCustom && !this.state.toDate && 'To Date is required'}</span>
                                                                                    <span>{this.state.isSubmited && this.state.isCustom && this.state.toDate && !this.state.fromDate && 'From Date select first'}</span>
                                                                                    <span>{this.state.isSubmited && this.state.isCustom && this.state.toDate < this.state.fromDate && 'From Date less than To Date'}</span>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                    <div className="form-row">
                                                                        <div className="form-group col-6">
                                                                            <label htmlFor="exampleFormControlSelect9">{'Subject'}</label>
                                                                            <select onChange={e => this.handleChange({ subjectId: e.target.value })} className="form-control digits" defaultValue="0">
                                                                                <option value={0}>All</option>
                                                                                {subjectsList}
                                                                            </select>
                                                                        </div>
                                                                        <div className="form-group col-6">
                                                                            <label htmlFor="exampleFormControlSelect9">{'Terms'}</label>
                                                                            <select className="form-control digits" defaultValue="0">
                                                                                <option value={0}>All</option>
                                                                                {instituteTermsList}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                            <div className="card-footer">
                                                                <Button color="primary mr-1" disabled={this.state.isSubmited && this.state.isValidSubmit} onClick={(e) => this.submitEvent(e)}>Filter</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <DataTable
                                                        columns={openDataColumns}
                                                        data={this.state.classRoomOverviews}
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

export default ClassRoomOverview;