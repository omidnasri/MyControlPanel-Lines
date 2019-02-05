import React, { Component } from 'react';

class Ebank extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: []
        }
    }

    componentDidMount() {
        window.fetch("/admin/email/getEbanks", { method: "POST", headers: { "Content-Type": "application/json" }}).then(response => response.json()).then(data => {
            this.setState({ dataSource: data });
        });

        window.initResponsiveComponent();
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