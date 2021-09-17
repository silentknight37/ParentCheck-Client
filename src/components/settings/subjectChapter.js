import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import DataTable from 'react-data-table-component'
import { handleResponse, authHeader } from "../../services/service.backend";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { UncontrolledTooltip } from 'reactstrap';
import createLink from '../../helpers/createLink';
class SubjectChapter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            chapter: null,
            isActive: true,
            isSubmited: false,
            isValidSubmit: false,
            iconWithTab: '1',
            associateSubjectChapters: [],
            isTemplateEditorOpen: false,
            isEdit: false,
        };
    }

    componentDidMount = async () => {
        await this.getSubjectChapter(this.props.id);
    }

    getSubjectChapter = async (id) => {
        const associateSubjectChapterList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`setting/getSubjectChapter?subjectId=${id}`, requestOptions)
            .then(handleResponse)
            .then(response => {
                response.associateSubjectChapters.map(i =>
                    associateSubjectChapterList.push({
                        id: i.id, chapter: i.chapter, isAssignmentAssigned: i.isAssignmentAssigned, isActive: i.isActive ? "True" : "False", action: 
                        <div>
                            <Link className="btn btn-light" id="btn_Edit" onClick={() => this.selectedTemplate(i)}><i className="icofont icofont-ui-edit"></i></Link>
                            <UncontrolledTooltip placement="top" target="btn_Edit">
                                {"Edit"}
                            </UncontrolledTooltip>
                            
                            <Link className="btn btn-light" id="btn_time_table" to={createLink('/chapter-topic-management/:subjectChapter/:id', {subjectChapter:this.props.id, id: i.id })}><i className="icofont icofont-book-alt"></i></Link>
                            <UncontrolledTooltip placement="top" target="btn_time_table">
                                {"Chapter Topic"}
                            </UncontrolledTooltip>
                        </div>
                    })
                )
                this.setState({
                    associateSubjectChapters: associateSubjectChapterList,
                });
            });
    }

    selectedTemplate = (data) => {
        this.setState({
            id: data.id,
            chapter: data.chapter,
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
            await fetch("setting/saveSubjectChapter", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json",
                    "Authorization": `Bearer ${currentUser}`
                },
                "body": JSON.stringify({
                    id: this.state.id,
                    chapter: this.state.chapter,
                    subjectId: +this.props.id,
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

                    await this.getSubjectChapter(this.props.id);

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
        if (this.state.chapter === null || this.state.chapter === "") {
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

    render() {

        const openDataColumns = [
            
            {
                name: 'Chapter',
                selector: 'chapter',
                sortable: true
            },
            {
                name: 'Active',
                selector: 'isActive',
                sortable: true,
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
                <Breadcrumb title="Subject Chapter" parent="Associate Classes Subject" parentLink={createLink('/chapter-management')} isParentShow={true}/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{"Subject Chapter"}</h5>
                                </div>
                                <div className="card-body">
                                    <div className="card-header">
                                        <Button color="primary" onClick={this.openModalToggle}>Add Chapter</Button>
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
                                                                    <label className="col-form-label pt-0" htmlFor="chapter">{"Chapter"}</label>
                                                                    <input className="form-control" id="chapter" type="text" aria-describedby="chapter" value={this.state.chapter} onChange={e => this.handleChange({ chapter: e.target.value })} placeholder="Chapter" />
                                                                    <span>{this.state.isSubmited && !this.state.chapter && 'Chapter Class is required'}</span>
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
                                    <DataTable
                                        columns={openDataColumns}
                                        data={this.state.associateSubjectChapters}
                                        striped={true}
                                        pagination
                                        responsive={true}
                                    />
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
      id: params.match.params.id
    };
  };
  
  const mapDispatchToProps = (dispatch, params) => ({
  
  });
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)( SubjectChapter));