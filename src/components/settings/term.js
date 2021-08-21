import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import DataTable from 'react-data-table-component'
import { Card, CardBody } from 'reactstrap'
import { handleResponse, authHeader } from "../../services/service.backend";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
class Term extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            yearAcademic: null,
            term: null,
            fromDate: null,
            toDate: null,
            isActive: true,
            isSubmited: false,
            isValidSubmit: false,
            iconWithTab: '1',
            academicTerms: [],
            isTemplateEditorOpen: false,
            isEdit: false,
            yearAcademics: []
        };
    }

    componentDidMount = async () => {
        await this.getTerm();
        await this.getYearAcademics(8)
    }

    getTerm = async () => {
        const academicTermList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`setting/getAcademicTerm`, requestOptions)
            .then(handleResponse)
            .then(response => {
                response.academicTerms.map(i =>
                    academicTermList.push({ id: i.id, term: i.term, yearAcademicId:i.yearAcademicId,yearAcademic: i.yearAcademic,fromDateFormated:i.fromDateFormated, fromDate: new Date(i.fromDate).toDateString(), toDateFormated:i.toDateFormated,toDate: new Date(i.toDate).toDateString(), isActive: i.isActive ? "True" : "False", action: <Link className="btn btn-light" onClick={() => this.selectedTemplate(i)}><i className="icofont icofont-ui-edit"></i></Link> })
                )
                this.setState({
                    academicTerms: academicTermList,
                });
            });
    }

    getYearAcademics = async (id) => {
        const yearAcademicsList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`reference/getReference?id=${id}`, requestOptions)
            .then(handleResponse)
            .then(response => {

                response.references.map(i =>
                    yearAcademicsList.push({ id: i.id, value: i.value })
                )
                this.setState({
                    yearAcademics: yearAcademicsList,
                });
            });
    }

    selectedTemplate = (data) => {
        this.setState({
            id: data.id,
            term: data.term,
            yearAcademic: data.yearAcademicId,
            fromDate: data.fromDate,
            toDate: data.toDate,
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
            await fetch("setting/saveAcademicTerm", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json",
                    "Authorization": `Bearer ${currentUser}`
                },
                "body": JSON.stringify({
                    id: this.state.id,
                    term: this.state.term,
                    yearAcademic: +this.state.yearAcademic,
                    fromDate: this.state.fromDate,
                    toDate: this.state.toDate,
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

                    await this.getTerm();

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

        if (this.state.term === null || this.state.term === "") {
            return false;
        }

        if (this.state.fromDate === null || this.state.fromDate === "") {
            return false;
        }

        if (this.state.toDate === null || this.state.toDate === "") {
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

    handleSelectOptions = (refVal) => {
        return (
            <option value={refVal.id}>{refVal.value}</option>
        );
    }

    render() {

        const yearAcademicList = [];
        this.state.yearAcademics.forEach(refVal => {
            yearAcademicList.push(
                this.handleSelectOptions(
                    refVal
                )
            );
        });

        const openDataColumns = [
            {
                name: 'Academic Year',
                selector: 'yearAcademic',
                sortable: true
            },
            {
                name: 'Term',
                selector: 'term',
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
                <Breadcrumb title="Academic Term" parent="Academic Term" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{"Academic Term"}</h5>
                                </div>
                                <div className="card-body">
                                    <div className="card-header">
                                        <Button color="primary" onClick={this.openModalToggle}>Add Academic Term</Button>
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
                                                                    <label className="col-form-label pt-0" htmlFor="term">{"Academic Term"}</label>
                                                                    <input className="form-control" id="term" type="text" aria-describedby="term" value={this.state.term} onChange={e => this.handleChange({ term: e.target.value })} placeholder="Academic Term" />
                                                                    <span>{this.state.isSubmited && !this.state.term && 'Academic Term is required'}</span>
                                                                </div>
                                                            </div>
                                                                <div>
                                                                    <div className="form-row">
                                                                        <div className="form-group col-12">
                                                                            <label className="col-form-label pt-0" htmlFor="yearAcademic">{"Academic Year"}</label>
                                                                            <select onChange={e => this.handleChange({ yearAcademic: e.target.value })} className="form-control digits" defaultValue={this.state.yearAcademic}>
                                                                                <option value={0}>All</option>
                                                                                {yearAcademicList}
                                                                            </select>
                                                                            <span style={{ color: "#ff5370" }}>{this.state.isSubmited && !this.state.yearAcademic && 'Academic Year is required'}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="form-row">
                                                                        <div className="form-group">
                                                                            <label className="col-form-label pt-0" htmlFor="fromDate">{"From Date"}</label>
                                                                            <input className="form-control" id="fromDate" onChange={e => this.handleChange({ fromDate: e.target.value })} type="date" aria-describedby="fromDate" defaultValue={this.state.fromDate==null?"":new Date(this.state.fromDate).toISOString().substr(0,10)}  />
                                                                            <span>{this.state.isSubmited && !this.state.fromDate && 'From Date is required'}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="form-row">
                                                                        <div className="form-group">
                                                                            <label className="col-form-label pt-0" htmlFor="toDate">{"To Date"}</label>
                                                                            <input className="form-control" id="toDate" type="date" aria-describedby="toDate" onChange={e => this.handleChange({ toDate: e.target.value })} defaultValue={this.state.toDate==null?"":new Date(this.state.toDate).toISOString().substr(0,10)}  />
                                                                            <span>{this.state.isSubmited && !this.state.toDate && 'To Date is required'}</span>
                                                                            <span>{this.state.isSubmited && this.state.toDate && !this.state.fromDate && 'From Date select first'}</span>
                                                                            <span>{this.state.isSubmited && this.state.toDate < this.state.fromDate && 'From Date less than To Date'}</span>
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
                                        data={this.state.academicTerms}
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

export default Term;