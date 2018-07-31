// @flow
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { storiesOf, addDecorator } from '@storybook/react';
import { action } from '@storybook/addon-actions';
// eslint-disable-next-line no-unused-vars
import { linkTo } from '@storybook/addon-links';

import * as Web3 from 'web3';

import 'bootstrap/dist/css/bootstrap.css';

import TokenCard from '../components/TokenCard';
import RequestCard from '../components/RequestCard';
import {TokenDetail} from '../components/TokenDetail';
import Home from '../components/Home';
import RegisterToken from '../components/RegisterToken';
import FloatingButtons from '../components/FloatingButtons';
import CameraModal from '../components/CameraModal';
import RequestModal from '../components/RequestModal';
import TransferModal from '../components/TransferModal';
import UserDetailModal from '../components/UserDetailModal';
import RemoveCardModal from '../components/RemoveCardModal';
import Web3Status from '../components/Web3Status';
import AccountDetail from '../components/AccountDetail';
import SignInModal from '../components/SignInModal';

const Decorator = storyFn => <MuiThemeProvider>{storyFn()}</MuiThemeProvider>;
const web3 = new Web3();

addDecorator(Decorator);

const address = '0xe78a0f7e598cc8b0bb87894b0f60dd2a88d6a8ab';

const authUser = {
  uid:"abcdedf",
  displayName: "sakacho",
  email: "sakacho@gmail.com",
  photoURL:"https://pbs.twimg.com/profile_images/967955933/2003121103_normal.jpg",
  provider:"twitter",
};

const token = {
  name: 'Card Title',
  address,
  identity: 'identity id=0123456789',
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
      identity={token.identity}
      description={token.description}
      image={token.image}
      createdAt={token.createdAt}
      isAccountAvailable
      isOwner
      handleTransfer={action('Transfer')}
      handleSendRequest={action('SendRequest')}
      handleRemove={action('Remove')}
    />
  ))
  .add('is not Owner', () => (
    <TokenDetail
      tokenId="hello, world"
      name={token.name}
      owner={token.address}
      identity={token.identity}
      description={token.description}
      image={token.image}
      createdAt={token.createdAt}
      isAccountAvailable
      isOwner={false}
      handleTransfer={action('transfer')}
      handleSendRequest={action('add request')}
      handleRemove={action('dummy')}
    />
  ));

storiesOf('RequestCard', module)
  .add('isOwner', () => (
    <RequestCard
      client={address}
      message="よろしくお願いします"
      createdAt={token.createdAt}
      isOwner
      isClient={false}
      handleTransfer={action('transfer')}
      handleDelete={action('delete')}
    />
  ))
  .add('isClient', () => (
    <RequestCard
      client={address}
      message="よろしくお願いします"
      createdAt={token.createdAt}
      isOwner={false}
      isClient
      handleTransfer={action('transfer')}
      handleDelete={action('delete')}
    />
  ));

storiesOf('RegisterToken', module).add('default', () => (
  <RegisterToken onSubmit={action('submit')} />
));

storiesOf('FloatingButton', module).add('default', () => (
  <FloatingButtons
    isAccountAvailable
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
    isAddress={web3.isAddress}
  />
));

storiesOf('RemoveCardModal', module).add('default', () => (
  <RemoveCardModal
    modal
    toggle={action('toggle')}
    from={address}
    tokenId="0xabcdef"
    onSubmit={action('Remove')}
  />
));

storiesOf('AccountDetail', module).add('default', () => (
  <AccountDetail
    authUser={authUser}
  />
));

storiesOf('UserDetailModal', module).add('default', () => (
  <UserDetailModal
    modal
    toggle={action('toggle')}
    authUser={authUser}
  />
));

storiesOf('SignInModal', module).add('default', () => (
  <SignInModal
    modal
    toggle={action('toggle')}
    accountAddress={address}
  />
));

storiesOf('Web3Status', module).add('default', () => (
  <Web3Status
    isConnected
    networkName="Ropsten"
    accountAddress={address}
    contractAddress={address}
    refreshNetworkName={action('refreshNetworkName')}
    refreshAccountAddress={action('refreshAccountAddress')}
    updateContractAddress={action('updateContractAddress')}
    isAddress={web3.isAddress}
  />
));
