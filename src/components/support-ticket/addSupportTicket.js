import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import { toast } from 'react-toastify';
import { Redirect } from 'react-router-dom';
import createLink from '../../helpers/createLink';
class AddSupportTicket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: null,
      issueText: null,
      isSubmited: false,
      isValidSubmit: false,
      redirectToReturlUrl:false
    };
  }

  submitEvent = async (e) => {
    e.preventDefault();
    this.setState({
      isSubmited: true
    });

    if (this.validate()) {
      await fetch("support/newSupport", {
        "method": "POST",
        "headers": {
          "content-type": "application/json",
          "accept": "application/json"
        },
        "body": JSON.stringify({
          subject: this.state.subject,
          issueText: this.state.issueText
        })
      })
        .then(response => response.json())
        .then(response => {

          if (!response.Value.Created) {
            toast.error(response.Value.Error.Message)
            return;
          }

          toast.success(response.Value.SuccessMessage)
          this.setState({
            redirectToReturlUrl: true
          });
        })
        .catch(err => {
          toast.error(err)
        });
    }
  }

  validate = () => {
    if (this.state.subject === null || this.state.subject === "") {
      return false;
    }

    if (this.state.issueText === null || this.state.issueText === "") {
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
      subject: null,
      description: null,
      isSubmited: false
    });
  }

  render() {
    if (this.state.redirectToReturlUrl) {
      return <Redirect to={createLink('/support/my-ticket')} />;
    }
    return (
      <Fragment>
        <Breadcrumb title="New Support Ticket" parent="Support Ticket" isParentShow={false} />
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <form className="form theme-form needs-validation">
                  <div className="card-body">
                    <div className="form-row">
                      <div className="form-group">
                        <label className="col-form-label pt-0" htmlFor="subject">{"Subject"}</label>
                        <input className="form-control" id="subject" type="text" aria-describedby="subject" onChange={e => this.handleChange({ subject: e.target.value })} placeholder="Subject" />
                        <span>{this.state.isSubmited && !this.state.subject && 'Subject is required'}</span>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-12 mb-12">
                        <label className="col-form-label pt-0" htmlFor="issueText">{"Please describe your issue in detail"}</label>
                        <textarea className="form-control" rows="5" cols="12" id="issueText" onChange={e => this.handleChange({ issueText: e.target.value })}></textarea>
                        <span>{this.state.isSubmited && !this.state.issueText && 'Description is required'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button className="btn btn-primary mr-1" disabled={this.state.isSubmited && this.state.isValidSubmit} type="button" onClick={(e) => this.submitEvent(e)}>{'Submit'}</button>
                    <input className="btn btn-light" disabled={this.state.isSubmited && this.state.isValidSubmit} type="reset" defaultValue="Cancel" onClick={this.handlePeronalModalToggle} />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default AddSupportTicket;