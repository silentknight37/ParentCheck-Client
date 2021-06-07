import React, { Fragment } from 'react';
import Breadcrumb from '../common/breadcrumb';
import Timeline1 from './timeline1';
import VerticalTimelineComp from './verticalTimelineComp';
import {ClassRoom} from "../../constant";
const Timeline = () => {
    return (
        <Fragment>
            <Breadcrumb title={ClassRoom} parent={ClassRoom} />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header">
                                <h5>{ClassRoom}</h5>
                            </div>
                            <div className="card-body">
                                <Timeline1 />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header">
                                <h5>{ClassRoom}</h5>
                            </div>
                            <div className="card-body">
                                <VerticalTimelineComp />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Timeline;