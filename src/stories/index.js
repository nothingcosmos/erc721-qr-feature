// @flow
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { storiesOf, addDecorator } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import ItemCard from '../components/ItemCard';
import RequestCard from '../components/RequestCard';
import ItemDetail from '../components/ItemDetail';
import Home from '../components/Home';
import RegisterItem from '../components/RegisterItem';
import AddItemButton from '../components/AddItemButton';
import CameraModal from '../components/CameraModal';

import 'bootstrap/dist/css/bootstrap.css';

const Decorator = storyFn => <MuiThemeProvider>{storyFn()}</MuiThemeProvider>;

addDecorator(Decorator);

const address = '0xe78a0f7e598cc8b0bb87894b0f60dd2a88d6a8ab';

const item = {
  name: 'Card Title',
  address: address,
  description:
    'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.',
  createdAt: 'Mar. 31, 2018',
  image:
    'https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180',
  onClick: action('onClick'),
};

const itemCard = (
  <ItemCard
    name={item.name}
    address={item.address}
    description={item.description}
    createdAt={item.createdAt}
    image={item.image}
    onClick={item.onClick}
  />
);

storiesOf('Home', module).add('default', () => (
  <Home>
    {itemCard}
    {itemCard}
    {itemCard}
    {itemCard}
    {itemCard}
  </Home>
));

storiesOf('ItemCard', module).add('default', () => itemCard);

storiesOf('ItemDetail', module)
  .add('isOwner', () => (
    <ItemDetail
      name={item.name}
      owner={item.address}
      description={item.description}
      image={item.image}
      createdAt={item.createdAt}
      isOwner
      handleTransfer={action('Transfer')}
      handleSendRequest={action('SendRequest')}
    />
  ))
  .add('is not Owner', () => (
    <ItemDetail
      name={item.name}
      owner={item.address}
      description={item.description}
      image={item.image}
      createdAt={item.createdAt}
      handleTransfer={action('Transfer')}
      handleSendRequest={action('SendRequest')}
    />
  ));

storiesOf('RequestCard', module)
  .add('isOwner', () => (
    <RequestCard
      client={address}
      message="よろしくお願いします"
      createdAt={item.createdAt}
      isOwner
    />
  ))
  .add('isClient', () => (
    <RequestCard
      client={address}
      message="よろしくお願いします"
      createdAt={item.createdAt}
      isClient
    />
  ));

storiesOf('RegisterItem', module).add('default', () => (
  <RegisterItem onSubmit={action('submit')} />
));

storiesOf('FloatingButton', module).add('default', () => (
  <AddItemButton
    handleRegister={action('register')}
    handleCamera={action('camera')}
  />
));

storiesOf('CameraModal', module).add('default', () => (
  <CameraModal modal={true} toggle={action('toggle')} />
));
