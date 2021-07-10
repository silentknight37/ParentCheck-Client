import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import { handleResponse } from "../../services/service.backend";
import createLink from '../../helpers/createLink';
import { Link } from 'react-router-dom';
import { Col, Card, CardHeader, CardBody } from 'reactstrap';
import { Accordion } from 'react-bootstrap';
class ClassRoomOverview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subjects: [],
            userClass: null,
            filterExpand:false
        };
    }

    componentDidMount = async () => {
        await this.getSubjects();
    }

    getSubjects = async () => {

        const subjectsList = [];

        return fetch(`classRoom/userSubjects`)
            .then(handleResponse)
            .then(response => {
                this.setState({
                    userClass: response.userClass
                });
                response.subjects.map(i =>
                    subjectsList.push({ id: i.id, subjectText: i.subjectText, descriptionText: i.descriptionText, bgColor: i.bgColor, fontColor: i.fontColor })
                )
                this.setState({
                    subjects: subjectsList
                });
            });
    }


    generateSubjectList = (subjectDetails) => {
        return (
            <div className="col-3">
                <div className="ribbon-wrapper card">
                    <div className="card-body text-center" style={{ borderBottom: `${subjectDetails.bgColor} 2px solid` }}>
                        <div className="ribbon ribbon-clip ribbon-light" style={{ backgroundColor: subjectDetails.bgColor }}><i className="icon-book"></i></div>
                        <h5 className="f-w-900">{subjectDetails.subjectText}</h5>
                        <p>{subjectDetails.descriptionText}</p>
                        <Link className="btn btn-light" to={createLink('/chapters/:subjectId', { subjectId: subjectDetails.id })}>Get Chapters</Link>
                    </div>
                </div>
            </div>
        )
    }

    changeAccordion=()=>{
        this.setState({
            filterExpand: !this.state.filterExpand
        });
    }
    render() {
        
        return (
            <Fragment>
                <Breadcrumb title="Subjects" parent="Class Room" isParentShow={false} />
                <div className="container-fluid">
                    <div className="row">
                        <Col>
                            <Accordion>
                                <Card>
                                    <CardBody>
                                        <div className="default-according style-1" id="accordionclose">
                                            <Fragment>
                                                <Card>
                                                    <CardHeader className="bg-primary">
                                                        <h5 className="mb-0">
                                                            <Accordion.Toggle as={Card.Header} className="btn btn-link txt-white " color="primary" eventKey="0" onClick={this.changeAccordion} aria-expanded={this.state.filterExpand}>
                                                                Filter
                                                            </Accordion.Toggle>
                                                        </h5>
                                                    </CardHeader>
                                                    <Accordion.Collapse eventKey="0">
                                                        <CardBody>
                                                            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                                                        </CardBody>
                                                    </Accordion.Collapse>
                                                </Card>
                                            </Fragment>
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