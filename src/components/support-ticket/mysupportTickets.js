import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import DataTable from 'react-data-table-component'
import { supportDB,supportColumns } from '../../data/support-ticket';
const MySupportTickets = () => {
    
    return (
        <Fragment>
            <Breadcrumb title="Support Ticket" parent="Support Ticket" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header">
                                <h5>{"Support Ticket List"}</h5>
                                <span>{"List of ticket opend by customers"}</span>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive support-table">
                                    <DataTable
                                            columns={supportColumns}
                                            data={supportDB}
                                            striped={true}
                                            center={true}
                                            pagination
                                        />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default MySupportTickets;