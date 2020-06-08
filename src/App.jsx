import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Login from './pages/login';
import { ConfigProvider } from 'antd';
import Layout from './layout';
// import { Provider } from 'react-redux';
// import store from './config/store';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

const App = () => {
  moment.locale('zh-cn');
  return (
    <ConfigProvider locale={zhCN}>
    {/* <Provider store={store}> */}
    <Router>
      <Switch>
        <Route exact path="/index" 
        // component = {Login}
        component = {(props) => <Login { ...props } /> }
        />
        <Route path="/"  
        // component = {Layout}
        component = {(props) => <Layout { ...props } /> }
        />
      </Switch>
    </Router>
    {/* </Provider> */}
    </ConfigProvider>
  );
};

export default App;