import React from 'react';
import 'react-vertical-timeline-component/style.min.css';
import { toast } from 'react-toastify';
import SweetAlert from 'sweetalert2'
import { handleResponse } from "../../services/service.backend";

const ContentType = {
    Text: 1,
    Video: 2,
    Audio: 3,
    Document: 4,
    Image: 5
}

class Assignment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: null,
            fileName: null,
            assignmentUploadedFileIds: null,
            submitedAssignmentFile: []
        };
    }

    componentDidMount = async () => {
        await this.getSubmitedAssignmentFile(this.props.assignment.id);
    }

    getSubmitedAssignmentFile = async (id) => {

        const submitedAssignmentFileList = [];

        return fetch(`classRoom/getSubmitedAssignmentFile?id=${id}`)
            .then(handleResponse)
            .then(response => {
                response.subjectChapters.map(i =>
                    submitedAssignmentFileList.push({ id: i.id, chapterText: i.chapterText, topicCount: i.topicCount })
                )
                this.setState({
                    submitedAssignmentFile: submitedAssignmentFileList
                });
            });
    }

    showAssignmentSubmition = (record) => {
        return (
            <div>
                <div className="col-lg-2 col-md-2 mb-3" >
                    <a href={record.url} rel="noopener noreferrer" target="_blank">{record.fileName}</a>
                </div>
                <div className="col-lg-2 col-md-2 mb-3" >
                    <button className="btn btn-primary mr-2" style={{ width: "auto" }} type="button" onClick={() => this.removeFile(record.id)}>Remove</button>
                </div>
            </div>
        );
    }

    getDocuments = (contentDocument) => {
        return (
            <div className="col-lg-2 col-md-2 mb-3" >
                <a href={contentDocument.url} rel="noopener noreferrer" target="_blank">{contentDocument.fileName}</a>
            </div>
        );
    }


    getContentImages = (contentDocument) => {

        return (
            <img className="col-6" src={contentDocument.url} alt={contentDocument.fileName} />
        );
    }

    getContentAudios = (contentDocument) => {
        return (
            <audio style={{ width: "100%" }} controls preload="none">
                <source src={contentDocument.url} type="audio/ogg" />
                Your browser does not support the audio element.
            </audio>
        );
    }

    getContentVideos = (contentDocument) => {
        return (
            <video style={{ width: "100%" }} controls preload="none">
                <source src={contentDocument.url} type="audio/ogg" />
                Your browser does not support the audio element.
            </video>
        );
    }

    getResorce = (document) => {
        switch (document.typeId) {
            case ContentType.Document:
                return (
                    this.getDocuments(document)
                );
            case ContentType.Image:
                return (
                    <div className="row">
                        {this.getContentImages(document)}
                    </div>
                );
            case ContentType.Video:
                return (
                    this.getContentVideos(document)
                );
            case ContentType.Audio:
                return (
                    this.getContentAudios(document)
                )
            default:
                return "";
        }

    }

    setFile = (e) => {
        this.setState({
            files: e.target.files
        });
    }

    uploadAssignmentFile = async (id) => {
        var uploadedList = [];
        var files = this.state.files;

        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            formData.append('file', files[i]);
            await fetch("classRoom/uploadAssignmentFile", {
                method: "POST",
                headers: {
                    'AssignmentId': id
                },
                body: formData
            })
                .then(response => response.json())
                .then(response => {
                    uploadedList.push(response.id)
                })
                .catch(err => {
                    toast.error(err)
                });
        };

        this.setState({
            assignmentUploadedFileIds: uploadedList
        });
    }

    uploadFile = async (id) => {
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
                await this.uploadAssignmentFile(id);
            }
        });
    }

    completeAssignment = async (id) => {
        SweetAlert.fire({
            title: "Are you sure you want to complete the assignment?",
            cancelButtonText: "No",
            confirmButtonText: "Yes",
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                await this.completeAssignmentSubmition(id);
            }
        });
    }

    completeAssignmentSubmition = async (id) => {
        if (this.state.files.length === this.state.assignmentUploadedFileIds.length) {
            await fetch("classRoom/submitAssignment", {
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "accept": "application/json"
                },
                "body": JSON.stringify({
                    assignmentId: id
                })
            })
                .then(response => response.json())
                .then(response => {
                    if (!response.Value.Created) {
                        toast.error(response.Value.Error.Message)
                        return;
                    }
                    toast.success(response.Value.SuccessMessage)
                    this.getEvent(this.state.eventDate);
                    this.setState({
                        isPersonalEventOpen: false
                    });
                })
                .catch(err => {
                    toast.error(err)
                });
        }
    }

    generateContent = (assignment) => {
        var openDate = new Date(assignment.openDate);
        var closeDate = new Date(assignment.closeDate);
        return (
            <div>
                <h5>
                    {assignment.title}
                </h5>
                <div className="row">
                    <p className="col-6">
                        <b>Open Date : {openDate.toDateString()}</b>
                    </p>
                    <p className="col-6">
                        <b>Close Date : {closeDate.toDateString()}</b>
                    </p>
                </div>
                <hr />
                <p>
                    {assignment.description}
                </p>
                <hr />
                {assignment.documents.length > 0 && (
                    <div>
                        <p><b>Documents</b></p>
                        <div className="row">
                            {assignment.documents.map(i => this.getResorce(i))}
                        </div>
                        <hr />
                    </div>
                )}
                <form className="form theme-form">
                    <div className="card-body">
                        <div className="row">
                            <div className="col">
                                <div className="form-group">
                                    <label>Submit Assignment</label>
                                    <input className="form-control" multiple type="file" onChange={this.setFile} />
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-primary mr-2" style={{ width: "auto" }} type="button" onClick={() => this.uploadFile(assignment.id)}>Add</button>
                                    <input className="btn btn-light mr-2" style={{ width: "auto" }} type="reset" defaultValue="Cancel" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.state.submitedAssignmentFile.length>0 &&
                        (
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">

                                    </div>
                                </div>
                            </div>
                        )
                    }
                    <div className="card-footer">
                        <button className="btn btn-primary" style={{ width: "auto" }} type="button" onClick={() => this.completeAssignment(assignment.id)}>Complete Assignment</button>
                    </div>
                </form>
            </div>
        )
    }

    render() {
        return (
            <div className="blog-single">

                <section className="comment-box">
                    <h4>{this.props.title} - Assignment</h4>
                    <hr />
                    {this.generateContent(this.props.assignment)}
                </section>
            </div>
        );
    }
};

export default Assignment;