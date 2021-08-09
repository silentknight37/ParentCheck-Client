import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import DataTable from 'react-data-table-component'
import { Card, CardBody } from 'reactstrap'
import { handleResponse,authHeader } from "../../services/service.backend";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import createLink from '../../helpers/createLink';
import { Link } from 'react-router-dom';
import { Typeahead } from 'react-bootstrap-typeahead';
class GenerateInvoices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            invoiceTitle: null,
            invoiceDetails: null,
            invoiceAmount: null,
            invoiceTypeId: null,
            dueDate: null,
            invoiceDate: null,
            isSubmited: false,
            isValidSubmit: false,
            iconWithTab: '1',
            invoices: [],
            isInvoiceTypeEditorOpen: false,
            isGroup: false,
            searchUser: null,
            toUsers: [],
            toGroups: [],
            userContact: [],
            invoiceType: []
        };
    }

    componentDidMount = async () => {
        await this.getGeneratedInvoice();
        await this.getToUsers();
        await this.getInvoiceType(6);
    }

    getGeneratedInvoice = async () => {
        const invoicesList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`payment/getGeneratedInvoices`,requestOptions)
            .then(handleResponse)
            .then(response => {
                response.invoices.map(i =>
                    invoicesList.push({ id: i.id, invoiceNo: i.invoiceNo, invoiceDate: new Date(i.invoiceDate).toDateString(), dueDate: new Date(i.dueDate).toDateString(), invoiceAmount: i.invoiceAmount, invoiceTitle: i.invoiceTitle, invoiceDetails: i.invoiceDetails, status: i.status, invoiceType: i.invoiceType, action: <Link className="btn btn-light" to={createLink('/payment/generate-invoice/:id', { id: i.id })}><i className="icofont icofont-ui-note"></i></Link> })
                )
                this.setState({
                    invoices: invoicesList,
                });
            });
    }

    getInvoiceType = async (id) => {
        const invoiceTypeList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`reference/getReference?id=${id}`,requestOptions)
            .then(handleResponse)
            .then(response => {

                response.references.map(i =>
                    invoiceTypeList.push({ id: i.id, value: i.value })
                )
                this.setState({
                    invoiceType: invoiceTypeList,
                });
            });
    }

    getToUsers = async () => {
        const userContactList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`reference/getAllUserContacts?sendType=${2}`,requestOptions)
            .then(handleResponse)
            .then(response => {
                response.userContacts.map(i =>
                    userContactList.push({ id: i.id, fullName: i.fullName, email: i.email, mobile: i.mobile })
                )
                this.setState({
                    userContact: userContactList,
                });
            });
    }

    getToGroups = async () => {
        const groupList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`reference/getReference?id=${3}`,requestOptions)
            .then(handleResponse)
            .then(response => {

                response.references.map(i =>
                    groupList.push({ id: i.id, value: i.value })
                )
                this.setState({
                    userContact: groupList,
                });
            });
    }

    handleRadioChange = async (changeObject, getType) => {
        if (!getType) {
            await this.getToUsers();
        }
        else if (getType) {
            await this.getToGroups();
        }
        this.setState(changeObject);
    }

    handleToChange(e) {
        if (!this.state.isGroup) {
            this.setState({
                toUsers: e["e"]
            });
        }
        else if (this.state.isGroup) {
            this.setState({
                toGroups: e["e"]
            });
        }

        this.setState({
            isSubmited: false
        });
    }
   
    submitInvoice = async (e) => {
        e.preventDefault();
        this.setState({
            isSubmited: true
        });
        if (this.validate()) {
            const currentUser = localStorage.getItem('token');
            await fetch("payment/generateInvoice", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json",
                    "Authorization": `Bearer ${currentUser}`
                },
                "body": JSON.stringify({
                    invoiceTitle: this.state.invoiceTitle,
                    invoiceDetails: this.state.invoiceDetails,
                    toUsers: this.state.toUsers,
                    toGroups: this.state.toGroups,
                    isGroup: this.state.isGroup,
                    dueDate: this.state.dueDate,
                    invoiceDate: this.state.invoiceDate,
                    invoiceAmount: parseFloat(this.state.invoiceAmount),
                    invoiceTypeId: parseInt(this.state.invoiceTypeId),
                })
            })
                .then(response => response.json())
                .then(async (response) => {

                    if (!response.Value.Created) {
                        toast.error(response.Value.Error.Message)
                        return;
                    }

                    toast.success(response.Value.SuccessMessage)

                    await this.getGeneratedInvoice();

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
        if (this.state.invoiceTitle === null || this.state.invoiceTitle === "") {
            return false;
        }

        if (this.state.invoiceDetails === null || this.state.invoiceDetails === "") {
            return false;
        }

        if (this.state.invoiceTypeId === null || this.state.invoiceTypeId === "") {
            return false;
        }

        if (this.state.invoiceAmount === null || this.state.invoiceAmount === "") {
            return false;
        }

        if (this.state.dueDate === null || this.state.dueDate === "") {
            return false;
        }

        if (this.state.invoiceDate === null || this.state.invoiceDate === "") {
            return false;
        }

        if (this.state.invoiceAmount === null || this.state.invoiceAmount === "") {
            return false;
        }

        if (new Date(this.state.dueDate).getTime() < new Date(this.state.invoiceDate).getTime()) {
            return false;
        }

        if (this.state.toUsers.length === 0 && this.state.toGroups.length === 0) {
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
        const invoiceTypeList = [];
        this.state.invoiceType.forEach(refVal => {
            invoiceTypeList.push(
                this.handleSelectOptions(
                    refVal
                )
            );
        });

        const openDataColumns = [
            {
                name: 'Invoice No',
                selector: 'invoiceNo',
                sortable: true
            },
            {
                name: 'Invoice Date',
                selector: 'invoiceDate',
                sortable: true,
                wrap: true
            },
            {
                name: 'Due Date',
                selector: 'dueDate',
                sortable: true,
                wrap: true
            },
            {
                name: 'Invoice Title',
                selector: 'invoiceTitle',
                sortable: true,
                wrap: true
            },
            {
                name: 'Status',
                selector: 'status',
                sortable: true,
                wrap: true
            },
            {
                name: 'Invoice Type',
                selector: 'invoiceType',
                sortable: true,
                wrap: true
            },
            {
                name: 'Invoice Amount',
                selector: 'invoiceAmount',
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
                <Breadcrumb title="Invoice" parent="Invoice" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{"Invoice"}</h5>
                                </div>
                                <div className="card-body">
                                    <div className="card-header">
                                        <Button color="primary" onClick={this.openModalToggle}>Add Invoice</Button>
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
                                                                <div className="form-group m-t-15 m-checkbox-inline mb-0 ml-1">

                                                                    <label htmlFor="edo-ani">
                                                                        <input className="radio_animated" id="edo-ani" type="radio" name="rdo-ani" defaultChecked onChange={e => this.handleRadioChange({ isGroup: false }, false)} />
                                                                        {Option} {"To Users"}
                                                                    </label>
                                                                    <label htmlFor="edo-ani1">
                                                                        <input className="radio_animated" id="edo-ani1" type="radio" name="rdo-ani" onChange={e => this.handleRadioChange({ isGroup: true }, true)} />
                                                                        {Option} {"To Group"}
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col-12">
                                                                    {!this.state.isGroup && (
                                                                        <Typeahead
                                                                            id="multiple-typeahead"
                                                                            labelKey="fullName"
                                                                            multiple
                                                                            options={this.state.userContact}
                                                                            placeholder="Choose a users..."
                                                                            onChange={e => this.handleToChange({ e })}
                                                                        />
                                                                    )}
                                                                    {this.state.isGroup && (
                                                                        <Typeahead
                                                                            id="multiple-typeahead"
                                                                            labelKey="value"
                                                                            multiple
                                                                            options={this.state.userContact}
                                                                            placeholder="Choose a users..."
                                                                            onChange={e => this.handleToChange({ e })}
                                                                        />
                                                                    )}
                                                                    <span style={{ color: "#ff5370" }}>{this.state.isSubmited && (this.state.toUsers.length === 0 && this.state.toGroups.length === 0) && 'Sending participant is required'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col-6">
                                                                    <label className="col-form-label pt-0" htmlFor="invoiceDate">{"Invoice Date"}</label>
                                                                    <input className="form-control" id="invoiceDate" onChange={e => this.handleChange({ invoiceDate: e.target.value })} type="datetime-local" aria-describedby="invoiceDate" placeholder="Enter Invoice Date" />
                                                                    <span>{this.state.isSubmited && !this.state.invoiceDate && 'Invoice Date is required'}</span>
                                                                </div>
                                                                <div className="form-group col-6">
                                                                    <label className="col-form-label pt-0" htmlFor="dueDate">{"To Date"}</label>
                                                                    <input className="form-control" id="dueDate" type="datetime-local" aria-describedby="dueDate" onChange={e => this.handleChange({ dueDate: e.target.value })} placeholder="Enter Due Date" />
                                                                    <span>{this.state.isSubmited && !this.state.dueDate && 'Due Date is required'}</span>
                                                                    <span>{this.state.isSubmited && this.state.dueDate && !this.state.invoiceDate && 'Invoice Date select first'}</span>
                                                                    <span>{this.state.isSubmited && this.state.dueDate < this.state.invoiceDate && 'Invoice Date less than Due Date'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col-6">
                                                                    <label htmlFor="exampleFormControlSelect9">{'Invoice Type'}</label>
                                                                    <select onChange={e => this.handleChange({ invoiceTypeId: e.target.value })} className="form-control digits" defaultValue="0">
                                                                        <option value={0}>All</option>
                                                                        {invoiceTypeList}
                                                                    </select>
                                                                    <span style={{ color: "#ff5370" }}>{this.state.isSubmited && !this.state.invoiceTypeId && 'Invoice Type is required'}</span>
                                                                </div>
                                                                <div className="form-group col-6">
                                                                    <label htmlFor="exampleFormControlSelect9">{'Invoice Amount'}</label>
                                                                    <input className="form-control" id="invoiceAmount" type="number" aria-describedby="invoiceAmount" step="0.01" pattern="^\d*(\.\d{0,2})?$" min="0" onChange={e => this.handleChange({ invoiceAmount: e.target.value })} placeholder="Invoice Amount" />
                                                                    <span style={{ color: "#ff5370" }}>{this.state.isSubmited && !this.state.invoiceAmount && 'Invoice Amount is required'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col-12">
                                                                    <label className="col-form-label pt-0" htmlFor="invoiceTitle">{"Invoice Title"}</label>
                                                                    <input className="form-control" id="invoiceTitle" type="text" aria-describedby="invoiceTitle" onChange={e => this.handleChange({ invoiceTitle: e.target.value })} placeholder="Invoice Title" />
                                                                    <span>{this.state.isSubmited && !this.state.invoiceTitle && 'Invoice Title is required'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col-12">
                                                                    <label className="col-form-label pt-0" htmlFor="invoiceDetails">{"Invoice Details"}</label>
                                                                    <textarea className="form-control" rows="5" cols="12" id="invoiceDetails" placeholder="Invoice Details" onChange={e => this.handleChange({ invoiceDetails: e.target.value })}></textarea>
                                                                    <span>{this.state.isSubmited && !this.state.invoiceDetails && 'Invoice Details is required'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </ModalBody>
                                            <ModalFooter>
                                                <button className="btn btn-primary mr-1" disabled={this.state.isSubmited && this.state.isValidSubmit} type="button" onClick={(e) => this.submitInvoice(e)}>{'Submit'}</button>
                                            </ModalFooter>
                                        </Modal>
                                    }

                                </div>
                                <div className="card-body datatable-react">
                                    <Card>
                                        <CardBody>
                                            <DataTable
                                                columns={openDataColumns}
                                                data={this.state.invoices}
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

export default GenerateInvoices;