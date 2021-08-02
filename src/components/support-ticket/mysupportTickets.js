import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import DataTable from 'react-data-table-component'
import { Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import { handleResponse } from "../../services/service.backend";
import createLink from '../../helpers/createLink';
import { Link } from 'react-router-dom';

class MySupportTickets extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            iconWithTab: '1',
            openSupportTickets: [],
            closeSupportTickets: [],
            reviewSupportTickets: []
        };
    }

    componentDidMount = async () => {
        await this.getOpenTickets();
        await this.getCloseTickets();
        await this.getReviewTickets();
    }

    getOpenTickets = async () => {
        const supportTicketList = [];

        return fetch(`support/getOpenTickets`)
            .then(handleResponse)
            .then(response => {

                response.supportTickets.map(i =>
                    supportTicketList.push({ id: i.id, subject: i.subject, description: i.description, status: this.getStatus(i.status), openDate: i.openDate, action: <Link className="btn btn-light" to={createLink('/support/detail-ticket/:ticketId', { ticketId: i.id })}><i className="icofont icofont-ui-note"></i></Link> })
                )
                this.setState({
                    openSupportTickets: supportTicketList,
                });
            });
    }

    getStatus = (status) => {
        switch (status) {
            case 'In-Review':
                return (<div className="txt-secondary">{status}</div>);
            case 'In-Progress':
                return (<div className="txt-warning">{status}</div>);
            case 'Close':
                return (<div className="txt-success">{status}</div>);
            default:
                return (<div className="txt-danger">{status}</div>);
        }
    }

    getCloseTickets = async () => {
        const supportTicketList = [];

        return fetch(`support/getCloseTickets`)
            .then(handleResponse)
            .then(response => {

                response.supportTickets.map(i =>
                    supportTicketList.push({ id: i.id, subject: i.subject, description: i.description, status: <div className="txt-success">{i.status}</div>, openDate: i.openDate, closeDate: new Date(i.closeDate).toDateString(), action: <Link className="btn btn-light" to={createLink('/support/detail-ticket/:ticketId', { ticketId: i.id })}><i className="icofont icofont-ui-note"></i></Link> })
                )
                this.setState({
                    closeSupportTickets: supportTicketList,
                });
            });
    }

    getReviewTickets = async () => {
        const supportTicketList = [];

        return fetch(`support/getAssignTickets`)
            .then(handleResponse)
            .then(response => {

                response.supportTickets.map(i =>
                    supportTicketList.push({ id: i.id, subject: i.subject, description: i.description, status: <div className="txt-secondary">{i.status}</div>, openDate: i.openDate, action: <Link className="btn btn-light" to={createLink('/support/detail-ticket/:ticketId', { ticketId: i.id })}><i className="icofont icofont-ui-note"></i></Link> })
                )
                this.setState({
                    reviewSupportTickets: supportTicketList,
                });
            });
    }

    setIconWithTab(tabId) {
        this.setState({
            iconWithTab: tabId
        });
    }

    render() {
        const openDataColumns = [
            {
                name: 'Open Date',
                selector: 'openDate',
                sortable: true
            },
            {
                name: 'Subject',
                selector: 'subject',
                sortable: true
            },
            {
                name: 'Description',
                selector: 'description',
                sortable: true
            },
            {
                name: 'Status',
                selector: 'status',
                sortable: true
            },
            {
                name: 'More Details',
                selector: 'action'
            }
        ];

        const closeDataColumns = [
            {
                name: 'Open Date',
                selector: 'openDate',
                sortable: true
            },
            {
                name: 'Subject',
                selector: 'subject',
                sortable: true
            },
            {
                name: 'Description',
                selector: 'description',
                sortable: true
            },
            {
                name: 'Status',
                selector: 'status',
                sortable: true
            },
            {
                name: 'Close Date',
                selector: 'closeDate',
                sortable: true
            },
            {
                name: 'More Details',
                selector: 'action'
            }
        ];
        return (
            <Fragment>
                <Breadcrumb title="My Tickets" parent="My Tickets" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{"My Tickets"}</h5>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive support-table">
                                        <Card>
                                            <CardBody>
                                                <Nav tabs>
                                                    <NavItem>
                                                        <NavLink href="#javascript" className={this.state.iconWithTab === '1' ? 'active' : ''} onClick={() => this.setIconWithTab('1')}><i className="icofont icofont-ticket"></i>{'Open'}</NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink href="#javascript" className={this.state.iconWithTab === '21' ? 'active' : ''} onClick={() => this.setIconWithTab('2')}><i className="icofont icofont-anchor"></i>{'Assign'}</NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink href="#javascript" className={this.state.iconWithTab === '3' ? 'active' : ''} onClick={() => this.setIconWithTab('3')}><i className="icofont icofont-verification-check"></i>{'Close'}</NavLink>
                                                    </NavItem>
                                                </Nav>
                                                <TabContent activeTab={this.state.iconWithTab}>
                                                    <TabPane className="fade show" tabId="1">
                                                        <DataTable
                                                            columns={openDataColumns}
                                                            data={this.state.openSupportTickets}
                                                            striped={true}
                                                            pagination
                                                        />
                                                    </TabPane>
                                                    <TabPane tabId="2">
                                                        <DataTable
                                                            columns={openDataColumns}
                                                            data={this.state.reviewSupportTickets}
                                                            striped={true}
                                                            pagination
                                                        />
                                                    </TabPane>
                                                    <TabPane tabId="3">
                                                        <DataTable
                                                            columns={closeDataColumns}
                                                            data={this.state.closeSupportTickets}
                                                            striped={true}
                                                            pagination
                                                        />
                                                    </TabPane>
                                                </TabContent>
                                            </CardBody>
                                        </Card>

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

export default MySupportTickets;