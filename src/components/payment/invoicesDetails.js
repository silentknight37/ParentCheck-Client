import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import DataTable from 'react-data-table-component'
import { Card, CardBody } from 'reactstrap'
import { handleResponse,authHeader} from "../../services/service.backend";
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import createLink from '../../helpers/createLink';
import { Link } from 'react-router-dom';
class InvoiceDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            InvoiceDetail: null,
            terms: false,
            isActive: true,
            isSubmited: false,
            isValidSubmit: false,
            iconWithTab: '1',
            invoices: [],
            isInvoiceDetailEditorOpen: false,
        };
    }

    componentDidMount = async () => {
        await this.getInvoiceDetail(this.props.id);
    }

    getInvoiceDetail = async (id) => {
        const invoicesList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`payment/getUserInvoiceDetail?id=${id}`,requestOptions)
            .then(handleResponse)
            .then(response => {

                this.setState({
                    InvoiceDetail: response.invoice,
                });
            });
    }

    render() {

        return this.state.InvoiceDetail && (
            <Fragment>
                <Breadcrumb title="Invoice Details" parent="Invoices" parentLink={createLink('/payment/invoices')} isParentShow={true} />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">

                                </div>
                                <div className="card-body datatable-react">
                                    <Card>
                                        <CardBody>
                                            <h4><b>{"Invoice"}</b></h4>
                                            <hr />
                                            <div className="row">
                                                <div className="col-6">
                                                    <p><b>Invoice No</b> : {this.state.InvoiceDetail.invoiceNo}</p>
                                                    <p><b>Invoiced To</b> : {this.state.InvoiceDetail.invoiceTo}</p>
                                                </div>
                                                <div className="col-6">
                                                    <p><b>Invoice Date</b> : {new Date(this.state.InvoiceDetail.invoiceDate).toDateString()}</p>
                                                    <p><b>Due Date</b> : {new Date(this.state.InvoiceDetail.dueDate).toDateString()}</p>
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <div className="col-12">
                                                    <p>{this.state.InvoiceDetail.invoiceTitle}</p>
                                                    <p>{this.state.InvoiceDetail.invoiceDetails}</p>
                                                    <p><b>Invoice Type</b> :{this.state.InvoiceDetail.invoiceType}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                            <div className="col-6"></div>
                                                <div className="col-6">
                                                    <p><b>Invoice Amount</b> : <span className="f-right">{this.state.InvoiceDetail.invoiceAmount}</span></p>
                                                    <p><b>Due Amount</b> : <span className="f-right">{this.state.InvoiceDetail.dueAmount}</span></p>
                                                    <p><b>Paid Amount</b> : <span className="f-right">{this.state.InvoiceDetail.payAmount}</span></p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-6">
                                                    <p><b>Invoice Status</b> : {this.state.InvoiceDetail.status}</p>
                                                </div>
                                            </div>
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
const mapStateToProps = (state, params) => {
    return {
        id: params.match.params.id
    };
};

const mapDispatchToProps = (dispatch, params) => ({

});
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(InvoiceDetails));