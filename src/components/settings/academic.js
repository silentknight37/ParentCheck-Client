import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import DataTable from 'react-data-table-component'
import { Card, CardBody } from 'reactstrap'
import { handleResponse, authHeader } from "../../services/service.backend";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import CKEditors from "react-ckeditor-component";
import { Link } from 'react-router-dom';
import * as moment from 'moment';
import DatePicker from "react-datepicker";
class Academic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            yearAcademic: null,
            fromDate: null,
            toDate: null,
            isActive: true,
            isSubmited: false,
            isValidSubmit: false,
            iconWithTab: '1',
            academicYear: [],
            isTemplateEditorOpen: false,
            isEdit: false
        };
    }

    componentDidMount = async () => {
        await this.getTemplate();
    }

    getTemplate = async () => {
        const academicYearList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`setting/getAcademicYear`, requestOptions)
            .then(handleResponse)
            .then(response => {
                response.academics.map(i =>
                    academicYearList.push({ id: i.id, yearAcademic: i.yearAcademic, fromDate: new Date(i.fromDate).toDateString(), fromDateFormated: i.fromDateFormated, toDate: new Date(i.toDate).toDateString(), toDateFormated: i.toDateFormated, isActive: i.isActive ? "True" : "False", action: <Link className="btn btn-light" onClick={() => this.selectedTemplate(i)}><i className="icofont icofont-ui-edit"></i></Link> })
                )
                this.setState({
                    academicYear: academicYearList,
                });
            });
    }

    selectedTemplate = (data) => {
        this.setState({
            id: data.id,
            yearAcademic: data.yearAcademic,
            fromDate: new Date(data.fromDate),
            toDate: new Date(data.toDate),
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
            await fetch("setting/saveAcademicYear", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json",
                    "Authorization": `Bearer ${currentUser}`
                },
                "body": JSON.stringify({
                    id: this.state.id,
                    yearAcademic: +this.state.yearAcademic,
                    fromDate:moment(this.state.fromDate).format('DD/MM/yyyy'),
                    toDate:moment(this.state.toDate).format('DD/MM/yyyy'),
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
        if (this.state.yearAcademic === null || this.state.yearAcademic === "") {
            return false;
        }

        if (this.state.fromDate === null || this.state.fromDate === "" || new Date(this.state.fromDate) > new Date("9999/12/31")) {
            return false;
        }

        if (this.state.toDate === null || this.state.toDate === "" || new Date(this.state.toDate) > new Date("9999/12/31")) {
            return false;
        }

        if (new Date(this.state.toDate).getTime() < new Date(this.state.fromDate).getTime()) {
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
                name: 'Year Academic',
                selector: 'yearAcademic',
                sortable: true
            },
            {
                name: 'From Date',
                selector: 'fromDateFormated',
                sortable: true,
                wrap: true
            },
            {
                name: 'To Date',
                selector: 'toDateFormated',
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
                <Breadcrumb title="Academic Year" parent="Academic Year" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{"Academic Year"}</h5>
                                </div>
                                <div className="card-body">
                                    <div className="card-header">
                                        <Button color="primary" onClick={this.openModalToggle}>Add Academic Year</Button>
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
                                                                    <label className="col-form-label pt-0" htmlFor="yearAcademic">{"Academic Year"}</label>
                                                                    <input className="form-control" id="yearAcademic" type="number" aria-describedby="yearAcademic" value={this.state.yearAcademic} onChange={e => this.handleChange({ yearAcademic: e.target.value })} placeholder="Academic Year" />
                                                                    <span>{this.state.isSubmited && !this.state.yearAcademic && 'Academic Year is required'}</span>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <div className="form-row">
                                                                    <div className="form-group">
                                                                        <label className="col-form-label pt-0" htmlFor="fromDate">{"From Date"}</label>
                                                                        <DatePicker className="form-control" showYearDropdown={true} scrollableYearDropdown={true} dateFormat="dd/MM/yyyy" selected={this.state.fromDate} onChange={e => this.handleChange({ fromDate: e })} />
                                                                        <span style={{ color: "#ff5370" }}>{this.state.isSubmited && !this.state.fromDate && 'From Date is required'}</span>
                                                                        <span style={{ color: "#ff5370" }}>{this.state.isSubmited && this.state.fromDate && new Date(this.state.fromDate) > new Date("9999/12/31") && 'Invalid Date'}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="form-row">
                                                                    <div className="form-group">
                                                                        <label className="col-form-label pt-0" htmlFor="toDate">{"To Date"}</label>
                                                                        <DatePicker className="form-control" showYearDropdown={true} scrollableYearDropdown={true} dateFormat="dd/MM/yyyy" selected={this.state.toDate} onChange={e => this.handleChange({ toDate: e })} />
                                                                        <span style={{ color: "#ff5370" }}>{this.state.isSubmited && !this.state.toDate && 'To Date is required'}</span>
                                                                        <span style={{ color: "#ff5370" }}>{this.state.isSubmited && this.state.toDate && !this.state.fromDate && 'From Date select first'}</span>
                                                                        <span style={{ color: "#ff5370" }}>{this.state.isSubmited && this.state.toDate && this.state.toDate < this.state.fromDate && 'From Date less than To Date'}</span>
                                                                        <span style={{ color: "#ff5370" }}>{this.state.isSubmited && this.state.fromDate && this.state.toDate && new Date(this.state.toDate) > new Date("9999/12/31") && 'Invalid Date'}</span>
                                                                    </div>
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
                                        data={this.state.academicYear}
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

export default Academic;