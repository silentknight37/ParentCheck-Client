import React, { Fragment } from 'react';
import Breadcrumb from '../../common/breadcrumb';
import DataTable from 'react-data-table-component'
import { Card, CardBody } from 'reactstrap'
import { handleResponse,authHeader } from "../../../services/service.backend";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import CKEditors from "react-ckeditor-component";
import { Link } from 'react-router-dom';
class Template extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            name: null,
            isSenderTemplate: false,
            isActive: true,
            isSubmited: false,
            isValidSubmit: false,
            iconWithTab: '1',
            templates: [],
            isTemplateEditorOpen: false,
        };
    }

    componentDidMount = async () => {
        await this.getTemplate();
    }

    getTemplate = async () => {
        const templatesList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`communication/getAllCommunicationTemplate`,requestOptions)
            .then(handleResponse)
            .then(response => {
                response.templates.map(i =>
                    templatesList.push({ id: i.id, name: i.name, content: i.content, isSenderTemplate: i.isSenderTemplate ? "True" : "False", isActive: i.isActive ? "True" : "False", action: <Link className="btn btn-light" onClick={() => this.selectedTemplate(i)}><i className="icofont icofont-ui-note"></i></Link> })
                )
                this.setState({
                    templates: templatesList,
                });
            });
    }

    selectedTemplate = (data) => {
        this.setState({
            id: data.id,
            name: data.name,
            isSenderTemplate: data.isSenderTemplate,
            isActive: data.isActive
        });

        this.stateText.value = data.content;
        this.openModalToggle();
    }
    submitSMS = async (e) => {
        e.preventDefault();
        this.setState({
            isSubmited: true
        });

        if (this.validate()) {
            const currentUser = localStorage.getItem('token');
            await fetch("communication/saveCommunicationTemplate", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json",
                    "Authorization": `Bearer ${currentUser}`
                },
                "body": JSON.stringify({
                    Id: this.state.id,
                    name: this.state.name,
                    content: this.stateText.value,
                    isSenderTemplate: this.state.isSenderTemplate,
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

                    await this.getTemplate();

                    this.setState({
                        isSubmited: false,
                        isSmsSendOpen: false
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
            isSubmited: false
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

        if (this.stateText.value === null || this.stateText.value === "") {
            return false;
        }

        this.setState({
            isValidSubmit: true
        });

        return true;
    }

    stateText = {
        value: ""
    }

    render() {
        const onChange = (evt) => {
            const newContent = evt.editor.getData();
            if (!(newContent == "" && this.stateText.value == "")) {
                this.stateText.value = newContent;
            }
        }

        const openDataColumns = [
            {
                name: 'Name',
                selector: 'name',
                sortable: true
            },
            {
                name: 'Sender Template',
                selector: 'isSenderTemplate',
                sortable: true,
                wrap: true
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
                <Breadcrumb title="Template" parent="Template" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{"Template"}</h5>
                                </div>
                                <div className="card-body">
                                    <div className="card-header">
                                        <Button color="primary" onClick={this.openModalToggle}>Add Template</Button>
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
                                                                    <label className="col-form-label pt-0" htmlFor="name">{"Name"}</label>
                                                                    <input className="form-control" id="name" type="text" aria-describedby="name" value={this.state.name} onChange={e => this.handleChange({ name: e.target.value })} placeholder="Name" />
                                                                    <span>{this.state.isSubmited && !this.state.name && 'name is required'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col-12">
                                                                    <label className="col-form-label pt-0" htmlFor="content">{"Content"}</label>
                                                                    <CKEditors id="content"
                                                                        content={this.stateText.value}
                                                                        events={{
                                                                            "change": onChange
                                                                        }}
                                                                    />
                                                                    <span style={{ color: "#ff5370" }}>{this.state.isSubmited && !this.stateText.value && 'Name is required'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col-12">
                                                                    <label className="d-block" htmlFor="isSenderTemplate">
                                                                        <input checked={this.state.isSenderTemplate} className="checkbox_animated" id="isSenderTemplate" type="checkbox" onChange={e => this.handleChange({ isSenderTemplate: !this.state.isSenderTemplate })} />
                                                                        {Option} {"Sender Template"}
                                                                    </label>
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
                                                <button className="btn btn-primary mr-1" disabled={this.state.isSubmited && this.state.isValidSubmit} type="button" onClick={(e) => this.submitSMS(e)}>{'Submit'}</button>
                                            </ModalFooter>
                                        </Modal>
                                    }

                                </div>
                                <div className="card-body datatable-react">
                                    <Card>
                                        <CardBody>
                                            <DataTable
                                                columns={openDataColumns}
                                                data={this.state.templates}
                                                striped={true}
                                                pagination
                                                persistTableHead
                                                responsive={true}
                                            />
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
};

export default Template;