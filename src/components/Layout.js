import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Layout extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <div class="alert alert-warning">
                        <p>
                            گام دوم، حساب کاربری جدید ثبت نماید تا برای اعلان هشدار از آن استفاده شود یا از خطوط پیشفرض موجود استفاده کنید.
                        </p>
                    </div>
                </div>
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
                                        <li class="divider"></li>
                                        <li>
                                            <Link to="/admin/socialnetwork/slack">
                                                <span className="badge badge-success"> 0 </span> مدیریت حساب اسلک
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

export default Layout;