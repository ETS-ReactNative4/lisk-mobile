import React, { Component, Fragment } from 'react';
import {
  Text,
  ScrollView,
  NativeModules,
  NativeEventEmitter,
  View,
  Picker,
} from 'react-native';
import Lisk from '@liskhq/lisk-client';
import { getAccount } from '../../utilities/api/account';
import { SecondaryButton, IconButton } from '../toolBox/button';
import Icon from '../toolBox/icon';
import reg from '../../constants/regex';
import { getPassphraseFromKeyChain } from '../../utilities/passphrase';
import { colors } from '../../constants/styleGuide';
import ThemeContext from '../../contexts/theme';
import Input from '../toolBox/input';
import Avatar from '../avatar/index';
import styles from './styles';
import Confirm from './imessageCofirm';

const config = {
  nodes: ['https://testnet.lisk.io'],
  nethash: 'net',
};

let ActivePeer;
const liskAPIClient = new Lisk.APIClient(config.nodes, {
  nethash: config.nethash,
});
liskAPIClient.node.getConstants().then((response) => {
  // loadingFinished('getConstants');
  config.nethash = response.data.nethash;
  ActivePeer = new Lisk.APIClient(config.nodes, {
    nethash: config.nethash,
  });
});

const { MessagesManager } = NativeModules;
const MessagesEvents = new NativeEventEmitter(MessagesManager);

class LiskMessageExtension extends Component {
  state = {
    account: 'yashar',
    address: {
      value: '',
      validity: -1,
    },
    avatarPreview: false,
    num: [0, 0, 0, 0],
    presentationStyle: '',
    message: {},
    conversation: '',
  };

  validator = {
    address: (str) => {
      if (str === '') return 2;
      return reg.address.test(str) ? 0 : 1;
    },
  };

  setAddress = (value) => {
    clearTimeout(this.avatarPreviewTimeout);
    const validity = this.validator.address(value);
    if (validity === 0) {
      this.setAvatarPreviewTimeout();
    }
    this.setState({
      address: {
        value,
        validity,
      },
      avatarPreview: false,
    });
  };

  getBalance = () => {
    getAccount(ActivePeer, this.state.address.value).then((res) => {
      this.setState({
        balance: res.balance,
      });
    });
  };

  componentDidMount = () => {
    getPassphraseFromKeyChain().then((account) => {
      if (account) {
        this.userData = {
          passphrase: account.password,
          address: account.username,
        };
        this.setState({
          passphrase: account.password,
          address: {
            value: account.username,
          },
          avatarPreview: true,
        });
      }
    });
    MessagesManager.getActiveConversation((conversation, message) =>
      this.setState({
        conversation,
        message,
        parsedData: this.parseUrl(message.url),
      }));

    MessagesManager.getPresentationStyle(presentationStyle =>
      this.setState({ presentationStyle }));

    MessagesEvents.addListener(
      'onPresentationStyleChanged',
      ({ presentationStyle }) => this.setState({ presentationStyle }),
    );

    MessagesEvents.addListener(
      'didSelectMessage',
      ({ conversation, message }) => this.setState({
        conversation,
        message,
        parsedData: this.parseUrl(message.url),
      }),
    );

    MessagesEvents.addListener(
      'didStartSendingMessage',
      ({ conversation }) => this.setState({
        conversation,
        message: {},
        avatarPreview: !!this.userData.address,
        num: [0, 0, 0, 0],
        address: {
          value: this.userData.address || '',
          validity: -1,
        },
      }),
    );
  };

  keyBoardFocused = () => {
    MessagesManager.updatePresentationStyle('expanded');
  }

  composeMessage = ({ address, amount, state = 'requested' }) => {
    if (address.validity !== 1) {
      const url = `?address=${address.value}&amount=${amount}&state=${state}`;
      // this.setState({ url });
      MessagesManager.updatePresentationStyle('compact');
      MessagesManager.composeMessage({
        summaryText: 'Summary Text',
        url,
        layout: {
          imageTitle: '',
          caption: `${amount}LSK is ${state}`,
          subcaption: `by ${address.value}`,
        },
      })
        .then(() => true)
        .catch(console.log);
    }
  };

  onTogglePresentationStyle = () => {
    MessagesManager.updatePresentationStyle(this.state.presentationStyle === 'expanded' ? 'compact' : 'expanded')
      .then(presentationStyle => this.setState({ presentationStyle }))
      .catch(console.log);
  };

  changePicker = (itemValue, itemIndex) => {
    this.setState({
      num: this.state.num.map((item, index) =>
        (index === itemIndex ? itemValue : item)),
    });
  };

  setAvatarPreviewTimeout = () => {
    this.avatarPreviewTimeout = setTimeout(() => {
      this.setState({
        avatarPreview: true,
      });
    }, 300);
  };


  parseUrl = (url) => {
    const parsedData = url.substring(1).replace(/&/g, '","').replace(/=/g, '":"');
    return JSON
      .parse(
        `{"${parsedData}"}`,
        (key, value) => (key === '' ? value : decodeURIComponent(value)),
      );
  }

  render() {
    const {
      address, avatarPreview, num, presentationStyle, message, parsedData,
      passphrase,
    } = this.state;

    const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const send = () => this.composeMessage({
      address,
      amount: `${num[0]}${num[1]}.${num[2]}${num[3]}`,
    });
    return (
      <ThemeContext.Provider value="light">
        <ScrollView style={styles.container}>
          <Text onPress={() => NativeModules.DevMenu.reload()}>
            reload
          </Text>

          {message.url ?
            <Fragment>{
              (parsedData.state === 'rejected') ?
                <Text> this request has been rejected</Text> :
                <Confirm
                  sharedData={parsedData}
                  passphrase={passphrase}
                  activePeer={ActivePeer}
                  composeMessage={this.composeMessage} />
            }</Fragment> :
            <Fragment>
              <View style={styles.rowContainer}>
                <View style={styles.innerContainer}>
                  <Text style={styles.pickerPoint}>.</Text>
                  {num.map((val, index) => (
                    <Picker
                      key={index}
                      selectedValue={num[index]}
                      style={styles.pickers}
                      itemStyle={styles.pickerItem}
                      itemTextStyle={{ fontSize: 18, color: 'blue' }}
                      onValueChange={itemValue =>
                        this.changePicker(itemValue, index)
                      }
                    >
                      {data.map(item => (
                        <Picker.Item
                          key={item}
                          label={item.toString()}
                          value={item}
                          color={num[index] === item ? '#000' : 'rgba(0, 0, 0, 0.3)'}
                        />
                      ))}
                    </Picker>
                  ))}
                </View>
              </View>
              <View style={styles.addressContainer}>
                {
                  avatarPreview ?
                    <Avatar
                      style={styles.avatar}
                      address={address.value}
                      size={34}
                    /> :
                    <Icon
                      style={styles.avatar}
                      name='avatar-placeholder'
                      size={34}
                      color={colors.light.gray5}
                    />
                }
                <Input
                  autoCorrect={false}
                  placeholder='Enter a address'
                  reference={(input) => {
                    this.input = input;
                  }}
                  onChange={this.setAddress}
                  onFocus={this.keyBoardFocused}
                  value={address.value}
                  error={address.validity === 1 ? 'Invalid address' : ''}

                  innerStyles={{
                    errorMessage: styles.errorMessage,
                    input: [
                      styles.input,
                      styles.addressInput,
                    ],
                    containerStyle: styles.addressInputContainer,
                  }}
                />
                {
                  presentationStyle === 'compact' ?
                    <IconButton
                      style={styles.iconButton}
                      title=''
                      icon={'forward'}
                      color={colors.light.white}
                      iconSize={20}
                      onClick={send} /> : null
                }
              </View>
              {
                presentationStyle === 'expanded' ?
                  <SecondaryButton
                    style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}
                    title="Request"
                    onClick={send}
                  /> : null
              }

            </Fragment>}
        </ScrollView>
      </ThemeContext.Provider>
    );
  }
}

export default LiskMessageExtension;