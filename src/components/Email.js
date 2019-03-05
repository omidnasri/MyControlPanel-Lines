import React, { Component } from 'react';

class EmailSendItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: []
        }
    }

    defaultPostRequestInfo(body = null) {
        return { method: "POST", headers: { "Content-Type": "application/json" }, body: body };
    }

    componentDidMount = () => {
        const { params } = this.props.match;
        window.fetch("/admin/email/getEmails", this.defaultPostRequestInfo(JSON.stringify({ lineId: params.key }))).then(response => response.json()).then(data => {
            this.setState({ dataSource: data });
        });

        window.Metronic.initSlimScroll('.scroller');
    }

    render() {
        return (
            <div className="todo-content">
                <div className="portlet light">
                    <div className="portlet-title">
                        <div className="caption">
                            <i className="icon-bar-chart font-green-sharp hide"></i>
                            <span className="caption-subject font-green-sharp bold uppercase">
                                مدیریت پیام‌های ارسالی - دریافتی
                            </span>
                        </div>
                    </div>
                    <div className="portlet-body">
                        <div className="row">
                            <div className="col-md-5 col-sm-4">
                                <div className="scroller" data-rail-visible="0" data-handle-color="#dae3e7">
                                    <div className="todo-tasklist">
                                        {
                                            this.state.dataSource.map((item, index) => {
                                                return (
                                                    <div className="todo-tasklist-item todo-tasklist-item-border-blue">
                                                        <img className="todo-userpic pull-left" src="../../assets/admin/layout2/img/avatar6.jpg" width="27px" height="27px" />
                                                        <div className="todo-tasklist-item-title">
                                                            {item.Subject}
                                                        </div>
                                                        <div className="todo-tasklist-item-text">
                                                            {item.Message}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="todo-tasklist-devider">
                            </div>
                            <div className="col-md-7 col-sm-8">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EmailSendItems;