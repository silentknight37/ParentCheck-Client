import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import DataTable from 'react-data-table-component'
import { handleResponse, authHeader } from "../../services/service.backend";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import { Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { UncontrolledTooltip } from 'reactstrap';
import createLink from '../../helpers/createLink';
class ChapterTopic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            topic: null,
            description: null,
            isActive: true,
            isSubmited: false,
            isValidSubmit: false,
            iconWithTab: '1',
            chapterTopics: [],
            isTemplateEditorOpen: false,
            isEdit: false,
        };
    }

    componentDidMount = async () => {
        await this.getChapterTopics(this.props.id);
    }

    getChapterTopics = async (id) => {
        const chapterTopicsList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`setting/getChapterTopic?chapterId=${id}`, requestOptions)
            .then(handleResponse)
            .then(response => {

                response.chapterTopics.map(i =>
                    chapterTopicsList.push({
                        id: i.id, topic: i.topic, description: i.description, isAssignmentAssigned: i.isAssignmentAssigned, isActive: i.isActive ? "True" : "False", action:
                            <div>
                                <Link className="btn btn-light" id="btn_Edit" onClick={() => this.selectedTemplate(i)}><i className="icofont icofont-ui-edit"></i></Link>
                                <UncontrolledTooltip placement="top" target="btn_Edit">
                                    {"Edit"}
                                </UncontrolledTooltip>

                                <Link className="btn btn-light" id="btn_time_table" to={createLink('/topic-content-management/:subjectChapter/:chapterTopic/:id', {subjectChapter:this.props.subjectChapter,chapterTopic:this.props.id, id: i.id })}><i className="icofont icofont-book-alt"></i></Link>
                                <UncontrolledTooltip placement="top" target="btn_time_table">
                                    {"Topic Content"}
                                </UncontrolledTooltip>
                            </div>
                    })
                )
                this.setState({
                    chapterTopics: chapterTopicsList,
                });
            });
    }

    selectedTemplate = (data) => {
        this.setState({
            id: data.id,
            topic: data.topic,
            description: data.description,
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
            await fetch("setting/saveChapterTopic", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json",
                    "Authorization": `Bearer ${currentUser}`
                },
                "body": JSON.stringify({
                    id: this.state.id,
                    topic: this.state.topic,
                    description: this.state.description,
                    chapterId: +this.props.id,
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

                    await this.getChapterTopics(this.props.id);

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
            isEdit: false,
            chapter: null,
            isActive: true
        });
    }

    handleChange(changeObject) {
        this.setState(changeObject);
        this.setState({
            isSubmited: false
        });
    }


    validate = () => {
        if (this.state.topic === null || this.state.topic === "") {
            return false;
        }

        this.setState({
            isValidSubmit: true
        });

        return true;
    }


    render() {

        const openDataColumns = [

            {
                name: 'Topic',
                selector: 'topic',
                wrap:true,
                sortable: true
            },
            {
                name: 'Description',
                selector: 'description',
                wrap:true,
                sortable: true
            },
            {
                name: 'Active',
                selector: 'isActive',
                sortable: true,
                wrap:true,
                wrap: true
            },
            {
                name: 'Is Assignment Assigned',
                selector: 'isAssignmentAssigned',
                sortable: true,
                wrap:true,
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
                <Breadcrumb title="Chapter Topic" parent="Subject Chapter" parentLink={createLink('/subject-chapter-management/:id', { id: this.props.subjectChapter })} isParentShow={true} />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{"Chapter Topic"}</h5>
                                </div>
                                <div className="card-body">
                                    <div className="card-header">
                                        <Button color="primary" onClick={this.openModalToggle}>Add Topic</Button>
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
                                                                    <label className="col-form-label pt-0" htmlFor="topic">{"Topic"}</label>
                                                                    <input className="form-control" id="topic" type="text" aria-describedby="topic" value={this.state.topic} onChange={e => this.handleChange({ topic: e.target.value })} placeholder="Topic" />
                                                                    <span>{this.state.isSubmited && !this.state.topic && 'Topic is required'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col-12">
                                                                    <label className="col-form-label pt-0" htmlFor="topic">{"Description"}</label>
                                                                    <textarea className="form-control" rows="5" cols="12" id="description" placeholder="description" onChange={e => this.handleChange({ description: e.target.value })}>{this.state.description}</textarea>
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

                                    <div className="card-body datatable-react">

                                        <DataTable
                                            columns={openDataColumns}
                                            data={this.state.chapterTopics}
                                            striped={true}
                                            pagination
                                            persistTableHead
                                            responsive={true}
                                        />
                                    </div>
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
        id: params.match.params.id,
        subjectChapter: params.match.params.subjectChapter
    };
};

const mapDispatchToProps = (dispatch, params) => ({

});
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ChapterTopic));