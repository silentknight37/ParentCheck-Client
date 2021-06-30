import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import { handleResponse } from "../../services/service.backend";
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { ListGroup, ListGroupItem } from 'reactstrap'
import { Book } from 'react-feather';
import createLink from '../../helpers/createLink';
import { Link } from 'react-router-dom';
import Assignment from './assignment';
class Chapters extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chapters: [],
            topics: [],
            subject: null,
            bgColor: null,
            fontColor: null,
            chapter: null,
            isAssignmentAssign: null,
            assignment: null
        };
    }

    componentDidMount = async () => {
        await this.getChapters(this.props.subjectId);
    }

    getChapters = async (id) => {

        const chaptersList = [];

        return fetch(`classRoom/subjectChapter?id=${id}`)
            .then(handleResponse)
            .then(response => {
                this.setState({
                    subject: response.subject,
                    bgColor: response.bgColor,
                    fontColor: response.fontColor
                });
                response.subjectChapters.map(i =>
                    chaptersList.push({ id: i.id, chapterText: i.chapterText, topicCount: i.topicCount })
                )
                this.setState({
                    chapters: chaptersList
                });
                if (chaptersList.length > 0) {
                    var firstChapterId = chaptersList[0].id;
                    this.getTopics(firstChapterId);
                }
            });
    }

    getTopics = async (id) => {

        const topicsList = [];

        return fetch(`classRoom/chapterTopics?id=${id}`)
            .then(handleResponse)
            .then(response => {
                this.setState({
                    chapter: response.chapter
                });

                var isAssignmentAssign=response.isAssignmentAssign;
                this.setState({
                    isAssignmentAssign:isAssignmentAssign
                });
                
                var assignment=response.assignment;
                this.setState({
                    assignment:assignment
                });

                response.chapterTopics.map(i =>
                    topicsList.push({ id: i.id, topic: i.topic, description: i.description, submitDate: i.submitDate })
                )
                this.setState({
                    topics: topicsList
                });
            });
    }

    generateChaptersList = (chapterDetails) => {
        return (
            <div>
                <ListGroupItem className="list-group-item-action d-flex justify-content-between align-items-center" onClick={() => this.getTopics(chapterDetails.id)}>{chapterDetails.chapterText}
                    <span className="badge badge-primary counter digits" style={{ backgroundColor: this.state.bgColor }}>{chapterDetails.topicCount}</span>
                </ListGroupItem>
            </div>
        )
    }

    generateTopicsList = (topicDetails) => {
        return (
            <div className="card-body">
                <div className="timeline-small">
                    <Link to={createLink('/content/:topicId', { topicId: topicDetails.id })}>
                        <div className="media">
                            <div className="timeline-round m-r-30 timeline-line-1" style={{ backgroundColor: this.state.bgColor }}>
                                <Book />
                            </div>
                            <div className="media-body">
                                <h6 style={{ color: "#313131" }}>{topicDetails.topic} <span className="pull-right f-14">{topicDetails.submitDate}</span></h6>
                                <p style={{ color: "#313131" }}>{topicDetails.description}</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        )
    }

    getAssignment = () => {
        return this.state.isAssignmentAssign===true && this.state.assignment!=null && (
            <div className="card-body">
                <Assignment title={this.state.chapter} assignment={this.state.assignment}/>
            </div>
        )
    }

    render() {
        return (
            this.state.topics.length > 0 && this.state.chapters.length > 0 && (
                <Fragment>
                    <Breadcrumb title="Chapters" parent="Subjects" parentLink={createLink('/subjects')} isParentShow={true} />

                    <div className="container-fluid">

                        <div className="row">
                            <div className="col-lg-12">

                                <div className="row default-according style-1 faq-accordion" id="accordionoc">
                                    <div className="col-4">
                                        <div className="row">

                                            <div className="col-lg-12">
                                                <div className="card ">
                                                    <div className="card-header">
                                                        <h5>{this.state.subject}</h5>
                                                    </div>
                                                    <div className="card-body">
                                                        <ListGroup>
                                                            {this.state.chapters.map(i => this.generateChaptersList(i))}
                                                        </ListGroup>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-8">
                                        <div className="card">
                                            <div className="card-header">
                                                <h5>{this.state.chapter}</h5>
                                            </div>
                                            {this.state.topics.map(i => this.generateTopicsList(i))}
                                            {this.getAssignment()}
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )
        );
    }
}

const mapStateToProps = (state, params) => {
    return {
        subjectId: params.match.params.subjectId
    };
};

const mapDispatchToProps = (dispatch, params) => ({

});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Chapters));