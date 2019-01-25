import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testResultMessage: "",
      canSubmit: false,
      allowToTest: false,
      emailDetail: {
        Id: "",
        Address: "",
        Host: "",
        Port: "",
        EnableSsl: true,
        Status: true,
        UserName: "",
        Password: "",
        IsPublic: false,
        errors: {
          Id: "",
          Address: "",
          Host: "",
          Port: "",
          EnableSsl: "",
          Status: "",
          UserName: "",
          Password: "",
          IsPublic: ""
        }
      },
      testDetail: {
        To: "",
        Subject: "",
        Message: ""
      },
      dataSource: []
    };
  }

  defaultPostRequestInfo(body = null) {
    return { method: "POST", headers: { "Content-Type": "application/json" }, body: body };
  }

  componentDidMount() {
    this.onlineUpdateDataSource();
  }

  onlineUpdateDataSource() {
    window.fetch("/admin/email/getUserLines", this.defaultPostRequestInfo()).then(response => response.json()).then(data => {
      this.setState({ dataSource: data });
    });
  }

  componentDidUpdate() {
    window.dispatchEvent(new Event('resize'));
    Array.from(document.querySelectorAll("select")).forEach(x => x.dispatchEvent(new Event('change')));
  }

  submitHandleChange = (event) => {
    const { name, value } = event.target;
    this.setState(prevState => ({ emailDetail: { ...prevState.emailDetail, [name]: value } }), this.submitValidateField(name, value));
  }

  submitTestHandleChange = (event) => {
    const { name, value } = event.target;
    this.setState(prevState => ({ testDetail: { ...prevState.testDetail, [name]: value } }), this.canTest());
  }

  submitValidateField(name, value) {
    const emailDetail = this.state.emailDetail;

    switch (name) {
      case "Address":
        if (value === "") {
          emailDetail.errors.Address = "فیلد پست الکترونیکی الزامی است.";
        }
        else {
          const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
          if (emailTest.test(value)) {
            emailDetail.errors.Address = "";
          }
          else {
            emailDetail.errors.Address = "پست الکترونیکی وارد شده نامعتبر است.";
          }
        }
        break;
      case "Host":
        if (value === "") {
          emailDetail.errors.Host = "فیلد سرور میزبان الزامی است.";
        }
        else {
          emailDetail.errors.Host = "";
        }
        break;
      case "Port":
        const hostTest = /^\d+$/;
        if (value === "") {
          emailDetail.errors.Port = "فیلد پورت الزامی است.";
        }
        else {
          if (hostTest.test(value)) {
            emailDetail.errors.Port = "";
          }
          else {
            emailDetail.errors.Port = "پورت وارد شده نامعتبر است.";
          }
        }
        break;
      case "EnableSsl":
      case "IsPublic":
      case "Status":
        emailDetail.errors.EnableSsl = "";
        emailDetail.errors.IsPublic = "";
        emailDetail.errors.Status = "";
        break;
      case "UserName":
        if (value === "") {
          emailDetail.errors.UserName = "فیلد نام کاربری الزامی است.";
        }
        else {
          emailDetail.errors.UserName = "";
        }
        break;
      case "Password":
        if (value === "") {
          emailDetail.errors.Password = "فیلد رمز عبور الزامی است.";
        }
        else {
          emailDetail.errors.Password = "";
        }
        break;
    }

    this.setState({ emailDetail: emailDetail }, this.canSubmit());
  }

  canSubmit() {
    const canSubmit = this.state.emailDetail.errors.Address === "" && this.state.emailDetail.errors.Host === "" && this.state.emailDetail.errors.Port === "" && this.state.emailDetail.errors.UserName === "" && this.state.emailDetail.errors.Password === "";
    if (canSubmit != this.state.canSubmit) {
      this.setState({ canSubmit: canSubmit });
    }
  }

  canTest() {
    var canTest = this.state.testDetail.To !== "" && this.state.testDetail.Subject !== "" && this.state.testDetail.Message !== "";
    if (canTest != this.state.allowToTest) {
      this.setState({ allowToTest: canTest });
    }
  }

  errorClass(error) {
    return (error.length === 0 ? "" : "has-error");
  }

  fillStateBeforeSendData() {
    this.state.emailDetail.EnableSsl = document.querySelector("[name='EnableSsl']").value === "true";
    this.state.emailDetail.Status = document.querySelector("[name='Status']").value === "true";
  }

  submitEmailAccountInformation4Save = (event) => {
    if (this.state.canSubmit) {
      this.fillStateBeforeSendData();
      window.fetch("/admin/email/updateEmailAccountInformation", this.defaultPostRequestInfo(JSON.stringify(this.state.emailDetail))).then(response => response.json()).then(data => {
        let entities = this.state.dataSource;
        let key = this.state.emailDetail.Id;
        if (key !== 0) {
          entities = entities.filter(function (elem) { return elem.Id !== key });
        }
        entities.push(data);
        this.setState({ canSubmit: false, dataSource: entities });
        this.setState(prevState => ({ emailDetail: { ...prevState.emailDetail, Id: "", Address: "", Host: "", Port: "", UserName: "", Password: "" } }));
      });
    }
  }

  submitEmailAccountInformation4Test = (event) => {
    if (this.state.canSubmit && this.state.allowToTest) {
      this.fillStateBeforeSendData();
      window.fetch("/admin/email/testEmailAccountInformation", this.defaultPostRequestInfo(JSON.stringify({
        Address: this.state.emailDetail.Address,
        Host: this.state.emailDetail.Host,
        Port: this.state.emailDetail.Port,
        EnableSsl: this.state.emailDetail.EnableSsl,
        UserName: this.state.emailDetail.UserName,
        Password: this.state.emailDetail.Password,
        To: this.state.testDetail.To,
        Subject: this.state.testDetail.Subject,
        Message: this.state.testDetail.Message
      }))).then(response => response.json()).then(data => {
        this.setState({ allowToTest: false, testResultMessage: data });
        this.setState(prevState => ({ testDetail: { ...prevState.testDetail, To: "", Subject: "", Message: "" } }));
      });
    }
  }

  onEditEmail = (event) => {
    if (event.target.getAttribute("data-public") === "false") {
      let id = event.target.getAttribute("data-id");
      window.fetch("/admin/email/getEmailAccountInformationBy", this.defaultPostRequestInfo(JSON.stringify({ key: id }))).then(response => response.json()).then(data => {
        this.setState(prevState => ({ emailDetail: { ...prevState.emailDetail, Id: data.Id, Address: data.Address, Host: data.Host, Port: data.Port, EnableSsl: data.EnableSsl, Status: data.Status, UserName: data.UserName, Password: data.Password, IsPublic: data.IsPublic } }), this.canSubmit());
      });
    }
  }

  onDeleteEmail = (event) => {
    if (event.target.getAttribute("data-public") === "false") {
      let id = event.target.getAttribute("data-id");
      window.fetch("/admin/email/deleteEmailAccountInformation", this.defaultPostRequestInfo(JSON.stringify({ key: id }))).then(response => response.json()).then(data => {
        this.setState({ dataSource: this.state.dataSource.filter(function (elem) { return elem.Id != id; }) });
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
              <th>پست الکترونیکی</th>
              <th>سرور میزبان</th>
              <th>شماره پورت</th>
              <th>نام کاربری</th>
              <th>سطح دسترسی</th>
              <th>ارتباط SSL</th>
              <th>وضعیت سرویس تست</th>
              <th data-res="false"></th>
            </tr>
          </thead>
          <tbody>
            {
              props.parent.state.dataSource.map((item, index) => {
                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{item.Address}</td>
                    <td>{item.Host}</td>
                    <td>{item.Port}</td>
                    <td>{item.UserName}</td>
                    <td>{item.IsPublic ? "عمومی" : "مخفی"}</td>
                    <td>{item.EnableSsl ? "بله" : "خیر"}</td>
                    <td>{item.Status ? "فعال" : "غیرفعال"}</td>
                    <td data-res="false">
                      <a href="javascript:;" data-public={item.IsPublic} className={`${item.IsPublic ? "disabled-link" : ""}`} onClick={(event) => props.onEditEmail(event)} data-id={item.Id}> ویرایش </a>  |
                        <a href="javascript:;" data-public={item.IsPublic} className={`${item.IsPublic ? "disabled-link" : ""}`} onClick={(event) => props.onDeleteEmail(event)} data-id={item.Id}> حذف </a>
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
      <div className="row">
        <div className="col-md-12">
          <div className="todo-sidebar">
            <div className="portlet light">
              <div className="portlet-title">
                <div className="caption" data-toggle="collapse" data-target=".todo-project-list-content">
                  <i className="fa fa-bars font-green-sharp"></i>
                  <span className="caption-subject font-green-sharp bold uppercase">
                    شبکه‌های اجتماعی
                  </span>
                </div>
              </div>
              <div className="portlet-body todo-project-list-content">
                <div className="todo-project-list">
                  <ul className="nav nav-pills nav-stacked">
                    <li className="active">
                      <a href="#">
                        <span className="badge badge-success"> {this.state.dataSource.length} </span> تعریف حساب کاربری
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="todo-content">
            <div className="portlet light">
              <div className="portlet-title">
                <div className="caption">
                  <i className="fa fa-cogs font-green-sharp"></i>
                  <span className="bold caption-subject font-green-sharp">حساب کاربری پست الکترونیکی</span>
                </div>
              </div>
              <div className="portlet-body">
                <div className="form-body">
                  <div className="row">
                    <input type="hidden" name="Id" value={this.state.emailDetail.Id} />
                    <div className={`col-md-3 ${this.errorClass(this.state.emailDetail.errors.Address)}`}>
                      <div className="form-group">
                        <label htmlFor="Address">پست الکترونیکی فرستنده:</label>
                        <input type="text" name="Address" className="form-control" title="The default email address to use as a sender." value={this.state.emailDetail.Address} onChange={this.submitHandleChange} />
                      </div>
                    </div>
                    <div className={`col-md-3 ${this.errorClass(this.state.emailDetail.errors.Host)}`}>
                      <div className="form-group">
                        <label htmlFor="Host">سرور میزبان:</label>
                        <input type="input" name="Host" className="form-control" title="The SMTP server domain, e.g. smtp.mailprovider.com." value={this.state.emailDetail.Host} onChange={this.submitHandleChange} />
                      </div>
                    </div>
                    <div className={`col-md-3 ${this.errorClass(this.state.emailDetail.errors.Port)}`}>
                      <div className="form-group">
                        <label htmlFor="Port">شماره پورت:</label>
                        <input type="text" name="Port" className="form-control" title="The SMTP server port, usually 25." value={this.state.emailDetail.Port} onChange={this.submitHandleChange} />
                      </div>
                    </div>
                    <div className={`col-md-3 ${this.errorClass(this.state.emailDetail.errors.EnableSsl)}`}>
                      <div className="form-group">
                        <label htmlFor="EnableSsl">ارتباط SSL:</label>
                        <select name="EnableSsl" className="form-control select2me" title="Check if the SMTP server requires SSL communications" value={this.state.emailDetail.EnableSsl} onChange={() => this.submitHandleChange}>
                          <option value="true">بله</option>
                          <option value="false">خیر</option>
                        </select>
                      </div>
                    </div>
                    <div className={`col-md-3 ${this.errorClass(this.state.emailDetail.errors.Status)}`}>
                      <div className="form-group">
                        <label htmlFor="Status">وضعیت سرویس تست:</label>
                        <select name="Status" className="form-control select2me" value={this.state.emailDetail.Status} onChange={this.submitHandleChange}>
                          <option value="true">فعال</option>
                          <option value="false">غیرفعال</option>
                        </select>
                      </div>
                    </div>
                    <div className={`col-md-3 ${this.errorClass(this.state.emailDetail.errors.UserName)}`}>
                      <div className="form-group">
                        <label htmlFor="UserName">نام کاربری:</label>
                        <input type="text" name="UserName" className="form-control" title="The username for authentication." value={this.state.emailDetail.UserName} onChange={this.submitHandleChange} />
                      </div>
                    </div>
                    <div className={`col-md-6 ${this.errorClass(this.state.emailDetail.errors.Password)}`}>
                      <div className="form-group">
                        <label htmlFor="Password">رمز عبور:</label>
                        <div className="input-group">
                          <input type="password" name="Password" className="form-control" title="The password for authentication." value={this.state.emailDetail.Password} onChange={this.submitHandleChange} />
                          <span className="input-group-btn" onClick={this.submitEmailAccountInformation4Save}>
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
            <div className={`alert alert-warning alert-dismissable ${this.state.testResultMessage === "" ? "hidden" : ""}`}>
              {this.state.testResultMessage}
            </div>
            <div className="portlet light">
              <div className="portlet-title">
                <div className="caption">
                  <i className="fa fa-cogs font-green-sharp"></i>
                  <span className="bold caption-subject font-green-sharp">تست سرویس پست الکترونیکی</span>
                </div>
              </div>
              <div className="portlet-body">
                <div className="form-body">
                  <div className="row">
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="To">پست الکترونیکی به:</label>
                        <input type="text" name="To" className="form-control" value={this.state.testDetail.To} onChange={this.submitTestHandleChange} />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label htmlFor="Subject">عنوان:</label>
                        <input type="text" name="Subject" className="form-control" value={this.state.testDetail.Subject} onChange={this.submitTestHandleChange} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="Message">متن پیام:</label>
                      <div className="input-group">
                        <input type="text" name="Message" className="form-control" value={this.state.testDetail.Message} onChange={this.submitTestHandleChange} />
                        <span className="input-group-btn" onClick={this.submitEmailAccountInformation4Test}>
                          <button className="btn btn-primary" disabled={!(this.state.canSubmit && this.state.allowToTest)} type="button">
                            <i className="fa fa-arrow-left fa-fw"></i>
                            تســـت
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <this.renderTable parent={this} onDeleteEmail={this.onDeleteEmail} onEditEmail={this.onEditEmail} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
