import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import DataTable from 'react-data-table-component'
import { Card, CardBody } from 'reactstrap'
import { handleResponse,authHeader } from "../../services/service.backend";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
class InvoiceType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id:0,
            invoiceType: null,
            terms: false,
            isActive: true,
            isSubmited: false,
            isValidSubmit: false,
            iconWithTab: '1',
            invoiceTypes: [],
            isInvoiceTypeEditorOpen: false,
        };
    }

    componentDidMount = async () => {
        await this.getInvoiceType();
    }

    getInvoiceType = async () => {
        const invoiceTypesList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`payment/getInvoiceTypes`,requestOptions)
            .then(handleResponse)
            .then(response => {
                response.invoiceTypes.map(i =>
                    invoiceTypesList.push({ id: i.id, invoiceType: i.invoiceType, terms: i.terms, isActive: i.isActive?"True":"False",action:<Link className="btn btn-light" onClick={()=>this.selectedInvoiceType(i)}><i className="icofont icofont-ui-note"></i></Link> })
                )
                this.setState({
                    invoiceTypes: invoiceTypesList,
                });
            });
    }

    selectedInvoiceType=(data)=>{
        this.setState({
            id:data.id,
            invoiceType: data.invoiceType,
            terms:data.terms,
            isActive:data.isActive
        });

        this.openModalToggle();
    }
    submitSMS = async (e) => {
        e.preventDefault();
        this.setState({
            isSubmited: true
        });
        if (this.validate()) {
            const currentUser = localStorage.getItem('token');
            await fetch("payment/saveInvoiceType", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json",
                    "Authorization": `Bearer ${currentUser}`
                },
                "body": JSON.stringify({
                    id:this.state.id,
                    typeText: this.state.invoiceType,
                    terms: parseInt(this.state.terms),
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

                    await this.getInvoiceType();

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
        if (this.state.invoiceType === null || this.state.invoiceType === "") {
            return false;
        }

        if (this.state.terms === null || this.state.terms === "") {
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
                name: 'Invoice Type',
                selector: 'invoiceType',
                sortable: true
            },
            {
                name: 'Terms',
                selector: 'terms',
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
                <Breadcrumb title="Invoice Type" parent="Invoice Type" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{"Invoice Type"}</h5>
                                </div>
                                <div className="card-body">
                                    <div className="card-header">
                                        <Button color="primary" onClick={this.openModalToggle}>Add Invoice Type</Button>
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
                                                                    <input className="form-control" id="invoiceType" type="text" aria-describedby="invoiceType" value={this.state.invoiceType} onChange={e => this.handleChange({ invoiceType: e.target.value })} placeholder="Name" />
                                                                    <span>{this.state.isSubmited && !this.state.invoiceType && 'name is required'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col-12">
                                                                    <label className="col-form-label pt-0" htmlFor="name">{"Terms"}</label>
                                                                    <input className="form-control" id="terms" type="number" min="0" max="12" aria-describedby="terms" value={this.state.terms} onChange={e => this.handleChange({ terms: e.target.value })} placeholder="Number Of Terms" />
                                                                    <span>{this.state.isSubmited && !this.state.terms && 'terms is required'}</span>
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
                            </div>
                            <div className="card-body datatable-react">
                                <Card>
                                    <CardBody>
                                        <DataTable
                                            columns={openDataColumns}
                                            data={this.state.invoiceTypes}
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
            </Fragment>
        );
    }
};

export default InvoiceType;