import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import Content from './content';
import createLink from '../../helpers/createLink';
import { handleResponse,authHeader } from "../../services/service.backend";
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

class Timeline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topicContents: [],
            topic: null,
            bgColor: null,
            fontColor: null,
            subjectId: null,
            isAssignmentAssign: null,
            assignment: null
        };
    }


    componentDidMount = async () => {
        await this.getTopicContent(this.props.topicId);
    }

    getTopicContent = async (id) => {

        const topicContentsList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`classRoom/topicsContent?id=${id}`,requestOptions)
            .then(handleResponse)
            .then(response => {
                this.setState({
                    topic: response.topic,
                    bgColor: response.bgColor,
                    fontColor: response.fontColor,
                    subjectId: response.subjectId
                });
                
                var isAssignmentAssign=response.isAssignmentAssign;
                this.setState({
                    isAssignmentAssign:isAssignmentAssign
                });
                
                var assignment=response.assignment;
                this.setState({
                    assignment:assignment
                });
                
                response.topicContents.map(i =>
                    topicContentsList.push({ id: i.id, typeId: i.typeId, type: i.type, url: i.url, description: i.description, order: i.order, documents: i.documents })
                )
                this.setState({
                    topicContents: topicContentsList
                });
            });
    }


    render() {
        return (
            <Fragment>
                <Breadcrumb title={'Content'} parent={'Chapter'} parentLink={createLink('/chapters/:subjectId', { subjectId: this.state.subjectId })} isParentShow={true} />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-body">
                                    <Content topic={this.state.topic} contents={this.state.topicContents} bgColor={this.state.bgColor} assignment={this.state.assignment} isAssignmentAssign={this.state.isAssignmentAssign} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
};


const mapStateToProps = (state, params) => {
    return {
        topicId: params.match.params.topicId
    };
};

const mapDispatchToProps = (dispatch, params) => ({

});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Timeline));