import React, { Component } from "react";
import { Link, Redirect } from 'react-router-dom';
import Grid from "react-bootstrap/lib/Grid";
import Row from "react-bootstrap/lib/Row";
import Col from "react-bootstrap/lib/Col";
import Modal from "react-bootstrap/lib/Modal";
import UserList from "../components/UserList";
import ChatBox from "../components/ChatBox";
import ErrorModal from "../components/ErrorModal";
import LoadingModal from "../components/LoadingModal";
import "react-chat-elements/dist/main.css";
import { connect } from 'react-redux';
import "../index.css";
import io from "socket.io-client";
import { fetchUsers } from "../requests";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import axios from "axios";
import { userActions } from '../_actions';
import { constant } from '../constant';
import { Alert } from "react-bootstrap";

/**
 * Fetches socket server URL from env
 */
// const SOCKET_URI = process.env.REACT_APP_SERVER_URI;
const SOCKET_URI = constant.ENV_PORT2;

/**
 * App Component
 *
 * initiaites Socket connection and handle all cases like disconnected,
 * reconnected again so that user can send messages when he is back online
 *
 * handles Error scenarios if requests from Axios fails.
 *
 */

class ChatStart extends Component {
  socket = null;

  constructor(props) {
    super(props);
  }

  state = {
    signInModalShow: false,
    users: [], // Avaiable users for signing-in
    userChatData: [], // this contains users from which signed-in user can chat and its message data.
    user: null, // Signed-In User
    selectedUserIndex: null,
    showChatBox: false, // For small devices only
    showChatList: true, // For small devices only
    error: false,
    // OldMessage:false,
    errorMessage: ""
  };

  /**
   *
   * Setups Axios to monitor XHR errors.
   * Initiates and listen to socket.
   * fetches User's list from backend to populate.
   */

  async componentDidMount() {
    if (!sessionStorage.getItem('user')) {
      return <Redirect from="*" to="/login" />
    }
    this.props.getAllUser()
    fetchUsers().then(users => { })
    const { items } = this.props;
    this.initAxios();
    this.initSocketConnection();
    await fetchUsers().then(users => this.setState({ users, signInModalShow: false }));
    this.setupSocketListeners();
    let users = await JSON.parse(sessionStorage.getItem('user'));
    let user = await {
      id: users.id,
      name: users.firstName + " " + users.lastName
    }
    await this.socket.emit("sign-in", user);
    let userChatData = await this.state.users.filter(u => u.id !== user.id);
    await this.setState({ user, signInModalShow: false, userChatData });
  }

  async componentWillUpdate() {
    const $messages = document.querySelector('.message-list .rce-mlist')
    var x = document.querySelector(".message-list .rce-mlist .message");
    console.log('xxxxxxxxxxxxx', x)
    if ($messages && x) {
      document.querySelector('.message-list .rce-mlist').lastChild.scrollIntoView({
        behavior: "smooth"
      });
    }
  }
  async componentWillReceiveProps(items) {
    if (items.length > 0) {
      await this.setState({ users: items.items })
      var userChatData = await items.items.filter(u => u.id !== this.state.user.id);
      await this.setState({ signInModalShow: false, userChatData });
    }
  }

  getData() {
    setTimeout(() => {
      let users = JSON.parse(sessionStorage.getItem('user'));
      let user = {
        id: users.id,
        name: users.firstName + " " + users.lastName
      }
      this.socket.emit("sign-in", user);
      let userChatData = this.state.users.filter(u => u.id !== user.id);
      this.setState({ user, signInModalShow: false, userChatData });

    }, 1000)
  }

  initSocketConnection() {
    this.socket = io.connect(SOCKET_URI);
  }

  /**
   *
   * Checks if request from axios fails
   * and if it does then shows error modal.
   */

  initAxios() {
    axios.interceptors.request.use(
      config => {
        this.setState({ loading: true });
        return config;
      },
      error => {
        this.setState({ loading: false });
        this.setState({
          errorMessage: `Couldn't connect to server. try refreshing the page.`,
          error: true
        });
        return Promise.reject(error);
      }
    );
    axios.interceptors.response.use(
      response => {
        this.setState({ loading: false });
        return response;
      },
      error => {
        this.setState({ loading: false });
        this.setState({
          errorMessage: `Some error occured. try after sometime`,
          error: true
        });
        return Promise.reject(error);
      }
    );
  }
  /**
   *
   * Shows error if client gets disconnected.
   */
  onClientDisconnected() {
    NotificationManager.error(
      "Connection Lost from server please check your connection.",
      "Error!"
    );
  }
  /**
   *
   * Established new connection if reconnected.
   */
  onReconnection() {
    if (this.state.user) {
      this.socket.emit("sign-in", this.state.user);
      NotificationManager.success("Connection Established.", "Reconnected!");
    }
  }

  /**
   *
   * Setup all listeners
   */

  setupSocketListeners() {
    this.socket.on("message", this.onMessageRecieved.bind(this));
    this.socket.on("reconnect", this.onReconnection.bind(this));
    this.socket.on("disconnect", this.onClientDisconnected.bind(this));
  }

  /**
   *
   * @param {MessageRecievedFromSocket} message
   *
   * Triggered when message is received.
   * It can be a message from user himself but on different session (Tab).
   * so it decides which is the position of the message "right" or "left".
   *
   * increments unread count and appends in the messages array to maintain Chat History
   */

  async onMessageRecieved(message) {
    console.log('message', message)
    await this.props.getAllUser(this.state.users)
    if (message.length) {
      // this.setState({ OldMessage:false });
      for (var i = 0; i < message.length; i++) {
        let userChatData = this.state.userChatData;
        let messageData = message[i].message;
        let targetId;
        if (message[i].from === this.state.user.id) {
          messageData.position = "right";
          targetId = message[i].to;
        } else {
          messageData.position = "left";
          targetId = message[i].from;
        }
        let targetIndex = userChatData.findIndex(u => u.id === targetId);
        if (!userChatData[targetIndex].messages) {
          userChatData[targetIndex].messages = [];
        }
        if (targetIndex !== this.state.selectedUserIndex) {
          if (!userChatData[targetIndex].unread) {
            userChatData[targetIndex].unread = 0;
          }
          // userChatData[targetIndex].unread++;
        }
        if (message[i].seen == false && this.state.user.id !== message[i].from) {
          userChatData[targetIndex].unread++;
        }
        userChatData[targetIndex].messages.push(messageData);
        this.setState({ userChatData });
      }
    } else {
      // this.setState({ OldMessage:true });
      let userChatData = this.state.userChatData;
      let messageData = message.message;
      let targetId;
      if (message.from === this.state.user.id) {

        messageData.position = "right";
        targetId = message.to;

        let targetIndex = this.state.users.findIndex(u => u.id === message.to);
        if (this.state.users[targetIndex].id == message.to) {
          var sortData = await this.state.users.filter(u => u.id !== message.to);
          sortData.unshift(this.state.users[targetIndex])
          await this.setState({ selectedUserIndex: 0 })
        }
        else {
          sortData = this.state.users
        }
      } else {
        messageData.position = "left";
        targetId = message.from;
        let targetIndex = this.state.users.findIndex(u => u.id === message.from);

        if (this.state.users[targetIndex].id == message.from) {
          var sortData = await this.state.users.filter(u => u.id !== message.from);
          sortData.unshift(this.state.users[targetIndex])
          var userChatDatas = await sortData.filter(u => u.id !== this.state.user.id);
          await this.setState({ signInModalShow: false, userChatData: userChatDatas });
          if (this.state.selectedUserIndex != null) {
            if (userChatData[this.state.selectedUserIndex].id == message.from) {
              const read = true
              const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  usersID: message.from,
                  loginID: this.state.user.id
                })
              };
              fetch(constant.ENV_PORT2 + `/users/messageseen`, requestOptions).then();
            }
          }
        }
        else {
          sortData = this.state.users
        }

      }
      var userChatDatas = await sortData.filter(u => u.id !== this.state.user.id);
      await this.setState({ signInModalShow: false, userChatData: userChatDatas });
      userChatData = this.state.userChatData;

      let targetIndex = userChatData.findIndex(u => u.id === targetId);
      if (!userChatData[targetIndex].messages) {

        userChatData[targetIndex].messages = [];
      }
      if (targetIndex !== this.state.selectedUserIndex) {
        if (!userChatData[targetIndex].unread) {

          userChatData[targetIndex].unread = 0;
        }
        userChatData[targetIndex].unread++;
      }
      userChatData[targetIndex].messages.push(messageData);
      await this.setState({ userChatData });
    }
  }

  /**
   *
   * @param {User} e
   *
   * called when user clicks to sign-in
   */
  onUserClicked(e) {
    let user = e.user;
    this.socket.emit("sign-in", user);
    let userChatData = this.state.users.filter(u => u.id !== user.id);
    this.setState({ user, signInModalShow: false, userChatData });
  }

  /**
   *
   * @param {ChatItem} e
   *
   * handles if user clickes on ChatItem on left.
   */
  onChatClicked(e) {
    this.toggleViews();
    let users = this.state.userChatData;
    for (let index = 0; index < users.length; index++) {

      if (users[index].id === e.user.id) {

        // if (this.state.user.id !== e.user.id) {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usersID: e.user.id,
            loginID: this.state.user.id
          })
        };
        fetch(constant.ENV_PORT2 + `/users/messageseen`, requestOptions).then();
        // }
        users[index].unread = 0;
        this.setState({ selectedUserIndex: index, userChatData: users });
        return;
      }
    }
  }

  /**
   *
   * @param {messageText} text
   *
   * creates message in a format in which messageList can render.
   * position is purposely omitted and will be appended when message is received.
   */
  createMessage(text) {
    let message = {
      to: this.state.userChatData[this.state.selectedUserIndex].id,
      message: {
        type: "text",
        text: text,
        date: +new Date(),
        className: "message"
      },
      from: this.state.user.id,
      seen: false
    };
    this.socket.emit("message", message);
  }

  /**
   * Toggles views from 'ChatList' to 'ChatBox'
   *
   * only on Phone
   */
  toggleViews() {
    this.setState({
      showChatBox: !this.state.showChatBox,
      showChatList: !this.state.showChatList
    });
  }


  render() {

    if (!sessionStorage.getItem('user')) {
      return <Redirect from="*" to="/login" />
    }

    const items = this.props.items
    let chatBoxProps = this.state.showChatBox
      ? {
        xs: 12,
        sm: 12
      }
      : {
        xsHidden: true,
        smHidden: true
      };

    let chatListProps = this.state.showChatList
      ? {
        xs: 12,
        sm: 12
      }
      : {
        xsHidden: true,
        smHidden: true
      };

    return (
      <div>
        <Grid>
          <Row className="show-grid">
            <Col {...chatListProps} md={4}>
              <UserList
                userData={this.state.userChatData}
                onChatClicked={this.onChatClicked.bind(this)}
              />
            </Col>
            <Col {...chatBoxProps} md={8}>
              <ChatBox
                signedInUser={this.state.user}
                onSendClicked={this.createMessage.bind(this)}
                onBackPressed={this.toggleViews.bind(this)}
                targetUser={
                  this.state.userChatData[this.state.selectedUserIndex]
                }
              />
            </Col>
          </Row>
        </Grid>
        <ErrorModal
          show={this.state.error}
          errorMessage={this.state.errorMessage}
        />
        <LoadingModal show={this.state.loading} />
        <NotificationContainer />
      </div>
    );
  }
}

function mapState(state) {
  const { items } = state.users;
  return { items };
}

const actionCreators = {
  getAllUser: userActions.getAllUsers,
}

export default connect(mapState, actionCreators)(ChatStart);

