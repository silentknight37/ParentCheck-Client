import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import DataTable from 'react-data-table-component'
import { handleResponse, authHeader } from "../../services/service.backend";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { wrap } from 'lodash';
class Subject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            subject: null,
            descriptionText: null,
            isActive: true,
            isSubmited: false,
            isValidSubmit: false,
            iconWithTab: '1',
            subjects: [],
            isTemplateEditorOpen: false,
            isEdit: false
        };
    }

    componentDidMount = async () => {
        await this.getSubject();
    }

    getSubject = async () => {
        const subjectList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`setting/getSubject`, requestOptions)
            .then(handleResponse)
            .then(response => {
                response.subjects.map(i =>
                    subjectList.push({ id: i.id, subject: i.subject, descriptionText: i.descriptionText, isActive: i.isActive ? "True" : "False", action: <Link className="btn btn-light" onClick={() => this.selectedTemplate(i)}><i className="icofont icofont-ui-edit"></i></Link> })
                )
                this.setState({
                    subjects: subjectList,
                });
            });
    }

    selectedTemplate = (data) => {
        this.setState({
            id: data.id,
            subject: data.subject,
            descriptionText: data.descriptionText,
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
            await fetch("setting/saveSubject", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json",
                    "Authorization": `Bearer ${currentUser}`
                },
                "body": JSON.stringify({
                    id: this.state.id,
                    subject: this.state.subject,
                    descriptionText: this.state.descriptionText,
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

                    await this.getSubject();

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
            isEdit: false
        });
    }

    handleChange(changeObject) {
        this.setState(changeObject);
        this.setState({
            isSubmited: false
        });
    }


    validate = () => {
        if (this.state.subject === null || this.state.subject === "") {
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
                name: 'Subject',
                selector: 'subject',
                sortable: true,
                wrap: true
            },
            {
                name: 'Description',
                selector: 'descriptionText',
                sortable: true,
                width:"600px",
                wrap:true
            },
            {
                name: 'Active',
                selector: 'isActive',
                sortable: true,
                wrap: true
            },
            {
                name: 'Action',
                selector: 'action'
            }
        ];

        return (
            <Fragment>
                <Breadcrumb title="Subject" parent="Subject" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{"Subject"}</h5>
                                </div>
                                <div className="card-body">
                                    <div className="card-header">
                                        <Button color="primary" onClick={this.openModalToggle}>Add Subject</Button>
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
                                                                    <label className="col-form-label pt-0" htmlFor="subject">{"Subject"}</label>
                                                                    <input className="form-control" id="subject" type="text" aria-describedby="subject" value={this.state.subject} onChange={e => this.handleChange({ subject: e.target.value })} placeholder="Subject" />
                                                                    <span>{this.state.isSubmited && !this.state.subject && 'Subject is required'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col-12">
                                                                    <label className="col-form-label pt-0" htmlFor="descriptionText">{"Description"}</label>
                                                                    <textarea className="form-control" rows="5" cols="12" id="descriptionText" value={this.state.descriptionText} placeholder="Description" onChange={e => this.handleChange({ descriptionText: e.target.value })}></textarea>
                                                                    <span>{this.state.isSubmited && !this.state.descriptionText && 'Description is required'}</span>
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
                                        data={this.state.subjects}
                                        striped={true}
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

export default Subject;