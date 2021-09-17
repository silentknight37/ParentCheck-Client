import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import DataTable from 'react-data-table-component'
import { handleResponse, authHeader } from "../../services/service.backend";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import CKEditors from "react-ckeditor-component";
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { UncontrolledTooltip } from 'reactstrap';
import createLink from '../../helpers/createLink';
import SweetAlert from 'sweetalert2';
const ContentType = {
    Text: 1,
    Video: 2,
    Audio: 3,
    Document: 4,
    Image: 5
}

class TopicContents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            files: null,
            contentText: null,
            contentDocuments: [],
            orderId: null,
            orderNo: 0,
            contentTypeId: 0,
            isActive: true,
            isSubmited: false,
            isValidSubmit: false,
            iconWithTab: '1',
            topicContents: [],
            isTemplateEditorOpen: false,
            isEdit: false,
            selectedRows: null,
            toggleCleared: false
        };
    }

    componentDidMount = async () => {
        await this.getTopicContent(this.props.id);
    }

    getTopicContent = async (id) => {
        const topicContentList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`setting/getTopicContent?topicId=${id}`, requestOptions)
            .then(handleResponse)
            .then(response => {

                response.topicContents.map(i =>
                    topicContentList.push({
                        id: i.id, contentText: i.contentText, contentType: i.contentType, contentDocuments: i.contentDocuments, orderId: i.orderId, isActive: i.isActive ? "True" : "False", action:
                            ContentType.Text != i.contentTypeId
                                ?
                                <div>
                                    <Link className="btn btn-light" id="btn_Edit" onClick={() => this.selectedTemplate(i)}><i className="icofont icofont-ui-edit"></i></Link>
                                    <UncontrolledTooltip placement="top" target="btn_Edit">
                                        {"Edit"}
                                    </UncontrolledTooltip>
                                    <Link className="btn btn-light" id="btn_Upload" onClick={() => this.selectedFile(i)}><i className="icofont icofont-upload-alt"></i></Link>
                                    <UncontrolledTooltip placement="top" target="btn_Upload">
                                        {"Upload Documents"}
                                    </UncontrolledTooltip>
                                </div>
                                :
                                <div>
                                    <Link className="btn btn-light" id="btn_Edit" onClick={() => this.selectedTemplate(i)}><i className="icofont icofont-ui-edit"></i></Link>
                                    <UncontrolledTooltip placement="top" target="btn_Edit">
                                        {"Edit"}
                                    </UncontrolledTooltip>
                                </div>
                    })
                )
                this.setState({
                    topicContents: topicContentList,
                    orderNo: topicContentList.length
                });
            });
    }

    selectedTemplate = (data) => {
        debugger
        this.setState({
            id: data.id,
            contentText: data.contentText,
            contentTypeId: data.contentTypeId,
            orderId:data.orderId,
            isActive: data.isActive,
            isEdit: true
        });
        this.stateRequestFormText.value=data.contentText;
        this.openModalToggle();
    }

    selectedFile = (data) => {

        this.setState({
            id: data.id,
            contentDocuments: data.contentDocuments,
            isEdit: true
        });
        this.openFileModalToggle();
    }

    getFile = async() => {
        await this.getTopicContent(this.props.id);

        var data = this.state.topicContents.filter(i => i.id == this.state.id);
        if (data.length > 0) {
            this.setState({
                contentDocuments: data[0].contentDocuments
            });
        }
    }
    submit = async (e) => {
        e.preventDefault();
        this.setState({
            isSubmited: true
        });
        if (this.validate()) {
            const currentUser = localStorage.getItem('token');
            await fetch("setting/saveTopicContent", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json",
                    "Authorization": `Bearer ${currentUser}`
                },
                "body": JSON.stringify({
                    id: this.state.id,
                    topicId: +this.props.id,
                    contentText: this.stateRequestFormText.value,
                    contentTypeId: +this.state.contentTypeId,
                    orderId: +this.state.orderId,
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

                    await this.getTopicContent(this.props.id);
                    this.stateRequestFormText.value = "";
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

    openFileModalToggle = () => {
        this.setState({
            isFileOpen: true
        });
    }

    handleModalToggle = () => {
        this.stateRequestFormText.value = "";
        this.setState({
            isSmsSendOpen: false,
            isSubmited: false,
            isEdit: false,
            chapter: null,
            isActive: true
        });
    }

    handleFileModalToggle = () => {
        this.setState({
            id: 0,
            contentDocuments: [],
            isFileOpen: false,
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
        if (this.stateRequestFormText.value === null || this.stateRequestFormText.value === "") {
            return false;
        }
        if (this.state.contentTypeId === null || this.state.contentTypeId === 0) {
            return false;
        }
        if (this.state.orderId === null || this.state.orderId === 0) {
            return false;
        }

        this.setState({
            isValidSubmit: true
        });

        return true;
    }
    stateRequestFormText = {
        value: ""
    }
    uploadFile = async () => {
        if (this.state.files == null || this.state.files.length === 0) {
            SweetAlert.fire(
                'Please add file(s) for upload'
            )
            return;
        }
        SweetAlert.fire({
            title: "Are you sure you want upload the file(s)?",
            cancelButtonText: "No",
            confirmButtonText: "Yes",
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                await this.uploadAssignmentFile();
            }
        });
    }
    uploadAssignmentFile = async () => {
        var files = this.state.files;

        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            formData.append('file', files[i]);
            const currentUser = localStorage.getItem('token');
            await fetch("setting/uploadContentFile", {
                method: "POST",
                headers: {
                    'TopicContentId': this.state.id,
                    'ChapterTopicId': this.props.id,
                    'SubjectChapterId': this.props.subjectChapter,
                    "Authorization": `Bearer ${currentUser}`
                },
                body: formData
            })
                .then(response => response.json())
                .then(async (response) => {


                })
                .catch(err => {
                    toast.error(err)
                });
        };
        await this.getFile();
        this.fileInput.value = "";
        this.setState({
            toggleCleared: false,
            selectedRows: null
        });
    }

    setFile = (e) => {
        this.setState({
            files: e.target.files
        });
    }
    handleContentDocuments = (refVal) => {
        return (
            <a href={refVal.url}>{refVal.fileName}</a>
        );
    }

    handleRowSelected = (rows) => {
        this.setState({
            selectedRows: rows
        });
    }

    handleDelete = async () => {
        this.setState({
            toggleCleared: true
        });
        const currentUser = localStorage.getItem('token');
        this.state.selectedRows.selectedRows.map(async (i) =>

            await fetch("setting/removeContentFile", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json",
                    "Authorization": `Bearer ${currentUser}`
                },
                "body": JSON.stringify({
                    id: +i.id,
                    enFileName: i.enFileName,
                    topicContentId: +i.topicContentId,
                    subjectChapterId: +this.props.subjectChapter,
                    chapterTopicId: +this.props.id,
                })
            })
                .then(response => response.json())
                .then(async (response) => {

                    await this.getFile();
                })
                .catch(err => {
                    toast.error(err)
                }));

        this.setState({
            toggleCleared: true,
            selectedRows: null
        });
    }

    render() {

        const contentDocumentList = [];
        this.state.contentDocuments.forEach(refVal => {
            contentDocumentList.push(
                this.handleContentDocuments(
                    refVal
                )
            );
        });
        const onTextChange = (evt) => {
            const newContent = evt.editor.getData();
            if (!(newContent == "" && this.stateRequestFormText.value == "")) {
                this.stateRequestFormText.value = newContent;
            }
        }

        const openDataColumns = [
            {
                name: 'Order No',
                selector: 'orderId',
                wrap: true,
                sortable: true
            },
            {
                name: 'Content',
                selector: 'contentText',
                wrap: true,
                sortable: true
            },
            {
                name: 'Content Type',
                selector: 'contentType',
                wrap: true,
                sortable: true
            },
            {
                name: 'Active',
                selector: 'isActive',
                sortable: true,
                wrap: true,
                wrap: true
            },
            {
                name: 'Action',
                selector: 'action',
                center: true
            }
        ];

        const columns = [
            {
                name: 'File Name',
                selector: 'fileName',
                sortable: false,
                center: true,
            }
        ];

        return (
            <Fragment>
                <Breadcrumb title="Topic Content" parent="Subject Chapter" parentLink={createLink('/chapter-topic-management/:subjectChapter/:id', { subjectChapter: this.props.subjectChapter, id: this.props.chapterTopicId })} isParentShow={true} />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>{"Topic Content"}</h5>
                                </div>
                                <div className="card-body">
                                    <div className="card-header">
                                        <Button color="primary mr-2" onClick={this.openModalToggle}>Add Content</Button>
                                        <Link className="btn btn-primary" target="_blank" to={createLink('/content/:topicId', { topicId: this.props.id })}> Content Preview</Link>
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
                                                                    <label className="col-form-label pt-0" htmlFor="topic">{"Content Type"}</label>
                                                                    <select onChange={e => this.handleChange({ contentTypeId: e.target.value })} className="form-control digits" defaultValue={this.state.contentTypeId}>
                                                                        <option value={0}>Select Content Type</option>
                                                                        <option value={1}>Text</option>
                                                                        <option value={2}>Video</option>
                                                                        <option value={3}>Audio</option>
                                                                        <option value={4}>Document</option>
                                                                        <option value={5}>Image</option>
                                                                    </select>
                                                                    <span style={{ color: "#ff5370" }}>{this.state.isSubmited && !this.state.contentTypeId && 'Content Type is required'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col-12">
                                                                    <label className="col-form-label pt-0" htmlFor="contentText">{"Description"}</label>
                                                                    <CKEditors id="contentText"
                                                                        content={this.stateRequestFormText.value}
                                                                        events={{
                                                                            "change": onTextChange
                                                                        }}
                                                                    />
                                                                    <span style={{ color: "#ff5370" }}>{this.state.isSubmited && this.stateRequestFormText.value == "" && 'Content Text is required'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col-12">
                                                                    <label className="col-form-label pt-0" htmlFor="contentText">{"Order Sequence"}</label>
                                                                    <input className="form-control" id="orderId" type="number" aria-describedby="orderId" value={this.state.orderId} min="1" max={this.state.orderNo + 1} onChange={e => this.handleChange({ orderId: e.target.value })} placeholder="Order Sequence" />
                                                                    <span style={{ color: "#ff5370" }}>{this.state.isSubmited && !this.state.orderId && 'Order Sequence is required'}</span>
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

                                    {
                                        <Modal isOpen={this.state.isFileOpen} toggle={this.handleFileModalToggle} size="lg">
                                            <ModalHeader toggle={this.handleFileModalToggle}>

                                            </ModalHeader>
                                            <ModalBody>
                                                <div className="card-body">
                                                    <form className="theme-form needs-validation" noValidate="">
                                                        <div className="card-body">

                                                            <div className="form-row">
                                                                <div className="form-group col-12">
                                                                    <label className="col-form-label pt-0" htmlFor="contentText">{"Documents"}</label>
                                                                    <input className="form-control" multiple type="file" onChange={this.setFile} ref={ref => this.fileInput = ref} />
                                                                    <span style={{ color: "#ff5370" }}>{this.state.isSubmited && !this.state.orderId && 'Document is required'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group">
                                                                    <button className="btn btn-primary mr-2" style={{ width: "auto" }} type="button" onClick={() => this.uploadFile()}>Add</button>
                                                                    <input className="btn btn-light mr-2" style={{ width: "auto" }} type="reset" defaultValue="Cancel" />
                                                                </div>
                                                            </div>
                                                            <hr />
                                                            <div className="form-row">
                                                                <div className="form-group col-12">
                                                                    <div className="card-body datatable-react">
                                                                        <DataTable
                                                                            columns={columns}
                                                                            data={this.state.contentDocuments}
                                                                            striped={false}
                                                                            center={true}
                                                                            selectableRows={true}
                                                                            onSelectedRowsChange={this.handleRowSelected}
                                                                            clearSelectedRows={this.state.toggleCleared}
                                                                        />
                                                                        {this.state.selectedRows && this.state.selectedRows.selectedCount > 0 && (<button className="btn btn-danger mt-2 float-right" style={{ width: "auto" }} type="button" onClick={() => this.handleDelete()}>Remove</button>)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </ModalBody>
                                        </Modal>
                                    }

                                    <div className="card-body datatable-react">

                                        <DataTable
                                            columns={openDataColumns}
                                            data={this.state.topicContents}
                                            striped={true}
                                            pagination
                                            persistTableHead
                                            responsive={true}
                                        />
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
const mapStateToProps = (state, params) => {
    return {
        id: params.match.params.id,
        chapterTopicId: params.match.params.chapterTopic,
        subjectChapter: params.match.params.subjectChapter
    };
};

const mapDispatchToProps = (dispatch, params) => ({

});
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(TopicContents));