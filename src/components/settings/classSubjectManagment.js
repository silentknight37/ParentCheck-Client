import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import DataTable from 'react-data-table-component'
import { handleResponse, authHeader } from "../../services/service.backend";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { UncontrolledTooltip } from 'reactstrap';
import createLink from '../../helpers/createLink';
class ClassSubjectStudentManagment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            subjectId: 0,
            classId: 0,
            responsibleUserId: 0,
            isActive: true,
            isSubmited: false,
            isValidSubmit: false,
            iconWithTab: '1',
            academicClassSubjects: [],
            isTemplateEditorOpen: false,
            isEdit: false,
            subjects: [],
            responsibleUsers: []
        };
    }

    componentDidMount = async () => {
        await this.getClassSubjects(this.props.id);
        await this.getSubjects(12);
        await this.getResponsibleUsers(9);
    }

    getClassSubjects = async (id) => {
        const academicClassSubjectList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`setting/getClassSubject?classId=${id}`, requestOptions)
            .then(handleResponse)
            .then(response => {
                response.academicClassSubjects.map(i =>
                    academicClassSubjectList.push({
                        id: i.id, subject: i.subject,subjectId:i.subjectId, responsibleUserId: i.responsibleUserId, responsibleUser: i.responsibleUser, isActive: i.isActive ? "True" : "False", action:
                        <div>
                            <Link className="btn btn-light" id="btn_Edit" onClick={() => this.selectedTemplate(i)}><i className="icofont icofont-ui-edit"></i></Link>
                            <UncontrolledTooltip placement="top" target="btn_Edit">
                                {"Edit"}
                            </UncontrolledTooltip>
                            
                        </div>
                    })
                )
                this.setState({
                    academicClassSubjects: academicClassSubjectList,
                });
            });
    }

    getResponsibleUsers = async (id) => {
        const responsibleUserList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`reference/getReference?id=${id}`, requestOptions)
            .then(handleResponse)
            .then(response => {

                response.references.map(i =>
                    responsibleUserList.push({ id: i.id, value: i.value })
                )
                this.setState({
                    responsibleUsers: responsibleUserList,
                });
            });
    }

    getSubjects = async (id) => {
        const subjectList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`reference/getReference?id=${id}`, requestOptions)
            .then(handleResponse)
            .then(response => {

                response.references.map(i =>
                    subjectList.push({ id: i.id, value: i.value })
                )
                this.setState({
                    subjects: subjectList,
                });
            });
    }

    selectedTemplate = (data) => {
        this.setState({
            id: data.id,
            subjectId: data.subjectId,
            responsibleUserId: data.responsibleUserId,
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
            await fetch("setting/saveClassSubject", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json",
                    "Authorization": `Bearer ${currentUser}`
                },
                "body": JSON.stringify({
                    id: this.state.id,
                    classId: +this.props.id,
                    subjectId: +this.state.subjectId,
                    responsibleUserId: +this.state.responsibleUserId,
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

                    await this.getClassSubjects(this.props.id);

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
        if (this.state.subjectId === null || this.state.subjectId === "0") {
            return false;
        }

        if (this.state.responsibleUserId === null || this.state.responsibleUserId === "0") {
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

        const subjectList = [];
        this.state.subjects.forEach(refVal => {
            subjectList.push(
                this.handleSelectOptions(
                    refVal
                )
            );
        });

        const responsibleUserList = [];
        this.state.responsibleUsers.forEach(refVal => {
            responsibleUserList.push(
                this.handleSelectOptions(
                    refVal
                )
            );
        });

        const openDataColumns = [
            {
                name: 'Subject',
                selector: 'subject',
                sortable: true
            },
            {
                name: 'Responsible User',
                selector: 'responsibleUser',
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
                selector: 'action',
                center: true
            }
        ];

        return (
            <Fragment>
                <Breadcrumb title="Academic Classes Subjects" parent="Academic Classes" parentLink={createLink('/class-management')} isParentShow={true}/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{"Academic Classes Subjects"}</h5>
                                </div>
                                <div className="card-body">
                                    <div className="card-header">
                                        <Button color="primary" onClick={this.openModalToggle}>Add Academic Subjects</Button>
                                    </div>
                                    {
                                        <Modal isOpen={this.state.isSmsSendOpen} toggle={this.handleModalToggle} size="lg">
                                            <ModalHeader toggle={this.handleModalToggle}>

                                            </ModalHeader>
                                            <ModalBody>
                                                <div className="card-body">
                                                    <form className="theme-form needs-validation" noValidate="">
                                                        <div className="card-body">
                                                            
                                                                <div>
                                                                    <div className="form-row">
                                                                        <div className="form-group col-12">
                                                                            <label className="col-form-label pt-0" htmlFor="subjectId">{"Subject"}</label>
                                                                            <select onChange={e => this.handleChange({ subjectId: e.target.value })} className="form-control digits" defaultValue={this.state.subjectId}>
                                                                                <option value={0}>All</option>
                                                                                {subjectList}
                                                                            </select>
                                                                            <span style={{ color: "#ff5370" }}>{this.state.isSubmited && !this.state.subjectId && 'Subject is required'}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            <div className="form-row">
                                                                <div className="form-group col-12">
                                                                    <label className="col-form-label pt-0" htmlFor="responsibleUserId">{"Responsible User"}</label>
                                                                    <select onChange={e => this.handleChange({ responsibleUserId: e.target.value })} className="form-control digits" defaultValue={this.state.responsibleUserId}>
                                                                        <option value={0}>All</option>
                                                                        {responsibleUserList}
                                                                    </select>
                                                                    <span style={{ color: "#ff5370" }}>{this.state.isSubmited && (!this.state.responsibleUserId || this.state.responsibleUserId == 0) && 'Responsible User is required'}</span>
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
                                        data={this.state.academicClassSubjects}
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
const mapStateToProps = (state, params) => {
    return {
      id: params.match.params.id
    };
  };
  
  const mapDispatchToProps = (dispatch, params) => ({
  
  });
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)( ClassSubjectStudentManagment));