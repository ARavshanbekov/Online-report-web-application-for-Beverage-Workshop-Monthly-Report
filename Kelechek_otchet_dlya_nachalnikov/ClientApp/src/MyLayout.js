// in src/MyLayout.js
import React, { Component } from 'react';
import { Layout } from 'react-admin';
import Menu from './Menu';

const MyLayout = (props) => <Layout {...props} menu={Menu} />;

export default MyLayout;