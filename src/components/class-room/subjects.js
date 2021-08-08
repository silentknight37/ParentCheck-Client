import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import { handleResponse,authHeader } from "../../services/service.backend";
import createLink from '../../helpers/createLink';
import { Link } from 'react-router-dom';
class Subjects extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subjects: [],
            userClass: null
        };
    }

    componentDidMount = async () => {
        await this.getSubjects();
    }

    getSubjects = async () => {

        const subjectsList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`classRoom/userSubjects`,requestOptions)
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
                        <Link className="btn btn-light" to={createLink('/chapters/:subjectId',{subjectId:subjectDetails.id})}>Get Chapters</Link>
                    </div>
                </div>
            </div>
        )
    }
    render() {
        return (
            <Fragment>
                <Breadcrumb title="Subjects" parent="Class Room" isParentShow={false}/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="header-faq">
                                <h5 className="mb-0">{this.state.userClass}</h5>
                            </div>
                            <div className="row">
                                {this.state.subjects.map(i => this.generateSubjectList(i))}
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Subjects;