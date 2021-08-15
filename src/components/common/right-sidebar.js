import React from 'react';
import { handleResponse, authHeader } from "../../services/service.backend";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { UncontrolledTooltip } from 'reactstrap';
import createLink from '../../helpers/createLink';
class RightSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            weekDays: []
        };
    }

    componentDidMount = async () => {
        await this.getTodayTimeTable();
    }

    getTodayTimeTable = async () => {
        const WeekdayList = [];
        const requestOptions = { method: 'GET', headers: authHeader() };
        return fetch(`setting/getTodayTimeTable`, requestOptions)
            .then(handleResponse)
            .then(response => {
                response.weekDays.map(i =>

                    WeekdayList.push({
                        Weekday: i.Weekday, TimeTables: i.TimeTables
                    })
                )
                this.setState({
                    weekDays: WeekdayList
                });
            });
    }
    handleTimeTable = (refVal) => {
        return (
            <li className="clearfix">
                <div className="about">
                    <div className="name">{refVal.subject}</div>
                    <div className="status"> {refVal.fromTime} - {refVal.toTime}</div>
                </div>
            </li>
        );
    }
    render() {
        const roleId = localStorage.getItem('roleId');
        let weekday = "";
        let classText = "";
        const timeTableList = [];
        this.state.weekDays.forEach(refVal => {
            weekday = refVal.Weekday;
            refVal.TimeTables.forEach(refValSub => {
                classText = refValSub.className;
                timeTableList.push(
                    this.handleTimeTable(
                        refValSub
                    )
                );
            });
        });
        return (
            <div>
                <div className="right-sidebar" id="right_side_bar">
                    <div className="container p-0">
                        <div className="modal-header p-l-20 p-r-20">

                            <div className="col-sm-8 p-0">
                                <p className="modal-title font-weight-bold">{roleId != 2 ? classText : ""}{" Time Table"}</p>
                            </div>

                            <div className="col-sm-4 text-right p-0"><i className="mr-2" data-feather="settings"></i></div>
                        </div>
                        <div className="modal-header p-l-20 p-r-20">
                            <div className="col-sm-8 p-0">
                                <p className="modal-title">{weekday}</p>
                            </div>
                        </div>
                    </div>
                    <div className="chat-box custom-scrollbar">
                        <div className="people-list friend-list">
                            <ul className="list">
                                {timeTableList}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default RightSidebar;