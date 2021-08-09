import React, { Fragment } from 'react';
import Breadcrumb from '../../common/breadcrumb'
import { Container, Row, Col, Card, CardHeader, CardBody, Form, FormGroup, Input } from 'reactstrap'
import { Home, Globe } from 'react-feather';
import errorImg from '../../../assets/images/search-not-found.png';
import { handleResponse,authHeader } from "../../../services/service.backend";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import SweetAlert from 'sweetalert2'
import { toast } from 'react-toastify';

const ContentType = {
  Video: 2,
  Audio: 3,
  Document: 4
}

class Library extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Library: [],
      searchTerm: null,
      isInstitute: true,
      isGlobal: false,
      isFileOpen: false,
      selectedFile: null,
      numPages: null,
      pageNumber: 1,
      isSubmited: false,      
      files: null,
      fileName: null,
      libraryDescription: null
    };
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  goToPrevPage = () =>
    this.setState(state => ({ pageNumber: state.pageNumber - 1 }));
  goToNextPage = () =>
    this.setState(state => ({ pageNumber: state.pageNumber + 1 }));


  componentDidMount = async () => {
    await this.getLibrary();
  }

  getLibrary = async () => {
    const LibraryList = [];
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`classRoom/getLibrary`,requestOptions)
      .then(handleResponse)
      .then(response => {
        response.libraries.map(i =>
          LibraryList.push({
            id: i.id,
            classSubjectId: i.classSubjectId,
            instituteId: i.instituteId,
            fileName: i.fileName,
            fileUrl: i.fileUrl,
            description: i.description,
            contentTypeId: i.contentTypeId,
            isGlobal: i.isGlobal,
            isInstituteLevelAccess: i.isInstituteLevelAccess,
            isFileUploadpen: false
          })
        )
        this.setState({
          Library: LibraryList,
        });
      });
  }

  handleChange(changeObject) {
    this.setState(changeObject);
  }

  handleTabChange(tabItem) {
    if (tabItem === "Institute") {
      this.setState({
        isInstitute: true,
        isGlobal: false
      });
    }

    if (tabItem === "Global") {
      this.setState({
        isInstitute: false,
        isGlobal: true
      });
    }
  }

  openFile(file) {
    this.setState({
      isFileOpen: true,
      selectedFile: file
    });
  }

  getFile = (file) => {
    if (file.contentTypeId === ContentType.Audio) {
      return (
        <audio style={{ width: "100%" }} controls controlsList="nodownload" preload="none">
          <source src={file.fileUrl} type="audio/ogg" />
          Your browser does not support the audio element.
        </audio>
      );
    }

    if (file.contentTypeId === ContentType.Video) {
      return (
        <video style={{ width: "100%" }} controls controlsList="nodownload" preload="none">
          <source src={file.fileUrl} type="audio/ogg" />
          Your browser does not support the audio element.
        </video>
      );
    }

    if (file.contentTypeId === ContentType.Document) {
      return (
        <embed src={`${file.fileUrl}#toolbar=0`} type="application/pdf" width="100%" height="600px" />
      );
    }
  }

  generateLibraryList = (data, i) => {
    let classFile = data.contentTypeId === ContentType.Video ?
      "fa fa-file-movie-o txt-info" :
      data.contentTypeId === ContentType.Audio ?
        "fa fa-file-audio-o txt-info" :
        "fa fa-file-pdf-o txt-info";
    return (
      <li className="file-box" key={i} onClick={() => this.openFile(data)}>
        <div className="file-top">  <i className={classFile}></i></div>
        <div className="file-bottom">
          <h6>{data.fileName} </h6>
        </div>
      </li>
    )
  }

  openModalToggle = () => {
    this.setState({
      isFileUploadpen: true
    });
  }

  setFile = (e) => {
    this.setState({
      files: e.target.files
    });
  }

  handleModalToggle = () => {
    this.setState({
      isFileUploadpen: false,
      isSubmited: false,
      isFileOpen: false
    });
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
    var isFailed = false;
    var message;

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);

      const currentUser = localStorage.getItem('token');
      await fetch("classRoom/uploadFile", {
        method: "POST",
        headers: {
          'libraryDescription': this.state.libraryDescription,
          "Authorization": `Bearer ${currentUser}`
        },
        body: formData
      })
        .then(response => response.json())
        .then(async (response) => {
          if (!response.Value.Created) {
            toast.error(response.Value.Error.Message);
            isFailed = true;
            return;
          }
          message = response.Value.SuccessMessage;
        })
        .catch(err => {
          toast.error(err)
        });
    };

    if (!isFailed) {
      toast.success(message);
      this.setState({
        isFileUploadpen: false
      });     
      await this.getLibrary();     
    }
  }

  render() {
    const roleId = localStorage.getItem('roleId');
    const fileList = [];
    this.state.Library.filter((data) => {
      if (this.state.searchTerm == null) {
        if (this.state.isInstitute && data.isInstituteLevelAccess) {
          return data
        }

        if (this.state.isGlobal && data.isGlobal) {
          return data
        }
      }
      else if (data.fileName.toLowerCase().includes(this.state.searchTerm.toLowerCase())) {
        if (this.state.isInstitute && data.isInstituteLevelAccess) {
          return data
        }

        if (this.state.isGlobal && data.isGlobal) {
          return data
        }
      }
    }).map((data, i) => {
      fileList.push(
        this.generateLibraryList(data, i)
      )
    })
    
    return (
      
      <div>
        <Fragment>
          <Breadcrumb parent="Apps" title="File Manager" />

          <Container fluid={true}>
            <Row>
              <Col>
                {(roleId==2 || roleId==4 || roleId==5) && (<Button color="primary mt-2 mb-2" onClick={this.openModalToggle}>Upload File</Button>)}

                {
                  <Modal isOpen={this.state.isFileUploadpen} toggle={this.handleModalToggle} size="lg">
                    <ModalHeader toggle={this.handleModalToggle}>

                    </ModalHeader>
                    <ModalBody>
                      <div className="card-body">
                        <form className="theme-form needs-validation" noValidate="">
                          <div className="card-body">
                            <div className="row">
                              <div className="col">
                                <div className="form-group">
                                  <label>Select File</label>
                                  <input className="form-control" multiple accept="application/pdf,video/mp4,audio/mp3,audio/wav" type="file" onChange={this.setFile} ref={ref => this.fileInput = ref} />
                                </div>
                                <div className="form-group">
                                  <label>{"Description"}</label>
                                  <textarea className="form-control" rows="5" cols="12" id="libraryDescription" placeholder="Description" onChange={e => this.handleChange({ libraryDescription: e.target.value })}></textarea>
                                </div>
                                <div className="form-group">
                                  <button className="btn btn-primary mr-2" style={{ width: "auto" }} type="button" onClick={() => this.uploadFile()}>Upload</button>
                                  <input className="btn btn-light mr-2" style={{ width: "auto" }} type="reset" defaultValue="Cancel" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </ModalBody>
                  </Modal>
                }
              </Col>
            </Row>
            <Row>

              <Col xl="3" className="box-col-6 pr-0">
                <div className="file-sidebar">
                  <Card>
                    <CardBody>
                      <ul>
                        <li>
                          <div className={`btn  ${this.state.isInstitute ? 'btn-primary' : 'btn-light'}`} onClick={() => this.handleTabChange("Institute")} ><Home />{'Institute'} </div>
                        </li>
                        <li>
                          <div className={`btn  ${this.state.isGlobal ? 'btn-primary' : 'btn-light'}`} onClick={() => this.handleTabChange("Global")}><Globe />{'Globel'}</div>
                        </li>
                      </ul>
                    </CardBody>
                  </Card>
                </div>
              </Col>
              <Col xl="9" md="12" className="box-col-12">
                {this.state.Library.length > 0 && (
                  <div className="file-content">
                    <Card>
                      <CardHeader>
                        <div className="media">
                          <Form className="form-inline">
                            <FormGroup>
                              <i className="fa fa-search"></i>
                              <Input
                                className="form-control-plaintext"
                                type="text"
                                value={this.state.searchTerm}
                                onChange={(e) => this.handleChange({ searchTerm: e.target.value })}
                                placeholder="Search..." />
                            </FormGroup>
                          </Form>
                        </div>
                      </CardHeader>
                      {fileList.length > 0 ?
                        <CardBody className="file-manager">
                          <ul className="files">
                            {fileList}
                          </ul>
                        </CardBody>
                        :
                        <img className="img-fluid m-auto" src={errorImg} alt="" />
                      }
                    </Card>
                  </div>
                )}
              </Col>
            </Row>
          </Container>

        </Fragment>

        {
          this.state.selectedFile && (<Modal isOpen={this.state.isFileOpen} toggle={this.handleModalToggle} size="lg">
            <ModalBody>
              <div className="col-sm-12 col-xl-12">
                <div className="ribbon-wrapper card">
                  <div className="card-body">
                    <div className="row">
                      <label className="col-sm-12"><b>{this.state.selectedFile.fileName}</b></label>
                      <label className="col-sm-12">{this.state.selectedFile.description}</label>
                      <hr />
                      {this.getFile(this.state.selectedFile)}
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.handleModalToggle}>Close</Button>
            </ModalFooter>
          </Modal>)
        }
      </div>
    );
  }
}

export default Library;