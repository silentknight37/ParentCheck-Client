import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import DataTable from 'react-data-table-component'
import { Card, CardBody } from 'reactstrap'
import { handleResponse,authHeader } from "../../services/service.backend";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import createLink from '../../helpers/createLink';
import { Link } from 'react-router-dom';
class Invoices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            Invoice: null,
            terms: false,
            isActive: true,
            isSubmited: false,
            isValidSubmit: false,
            iconWithTab: '1',
            invoices: [],
            isInvoiceEditorOpen: false,
        };
    }

    componentDidMount = async () => {
        await this.getInvoice();
    }

    getInvoice = async () => {
        const invoicesList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`payment/getUserInvoices`,requestOptions)
            .then(handleResponse)
            .then(response => {
                response.invoices.map(i =>
                    invoicesList.push({ id: i.id, invoiceNo: i.invoiceNo, invoiceDate: new Date(i.invoiceDate).toDateString(), dueDate: new Date(i.dueDate).toDateString(), invoiceAmount: i.invoiceAmount, invoiceTitle: i.invoiceTitle, invoiceDetails: i.invoiceDetails, status: i.status, invoiceType: i.invoiceType, action: <Link className="btn btn-light" to={createLink('/payment/invoice/:id', { id: i.id })}><i className="icofont icofont-ui-note"></i></Link> })
                )
                this.setState({
                    invoices: invoicesList,
                });
            });
    }

    render() {
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
                <Breadcrumb title="Invoices" parent="Invoices" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{"Invoices"}</h5>
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

export default Invoices;