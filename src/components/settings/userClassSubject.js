import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import DataTable from 'react-data-table-component'
import { handleResponse, authHeader } from "../../services/service.backend";
import { Link } from 'react-router-dom';
import { UncontrolledTooltip } from 'reactstrap';
import createLink from '../../helpers/createLink';
class UserClassSubject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            associateClasses: [],
        };
    }

    componentDidMount = async () => {
        await this.getClasses();
    }

    getClasses = async () => {
        const associateClassList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`setting/getAssociateClass`, requestOptions)
            .then(handleResponse)
            .then(response => {
                response.associateClasses.map(i =>
                    associateClassList.push({
                        id: i.id, associateClass: i.associateClass, subject: i.subject
                        , action: 
                        <div>
                            <Link className="btn btn-light" id="btn_time_table" to={createLink('/subject-chapter-management/:id', { id: i.id })}><i className="icofont icofont-book-alt"></i></Link>
                            <UncontrolledTooltip placement="top" target="btn_time_table">
                                {"Subject Chapter"}
                            </UncontrolledTooltip>
                        </div>
                    })
                )
                this.setState({
                    associateClasses: associateClassList,
                });
            });
    }


    render() {


        const openDataColumns = [
            {
                name: 'Class',
                selector: 'associateClass',
                sortable: true
            },
            {
                name: 'Subject',
                selector: 'subject',
                sortable: true
            },
            {
                name: 'Action',
                selector: 'action',
                center: true
            }
        ];

        return (
            <Fragment>
                <Breadcrumb title="Associate Classes Subject" parent="Associate Classes Subject" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{"Associate Classes Subject"}</h5>
                                </div>
                                <div className="card-body">
                                    <DataTable
                                        columns={openDataColumns}
                                        data={this.state.associateClasses}
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

export default UserClassSubject;