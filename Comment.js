/**
 * Created by tino on 6/6/17.
 */
import React, { PureComponent } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableHighlight,
  TouchableOpacity,
  Modal,
  Alert
} from "react-native";

import PropTypes from "prop-types";
import TimeAgo from "react-native-timeago";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./styles";
import Collapsible from "react-native-collapsible";

export default class Comment extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      menuVisible: false
    };

    this.handleReport = this.handleReport.bind(this);
    this.handleReply = this.handleReply.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUsernameTap = this.handleUsernameTap.bind(this);
    this.handleLikesTap = this.handleLikesTap.bind(this);
  }

  handleReport() {
    Alert.alert(
      "Confirm report",
      "Are you sure you want to report?",
      [
        {
          text: "Yes",
          onPress: () => this.props.reportAction(this.props.data)
        },
        { text: "No", onPress: () => null }
      ],
      true
    );
    this.setState({ menuVisible: false });
  }
  handleReply() {
    this.props.replyAction(this.props.data);
  }
  handleLike() {
    this.props.likeAction(this.props.data);
  }
  handleEdit() {
    this.props.editComment(this.props.data);
    this.setState({ menuVisible: false });
  }

  handleDelete() {
    Alert.alert(
      "Confirm delete",
      "Are you sure you want to delete?",
      [
        {
          text: "Yes",
          onPress: () => this.props.deleteAction(this.props.data)
        },
        { text: "No", onPress: () => null }
      ],
      true
    );
    this.setState({ menuVisible: false });
  }
  handleUsernameTap() {
    if (this.props.usernameTapAction) {
      this.props.usernameTapAction(this.props.username);
    }
  }
  handleLikesTap() {
    this.props.likesTapAction(this.props.data);
  }

  setModalVisible() {
    this.setState({ menuVisible: !this.state.menuVisible });
  }

  render() {
    return (
      <View style={styles.commentContainer}>
        <View style={styles.left}>
          <TouchableHighlight onPress={this.handleUsernameTap}>
            <View style={{ alignItems: "center" }}>
              <Image
                style={[
                  styles.image,
                  { width: 30, height: 30, borderRadius: 15 }
                ]}
                source={
                  this.props.image === ""
                    ? require("./no-user.png")
                    : { uri: this.props.image }
                }
              />
              {this.props.likesNr && this.props.likeAction ? (
                <TouchableHighlight
                  style={[styles.actionButton, { paddingTop: 5 }]}
                  onPress={this.handleLikesTap}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Icon name="heart" color="#df1740" size={15} />
                    <Text style={styles.likeNr}> {this.props.likesNr}</Text>
                  </View>
                </TouchableHighlight>
              ) : null}
            </View>
          </TouchableHighlight>
        </View>
        <TouchableOpacity
          onPress={() => this.setState({ menuVisible: false })}
          onLongPress={() => this.setModalVisible()}
          style={styles.right}
        >
          <View style={styles.rightContent}>
            <View style={styles.rightContentTop}>
              <TouchableHighlight onPress={this.handleUsernameTap}>
                <Text style={styles.name}>{this.props.username}</Text>
              </TouchableHighlight>
            </View>
            <Text style={styles.body}>{this.props.body}</Text>
          </View>
          <View style={styles.rightActionBar}>
            <TimeAgo style={styles.time} time={this.props.updatedAt} />
            {this.props.likeAction ? (
              <TouchableHighlight
                style={styles.actionButton}
                onPress={this.handleLike}
              >
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={[
                      styles.actionText,
                      { color: this.props.liked ? "#4DB2DF" : null }
                    ]}
                  >
                    Like{" "}
                  </Text>
                </View>
              </TouchableHighlight>
            ) : null}
            {this.props.replyAction ? (
              <TouchableHighlight
                style={styles.actionButton}
                onPress={this.handleReply}
              >
                <Text style={styles.actionText}>Reply</Text>
              </TouchableHighlight>
            ) : null}
          </View>
        </TouchableOpacity>
        {this.state.menuVisible ? (
          <View style={styles.menu}>
            <View style={{ flex: 1.5 }}>
              {this.props.canEdit ? (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={this.handleEdit}
                >
                  <Text style={styles.menuText}>Edit</Text>
                </TouchableOpacity>
              ) : null}
              {this.props.reportAction && !this.props.isOwnComment ? (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={this.handleReport}
                >
                  {this.props.reported ? (
                    <Text
                      style={[
                        styles.menuText,
                        { fontStyle: "italic", fontSize: 11 }
                      ]}
                    >
                      Reported
                    </Text>
                  ) : (
                    <Text style={styles.menuText}>Report</Text>
                  )}
                </TouchableOpacity>
              ) : null}
              {this.props.canEdit ? (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={this.handleDelete}
                >
                  <Text style={styles.menuText}>Delete</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            <View
              style={{
                flex: 0.5,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <TouchableOpacity
                style={styles.menuClose}
                onPress={() => this.setState({ menuVisible: false })}
              >
                <Text style={{ color: "silver" }}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}

Comment.propTypes = {
  data: PropTypes.object,
  body: PropTypes.string,
  canEdit: PropTypes.bool,
  child: PropTypes.bool,
  editComment: PropTypes.func,
  likeAction: PropTypes.func,
  liked: PropTypes.bool,
  likesNr: PropTypes.number,
  likesTapAction: PropTypes.func,
  replyAction: PropTypes.func,
  deleteAction: PropTypes.func,
  reportAction: PropTypes.func,
  reported: PropTypes.bool,
  updatedAt: PropTypes.string,
  username: PropTypes.string,
  usernameTapAction: PropTypes.func
};
