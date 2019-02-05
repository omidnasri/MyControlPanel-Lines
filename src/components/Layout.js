import React from 'react';
import { Link } from 'react-router-dom';

export default props => (
    <div className="row">
        <div className="col-md-12">
            <div className="todo-sidebar">
                <div className="portlet light">
                    <div className="portlet-title">
                        <div className="caption" data-toggle="collapse" data-target=".todo-project-list-content">
                            <i className="fa fa-bars font-green-sharp"></i>
                                <span className="caption-subject font-green-sharp bold uppercase">
                                    دسترسی سریع
                                </span>
                        </div>
                    </div>
                    <div className="portlet-body todo-project-list-content">
                        <div className="todo-project-list">
                            <ul className="nav nav-pills nav-stacked">
                                <li>
                                    <Link to="/admin/email">
                                        <span className="badge badge-success"> 0 </span> مدیریت حساب ایمیل
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/socialnetwork/ebank">
                                        <span className="badge badge-success"> 0 </span> بانک ایمیل 
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                {props.children}
            </div>
        </div>
    </div>
);