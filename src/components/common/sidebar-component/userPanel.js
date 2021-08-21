import React, { Fragment } from 'react';
import man from '../../../assets/images/dashboard/user.png'
import { Link } from 'react-router-dom';
import { Edit } from 'react-feather';
import {ELANA,GeneralManager} from '../../../constant'

const UserPanel = () => {
    const image = localStorage.getItem('image');
    const fullName = localStorage.getItem('fullName');
    const email = localStorage.getItem('email');
    const url = '';
    return (
        <Fragment>
            <div className="sidebar-user text-center">
                <div>
                    <img className="img-60 rounded-circle lazyloaded blur-up" src={image ? image : man} alt="#" />
                    <div className="profile-edit">
                        <Link to={`${process.env.PUBLIC_URL}/users/userEdit`}>
                            <Edit />
                        </Link>
                    </div>
                </div>
                <h6 className="mt-3 f-14">{fullName}</h6>
                <p>{email}</p>
            </div>
        </Fragment>
    );
};

export default UserPanel;