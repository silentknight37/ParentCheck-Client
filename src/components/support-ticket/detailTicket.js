import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import { toast } from 'react-toastify';
import { handleResponse } from "../../services/service.backend";
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import createLink from '../../helpers/createLink';

class DetailTicket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detailTicket: null,
      conversations: [],
      isSubmited: false,
      replyMessage: null,
      isValidSubmit: false
    };
  }

  componentDidMount = async () => {
    await this.getDetailTickets(this.props.ticketId);
  }

  getDetailTickets = async (id) => {
    const conversationList = [];
    return fetch(`support/getDetailTickets?id=${id}`)
      .then(handleResponse)
      .then(response => {
        this.setState({
          detailTicket: response.detailTicket
        });

        response.detailTicket.supportTicketConversations.map(i =>
          conversationList.push({ id: i.id, conversationText: i.conversationText, replyBy: i.replyBy, replyOn: i.replyOn, replyUser: i.replyUser, imageUrl: i.imageUrl, isUserReply: i.isUserReply })
        )

        this.setState({
          conversations: conversationList
        });
      });
  }

  submitEvent = async (e) => {
    e.preventDefault();
    this.setState({
      isSubmited: true
    });

    if (this.validate()) {
      await fetch("support/replySupport", {
        "method": "POST",
        "headers": {
          "content-type": "application/json",
          "accept": "application/json"
        },
        "body": JSON.stringify({
          ticketId: this.props.ticketId,
          replyMessage: this.state.replyMessage,
        })
      })
        .then(response => response.json())
        .then(async (response) => {

          if (!response.Value.Created) {
            toast.error(response.Value.Error.Message)
            return;
          }

          toast.success(response.Value.SuccessMessage)
          await this.getDetailTickets(this.props.ticketId);
          this.handlePeronalModalToggle();
        })
        .catch(err => {
          toast.error(err)
        });
    }
  }

  validate = () => {
    if (this.state.replyMessage === null || this.state.replyMessage === "") {
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

  handlePeronalModalToggle = () => {
    this.setState({
      replyMessage: null,
      isSubmited: false
    });
  }

  handleSupportConversations = (i) => {
    if (i.isUserReply) {
      return (
        <li>
          <ul>
            <div className={"media align-self-center"}>
              <img className="align-self-center" src={i.imageUrl} alt="Generic placeholder" />
              <div className="media-body">
                <div className="row">
                  <div className="col-md-12 xl-100">
                    <h6 className="mt-0">{i.replyUser}<span> ( {new Date(i.replyOn).toDateString()} - {new Date(i.replyOn).toLocaleTimeString()} )</span></h6>
                  </div>
                </div>
                <p>{i.conversationText}</p>
              </div>
            </div>
          </ul>
        </li>
      );
    }
    return (
      <li>
        <div className={"media align-self-center"}>
          <img className="align-self-center" src={i.imageUrl} alt="Generic placeholder" />
          <div className="media-body">
            <div className="row">
              <div className="col-md-12 xl-100">
                <h6 className="mt-0">{i.replyUser}<span> ( {new Date(i.replyOn).toDateString()} - {new Date(i.replyOn).toLocaleTimeString()} )</span></h6>
              </div>
            </div>
            <p>{i.conversationText}</p>
          </div>
        </div>
      </li>
    );
  }

  render() {
    const supportConversationList = [];
    this.state.conversations.forEach(conversations => {
      supportConversationList.push(
        this.handleSupportConversations(
          conversations
        )
      );
    });

    return this.state.detailTicket && (
      <Fragment>
        <Breadcrumb title="New Support Ticket" parent="My Tickets" parentLink={createLink('/support/my-ticket')} isParentShow={true} />
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="blog-single">
                <div className="blog-box blog-details">
                  <div className="blog-details">
                    <ul className="blog-social">
                      <li className="digits">{new Date(this.state.detailTicket.openDate).toDateString()}</li>
                      <li><i className="icofont icofont-user"></i>{this.state.detailTicket.openBy}</li>
                    </ul>
                    <h4>
                      {this.state.detailTicket.subject}
                    </h4>
                    <span>
                      {this.state.detailTicket.description}
                    </span>
                    <hr />
                  </div>
                </div>
                <section className="comment-box pt-0">
                  <div className="card">
                    <div className="card-header">
                      <ul>
                        {supportConversationList}
                      </ul>
                    </div>
                    <form className="form theme-form needs-validation">
                      <div className="card-body">

                        <div className="form-row">
                          <div className="form-group col-md-12 mb-12">
                            <label htmlFor="exampleFormControlTextarea9">{'Reply'}</label>
                            <textarea className="form-control" id="replyMessage" onChange={e => this.handleChange({ replyMessage: e.target.value })} rows="3"></textarea>
                            <span>{this.state.isSubmited && !this.state.replyMessage && 'Please enter message'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="card-footer">
                        <button className="btn btn-primary mr-1" type="button" disabled={this.state.isSubmited && this.state.isValidSubmit} onClick={(e) => this.submitEvent(e)}>{'Submit'}</button>
                        <input className="btn btn-light" type="reset" defaultValue="Cancel" disabled={this.state.isSubmited && this.state.isValidSubmit} onClick={this.handlePeronalModalToggle} />
                      </div>
                    </form>
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
    ticketId: params.match.params.ticketId
  };
};

const mapDispatchToProps = (dispatch, params) => ({

});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DetailTicket));