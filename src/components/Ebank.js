import React, { Component } from 'react';

class Ebank extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: []
        }
    }

    defaultPostRequestInfo(body = null) {
        return { method: "POST", headers: { "Content-Type": "application/json" }, body: body };
    }

    componentDidMount() {
        window.fetch("/admin/email/getEbanks", this.defaultPostRequestInfo()).then(response => response.json()).then(data => {
            this.setState({ dataSource: data });
        });

        window.initResponsiveComponent();
    }

    deleteEmail = (key) => {
        window.fetch("/admin/email/deleteEbank", this.defaultPostRequestInfo(JSON.stringify({ key: key }))).then(response => {
            if (response.status == 200) {
                this.setState({ dataSource: this.state.dataSource.filter(function (item) { return item.Id != key; }) });
            }
            else {
                console.log(response);
            }
        })
    }

    render() {
        return (
            <div className="todo-content">
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>ردیف</th>
                            <th>پست الکترونیکی</th>
                            <th>نام</th>
                            <th>نام خانوادگی</th>
                            <th>نام مستعار</th>
                            <th>کاربر ایجاد کننده</th>
                            <th data-res="false"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.dataSource.map((item, index) => {
                                return (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{item.Email}</td>
                                        <td>{item.FirstName}</td>
                                        <td>{item.LastName}</td>
                                        <td>{item.AliasName}</td>
                                        <td>{item.UserCreator}</td>
                                        <td data-res="fase">
                                            <a href="javascript:;" onClick={(event) => this.deleteEmail(item.Id)}> حذف </a>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Ebank;