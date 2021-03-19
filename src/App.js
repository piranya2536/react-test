import React, { useState } from "react";
import "antd/dist/antd.css";
import {
  Table, 
  TimePicker, 
  DatePicker, 
  AutoComplete,
  Layout, 
  Card, 
  Row,
  Col
} from "antd";
import reqwest from "reqwest";

const { Header, Footer, Sider, Content } = Layout;

const getRandomuserParams = params => ({
  results: params.pagination.pageSize,
  page: params.pagination.current,
  ...params
});

const getSearchuserParams = params => ({
  name: params.name,
  ...params
});

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.first.localeCompare(b.name.last),
    render: name => `${name.first} ${name.last}`,
    width: "20%"
  },
  {
    title: "Gender",
    dataIndex: "gender",
    sorter: (a, b) => a.gender.localeCompare(b.gender),
    width: "20%"
  },
  {
    title: "Email",
    dataIndex: "email"
  }
];

const cardStyle = {
  marginBottom: "8px",
};

export default class App extends React.Component {

  state = {
    data: [],
    pagination: {
      current: 1,
      pageSize: 10
    },
    loading: false,
    inputLoading: false,
    options: []
  };

  componentDidMount() {
    const { pagination } = this.state;
    this.fetch({ pagination });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.fetch({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters
    });
  };

  handleSearch = value => {
    this.setState({ inputLoading: true });
    let initialNames = [];
    reqwest({
      url: "https://6053890845e4b30017291edb.mockapi.io/users",
      method: "get",
      type: "json",
      data: getSearchuserParams({name:value})
    }).then(data => {
      initialNames = data.results.map((user) => {
        return {value: user.name}
      });
      console.log(initialNames);
      this.setState({
        inputLoading: false,
        options: initialNames
      });
    });
  };

  fetch = (params = {}) => {
    this.setState({ loading: true });
    reqwest({
      url: "https://randomuser.me/api",
      method: "get",
      type: "json",
      data: getRandomuserParams(params)
    }).then(data => {
      console.log(data);
      this.setState({
        loading: false,
        data: data.results,
        pagination: {
          ...params.pagination,
          total: 200
        }
      });
    });
  };

  render() {
    const { data, pagination, loading, options, inputLoading } = this.state;
    return (
      <>
        <Layout>
          <Content>
            <Row>
              <Col span={24}>
                <Card title="AutoComplete Input" style={cardStyle}>
                  <AutoComplete
                    options={options}
                    style={{ width: "100%" }}
                    onSearch={this.handleSearch}
                    placeholder="input here"
                    loading={inputLoading}
                  />
                </Card>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Card title="DatePicker Input" style={cardStyle}>
                  <DatePicker style={{ width: "100%" }} />
                </Card>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Card title="TimePicker Input" style={cardStyle}>
                  <TimePicker style={{ width: "100%" }} />
                </Card>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Table
                  columns={columns}
                  rowKey={record => record.login.uuid}
                  dataSource={data}
                  pagination={pagination}
                  loading={loading}
                  onChange={this.handleTableChange}
                  scroll={{ x: 400 }}
                />
              </Col>
            </Row>
          </Content>
        </Layout>
      </>
    );
  }
}