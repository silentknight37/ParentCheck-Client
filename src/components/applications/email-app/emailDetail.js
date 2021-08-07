import React, { Fragment } from 'react';
import Breadcrumb from '../../common/breadcrumb';
import { toast } from 'react-toastify';
import { handleResponse } from "../../../services/service.backend";
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import createLink from '../../../helpers/createLink';
import CKEditors from "react-ckeditor-component";
class EmailDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: null,
      conversations: [],
      isSubmited: false,
      replyMessage: null,
      isValidSubmit: false,
      toUserId: null
    };
  }

  componentDidMount = async () => {
    await this.getDetail(this.props.id, this.props.type);
  }

  getDetail = async (id, type) => {
    const messagesList = [];
    return fetch(`communication/getDetailCommunication?id=${id}&type=${type}`)
      .then(handleResponse)
      .then(response => {

        response.messages.map(i =>
          messagesList.push({ id: i.id, date: new Date(i.date).toDateString(), subject: i.subject, message: i.message, toUser: i.toUser, fromUser: i.fromUser, type: i.type, templateId: i.templateId, templateName: i.templateName, templateContent: i.templateContent, fromUserId: i.fromUserId })
        )
        if (messagesList.length > 0) {
          var firstItem = messagesList[0];
          if (firstItem) {
            this.setState({
              subject: firstItem.subject,
              toUserId: firstItem.fromUserId
            });
          }
        }
        this.setState({
          conversations: messagesList
        });
      });
  }

  submitReplyEvent = async (e) => {
    e.preventDefault();
    this.setState({
      isSubmited: true
    });

    if (this.validate()) {
      await fetch("communication/replyCommunication", {
        "method": "POST",
        "headers": {
          "content-type": "application/json",
          "accept": "application/json"
        },
        "body": JSON.stringify({
          id: this.props.id,
          subject: this.state.subject,
          messageText: this.stateRequestFormText.value,
          toUserId: this.state.toUserId,
        })
      })
        .then(response => response.json())
        .then(async (response) => {

          if (!response.Value.Created) {
            toast.error(response.Value.Error.Message)
            return;
          }
          this.setState({
            isSubmited: false
          });
          this.stateRequestFormText.value = "";
          toast.success(response.Value.SuccessMessage)
          await this.getDetail(this.props.id, this.props.type);
        })
        .catch(err => {
          toast.error(err)
        });
    }
  }

  validate = () => {
    if (this.stateRequestFormText.value === null || this.stateRequestFormText.value === "") {
      return false;
    }
    this.setState({
      isValidSubmit: true
    });

    return true;
  }

  handleChange(changeObject) {
    this.setState(changeObject);
    this.setState({
      isSubmited: false
    });
  }

  getHtmlContent(message) {
    return (
      <div dangerouslySetInnerHTML={{ __html: message }} />
    );
  }

  handlePeronalModalToggle = () => {
    this.setState({
      replyMessage: null,
      isSubmited: false
    });
  }



  handleSupportConversations = (data, i) => {
    var isLastItem = i === this.state.conversations.length - 1;
    if (isLastItem) {
      this.stateRequestFormText.value = data.templateContent;
    }
    return (
      <li>
        <div className={"media align-self-center"}>
          <div className="media-body">
            <div className="row">
              <div className="col-md-12 xl-100">
                <p className="mt-0"><span className="mr-2"><b> ( {new Date(data.date).toDateString()} - {new Date(data.date).toLocaleTimeString()} )</b></span>{data.fromUser}</p>
                {data.templateId > 0 && (<p>
                  Request Form : {data.templateName}
                </p>)}
              </div>
            </div>
            <p>{this.getHtmlContent(data.message)}</p>
            <hr />
          </div>
        </div>
      </li>
    );
  }

  stateRequestFormText = {
    value: ""
  }

  render() {
    const supportConversationList = [];
    this.state.conversations.map((conversations, i) => {
      supportConversationList.push(
        this.handleSupportConversations(
          conversations, i
        )
      );
    });

    const onRequestFormChange = (evt) => {
      const newContent = evt.editor.getData();
      if (!(newContent == "" && this.stateRequestFormText.value == "")) {
        this.stateRequestFormText.value = newContent;
      }
    }

    return (
      <Fragment>
        <Breadcrumb title="Email Details" parent="Email" parentLink={createLink('/Communication/email')} isParentShow={true} />
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="blog-single">
                <section className="comment-box pt-0">
                  <div className="card">
                    <div className="card-header">
                      {this.state.conversations.length > 0 && (<h6>{this.state.conversations[0].subject}</h6>)}
                      <ul>
                        {supportConversationList}
                      </ul>
                    </div>
                    {this.props.type == 1 && (
                      <form className="form theme-form needs-validation">
                        <div className="card-body">
                          <div className="form-row">
                            <div className="form-group col-12">
                              <CKEditors id="message"
                                content={this.stateRequestFormText.value}
                                events={{
                                  "change": onRequestFormChange
                                }}
                              />

                            </div>
                          </div>
                        </div>

                        <div className="card-footer">
                          <button className="btn btn-primary mr-1" type="button" disabled={this.state.isSubmited && this.state.isValidSubmit} onClick={(e) => this.submitReplyEvent(e)}>{'Reply'}</button>
                          <input className="btn btn-light" type="reset" defaultValue="Cancel" disabled={this.state.isSubmited && this.state.isValidSubmit} onClick={this.handlePeronalModalToggle} />
                        </div>
                      </form>
                    )}
                  </div>

                </section>
              </div>

            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
const mapStateToProps = (state, params) => {
  return {
    id: params.match.params.id,
    type: params.match.params.type
  };
};

const mapDispatchToProps = (dispatch, params) => ({

});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EmailDetail));