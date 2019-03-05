import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Email from './components/Email'
import Ebank from './components/Ebank';
import Slack from './components/Slack';


export default () => (
    <BrowserRouter>
        <Layout>
            <Route exact path="/admin/email" component={Home} />
            <Route path="/admin/email/email/:key" component={Email} />
            <Route path="/admin/socialnetwork/ebank" component={Ebank} />
            <Route path="/admin/socialnetwork/slack" component={Slack} />
        </Layout>
    </BrowserRouter>
);
