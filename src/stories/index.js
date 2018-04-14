// @flow
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { storiesOf, addDecorator } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import 'bootstrap/dist/css/bootstrap.css';

import TokenCard from '../components/TokenCard';
import RequestCard from '../components/RequestCard';
import TokenDetail from '../components/TokenDetail';
import Home from '../components/Home';
import RegisterToken from '../components/RegisterToken';
import FloatingButtons from '../components/FloatingButtons';
import CameraModal from '../components/CameraModal';
import RequestModal from '../components/RequestModal';
import TransferModal from '../components/TransferModal';

const Decorator = storyFn => <MuiThemeProvider>{storyFn()}</MuiThemeProvider>;

addDecorator(Decorator);

const address = '0xe78a0f7e598cc8b0bb87894b0f60dd2a88d6a8ab';

const token = {
  name: 'Card Title',
  address,
  description:
    'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.',
  createdAt: 'Mar. 31, 2018',
  image:
    'https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180',
  onClick: action('onClick'),
};

const tokenCard = (
  <TokenCard
    name={token.name}
    address={token.address}
    description={token.description}
    createdAt={token.createdAt}
    image={token.image}
    onClick={token.onClick}
  />
);

storiesOf('Home', module).add('default', () => (
  <Home>
    {tokenCard}
    {tokenCard}
    {tokenCard}
    {tokenCard}
    {tokenCard}
  </Home>
));

storiesOf('TokenCard', module).add('default', () => tokenCard);

storiesOf('TokenDetail', module)
  .add('isOwner', () => (
    <TokenDetail
      tokenId="114514"
      name={token.name}
      owner={token.address}
      description={token.description}
      image={token.image}
      createdAt={token.createdAt}
      isOwner
      handleTransfer={action('Transfer')}
      handleSendRequest={action('SendRequest')}
    />
  ))
  .add('is not Owner', () => (
    <TokenDetail
      tokenId="hello, world"
      name={token.name}
      owner={token.address}
      description={token.description}
      image={token.image}
      createdAt={token.createdAt}
      handleTransfer={action('Transfer')}
      handleSendRequest={action('SendRequest')}
    />
  ));

storiesOf('RequestCard', module)
  .add('isOwner', () => (
    <RequestCard
      client={address}
      message="よろしくお願いします"
      createdAt={token.createdAt}
      isOwner
    />
  ))
  .add('isClient', () => (
    <RequestCard
      client={address}
      message="よろしくお願いします"
      createdAt={token.createdAt}
      isClient
    />
  ));

storiesOf('RegisterToken', module).add('default', () => (
  <RegisterToken onSubmit={action('submit')} />
));

storiesOf('FloatingButton', module).add('default', () => (
  <FloatingButtons
    moveToRegister={action('register')}
    moveToAccount={action('account')}
    moveToToken={action('token')}
  />
));

storiesOf('CameraModal', module).add('default', () => (
  <CameraModal modal toggle={action('toggle')} onScan={action('onScan')} />
));

storiesOf('RequestModal', module).add('default', () => (
  <RequestModal modal toggle={action('toggle')} onSubmit={action('onSubmit')} />
));

storiesOf('TransferModal', module).add('default', () => (
  <TransferModal
    modal
    toggle={action('toggle')}
    from={address}
    tokenId="0xabcdef"
    onSubmit={action('onSubmit')}
    isAddress={s => s.length > 0}
  />
));
