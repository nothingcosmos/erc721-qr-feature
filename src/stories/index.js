// @flow
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { MemoryRouter } from 'react-router-dom';

import { storiesOf, addDecorator } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import RegisterItem from '../components/RegisterItem';
import FloatingButton from '../components/FloatingButton';

import 'bootstrap/dist/css/bootstrap.css';

const Decorator = storyFn => (
  <MemoryRouter>
    <MuiThemeProvider>{storyFn()}</MuiThemeProvider>
  </MemoryRouter>
);

addDecorator(Decorator);

storiesOf('RegisterItem', module).add('default', () => (
  <RegisterItem onSubmit={action('submit')} />
));

storiesOf('FloatingButton', module).add('default', () => (
  <FloatingButton onClick={action('onClick')} />
));
