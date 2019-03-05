import React, { Component } from 'react';

class Slack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canSubmit: false,
      dataSource: [],
      slackDetail: {
        Id: "",
        Subject: "",
        UserName: "",
        Channel: "",
        Status: "",
        Description: "",
        WebhookUrl: "",
      }
    }
  }

  defaultPostRequestInfo(body = null) {
    return { method: "POST", headers: { "Content-Type": "application/json" }, body: body };
  }

  componentDidMount() {
    window.fetch("/admin/email/getSlacks", { method: "POST", headers: { "Content-Type": "application/json" } }).then(response => response.json()).then(data => {
      this.setState({ dataSource: data });
      window.Metronic.initTable();
    });
  }

  submitHandleChange = (event) => {
    const { name, value } = event.target;
    this.setState(prevState => ({ slackDetail: { ...prevState.slackDetail, [name]: value } }), this.canSubmit(this.state.slackDetail.WebhookUrl));
  }

  canSubmit(webhookUrl) {
    this.setState({ canSubmit: (webhookUrl !== "") });
  }

  onDeleteSlack = (event) => {
    const id = event.target.getAttribute("data-id");
    window.fetch("/admin/email/deleteEmailAccountInformation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: id }) }).then(response => response.json()).then(data => {
      this.setState({ dataSource: this.state.dataSource.filter(function (elem) { return elem.Id != id; }) });
    });
  }

  onEditSlack = (event) => {
    let id = event.target.getAttribute("data-id");
    window.fetch("/admin/email/getSlackBy", this.defaultPostRequestInfo(JSON.stringify({ key: id }))).then(response => response.json()).then(data => {
      this.setState(prevState => ({ slackDetail: { ...prevState.slackDetail, Id: data.Id, Subject: data.Subject, UserName: data.UserName, Channel: data.Channel, Status: data.Status, Description: data.Description, WebhookUrl: data.WebhookUrl } }), this.canSubmit(data.WebhookUrl));
    });
  }

  submitSlack4AddOrUpdate = (event) => {
    if (this.state.canSubmit) {
      window.fetch("/admin/email/addOrUpdateSlackAccount", this.defaultPostRequestInfo(JSON.stringify(this.state.slackDetail))).then(response => response.json()).then(data => {
        let entities = this.state.dataSource;
        let key = this.state.slackDetail.Id;
        if (key !== 0) {
          entities = entities.filter(function (elem) { return elem.Id !== key });
        }
        entities.push(data);
        this.setState({ canSubmit: false, dataSource: entities });
        this.setState(prevState => ({ slackDetail: { ...prevState.slackDetail, Id: "", Subject: "", UserName: "", Channel: "", Description: "", WebhookUrl: "" } }));
      });
    }
  }

  renderTable(props) {
    if (props.parent.state.dataSource.length === 0) {
      return null;
    }
    else {
      return (
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>ردیف</th>
              <th>عنوان</th>
              <th>نام کاربری</th>
              <th>نام کانال</th>
              <th>وضعیت</th>
              <th>توضیحات</th>
              <th>آدرس وب‌هوک</th>
              <th data-res="false"></th>
            </tr>
          </thead>
          <tbody>
            {
              props.parent.state.dataSource.map((item, index) => {
                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{item.Subject}</td>
                    <td>{item.UserName}</td>
                    <td>{item.Channel}</td>
                    <td>{item.Status ? "فعال" : "غیرفعال"}</td>
                    <td>{item.Description}</td>
                    <td>{item.WebhookUrl}</td>
                    <td data-res="false">
                      <a href="javascript:;" onClick={(event) => props.onEditSlack(event)} data-id={item.Id}> ویرایش </a>  |
                      <a href="javascript:;" onClick={(event) => props.onDeleteSlack(event)} data-id={item.Id}> حذف </a>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      );
    }
  }

  render() {
    return (
      <div className="todo-content">
        <div className="portlet light">
          <div className="portlet-title">
            <div className="caption">
              <i className="fa fa-cogs font-green-sharp"></i>
              <span className="bold caption-subject font-green-sharp">حساب کاربری اســــــــــلک</span>
            </div>
          </div>
          <div className="portlet-body">
            <div className="form-body">
              <div className="row">
                <input type="hidden" name="Id" value={this.state.slackDetail.Id} />
                <div className="col-md-3">
                  <div className="form-group">
                    <label for="Subject">عنوان:</label>
                    <input type="input" name="Subject" className="form-control" value={this.state.slackDetail.Subject} onChange={this.submitHandleChange} />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label for="UserName">نام کاربری:</label>
                    <input type="text" name="UserName" className="form-control" value={this.state.slackDetail.UserName} onChange={this.submitHandleChange} />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label for="Channel">نام کانال:</label>
                    <input type="input" name="Channel" className="form-control" value={this.state.slackDetail.Channel} onChange={this.submitHandleChange} />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label for="Description">توضیحات:</label>
                    <input type="input" name="Description" className="form-control" value={this.state.slackDetail.Description} onChange={this.submitHandleChange} />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <label for="WebhookUrl">آدرس وب‌هوک:</label>
                    <div className="input-group">
                      <input type="input" name="WebhookUrl" className="form-control" value={this.state.slackDetail.WebhookUrl} onChange={this.submitHandleChange} />
                      <span className="input-group-btn" onClick={this.submitSlack4AddOrUpdate}>
                        <button className="btn btn-success" disabled={!this.state.canSubmit} type="button">
                          <i className="fa fa-save"></i> ذخیره
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <this.renderTable parent={this} onDeleteSlack={this.onDeleteSlack} onEditSlack={this.onEditSlack} />
      </div>
    );
  }
}

export default Slack;