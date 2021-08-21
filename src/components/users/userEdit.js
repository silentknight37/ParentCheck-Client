import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import seven from '../../assets/images/user/7.jpg';
import { toast } from 'react-toastify';
class UserEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: null,
        };
    }
   
    uploadAssignmentFile = async (e) => {
        debugger
        var files = e.target.files;

            const formData = new FormData();
            formData.append('file', files[0]);
            const currentUser = localStorage.getItem('token');
            await fetch("setting/uploadProfilePic", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${currentUser}`
                },
                body: formData
            })
                .then(response => response.json())
                .then(async (response) => {
                    localStorage.setItem('image', response.Value);
                    window.location.reload();
                })
                .catch(err => {
                    toast.error(err)
                });
        this.fileInput.value = "";
    }

    render() {
        const image = localStorage.getItem('image');
        const fullName = localStorage.getItem('fullName');
        const email = localStorage.getItem('email');
        const dob = localStorage.getItem('dob');
        const roleId = localStorage.getItem('roleId');
        const studentName = localStorage.getItem('studentName');
        return (
            <Fragment>
                <Breadcrumb parent="Users" title="User Profile" />
                <div className="container-fluid">
                    <div className="user-profile">
                        <div className="row">
                            {/* <!-- user profile first-style start--> */}
                            <div className="col-sm-12">
                                <div className="card hovercard text-center">
                                    <div className="m-t-50"></div>
                                    <div className="m-t-20"></div>

                                    <div className="user-image ">
                                        <div className="avatar ">
                                            <img className="pro" alt="" src={image ? image : seven} data-intro="This is Profile image" />
                                        </div>
                                        <div className="icon-wrapper">
                                            <i className="icofont icofont-pencil-alt-5" data-intro="Change Profile image here" >
                                                <input className="pencil" type="file" onChange={async(e) => await this.uploadAssignmentFile(e)} />
                                            </i>
                                        </div>
                                    </div>

                                    <div className="info">
                                        <div className="row detail" data-intro="This is the your details">
                                            <div className="col-12 m-t-20">
                                                <div className="ttl-info text-left ttl-xs-mt">
                                                    <h6><i className="fa fa-phone mr-2"></i>{"Name"}</h6><span>{fullName}</span>
                                                </div>
                                            </div>
                                            <div className="col-12 m-t-40">
                                                <div className="ttl-info text-left">
                                                    <h6><i className="fa fa-envelope mr-2"></i>{"Email"}</h6><span>{email}</span>
                                                </div>
                                            </div>


                                            <div className="col-12 m-t-40">
                                                <div className="ttl-info text-left ttl-sm-mb-0">
                                                    <h6><i className="fa fa-calendar mr-2"></i>{"Date Of Birth"}</h6><span>{dob}</span>
                                                </div>
                                            </div>

                                            {roleId == 3 && (
                                                <div className="col-12 m-t-40">
                                                    <div className="ttl-info text-left ttl-sm-mb-0">
                                                        <h6><i className="fa fa-user mr-2"></i>{"Student Name"}</h6><span>{studentName}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <hr />
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

export default UserEdit;