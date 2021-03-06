import React, { Fragment } from 'react';
import { Home } from 'react-feather';
import { Link } from 'react-router-dom'
import Bookmark from './bookmark';

const Breadcrumb = props => {
    const breadcrumb = props;

    return (
        <Fragment>
            <div className="container-fluid">
                <div className="page-header">
                    <div className="row">
                        <div className="col">
                            <div className="page-header-left">
                                <ol className="breadcrumb pull-right">
                                    <li className="breadcrumb-item">
                                        <Link to={`${process.env.PUBLIC_URL}/dashboard`}>
                                            <Home />
                                        </Link>
                                    </li>
                                    {breadcrumb.isParentShow && (<li className="breadcrumb-item" ><Link to={breadcrumb.parentLink}>{breadcrumb.parent}</Link></li>)}
                                    <li className="breadcrumb-item active">{breadcrumb.title}</li>
                                </ol>
                            </div>
                        </div>
                        {/* <!-- Bookmark Start--> */}
                        {/* <Bookmark /> */}
                        {/* <!-- Bookmark Ends--> */}
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Breadcrumb
