/**
 * Created by tino on 6/6/17.
 */
import React, { PureComponent } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';

import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles';
import { getDistanceInWordsToNow } from './lib/dates/getDistanceInWordsToNow';

export default class Comment extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      menuVisible: false,
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
    if (this.props.reported) {
      return this.props.reportAction(this.props.data);
    }
    Alert.alert(
      this.props.i18nKeys.report.title || 'Confirm report',
      this.props.i18nKeys.report.subtitle || 'Are you sure you want to report?',
      [
        {
          text: this.props.i18nKeys.report.yes || 'Yes',
          onPress: () => this.props.reportAction(this.props.data),
        },
        { text: this.props.i18nKeys.report.no || 'No', onPress: () => null },
      ],
      true
    );
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
      this.props.i18nKeys.delete.title || 'delete',
      this.props.i18nKeys.delete.subtitle || 'Are you sure you want to delete?',
      [
        {
          text: this.props.i18nKeys.delete.yes || 'Yes',
          onPress: () => this.props.deleteAction(this.props.data),
        },
        { text: this.props.i18nKeys.delete.no || 'No', onPress: () => null },
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
          <TouchableOpacity activeOpacity={0.7} onPress={this.handleUsernameTap}>
            <View style={{ alignItems: 'center' }}>
              <Image
                style={[styles.image, { width: 30, height: 30, borderRadius: 15 }]}
                source={this.props.image === '' ? require('./no-user.png') : { uri: this.props.image }}
              />
              {this.props.likesNr && this.props.likeAction ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[styles.actionButton, { paddingTop: 5 }]}
                  onPress={this.handleLikesTap}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <Icon name="heart" color="#df1740" size={15} />
                    <Text style={styles.likeNr}> {this.props.likesNr}</Text>
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => this.setState({ menuVisible: false })}
          onLongPress={() => this.setModalVisible()}
          style={styles.right}
        >
          <View style={styles.rightContent}>
            <View style={styles.rightContentTop}>
              <TouchableOpacity activeOpacity={0.7} onPress={this.handleUsernameTap}>
                <Text style={styles.name}>{this.props.username}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.body}>{this.props.body}</Text>
          </View>
          <View style={styles.rightActionBar}>
            <Text style={styles.time}>{getDistanceInWordsToNow(this.props.updatedAt, this.props.locale || 'en')}</Text>
            {this.props.likeAction && (
              <TouchableOpacity activeOpacity={0.7} style={styles.actionButton} onPress={this.handleLike}>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={[
                      styles.actionText,
                      { color: this.props.liked ? '#4DB2DF' : null },
                      this.props.additionalStyles && this.props.additionalStyles.actionText,
                    ]}
                  >{`${this.props.i18nKeys.like || 'Like'}`}</Text>
                </View>
              </TouchableOpacity>
            )}
            {this.props.replyAction && (
              <TouchableOpacity activeOpacity={0.7} style={styles.actionButton} onPress={this.handleReply}>
                <Text
                  style={[styles.actionText, this.props.additionalStyles && this.props.additionalStyles.actionText]}
                >{`${this.props.i18nKeys.reply_label || 'Reply'}`}</Text>
              </TouchableOpacity>
            )}
            {this.props.reportAction && (
              <TouchableOpacity activeOpacity={0.7} style={styles.actionButton} onPress={this.handleReport}>
                {this.props.reported ? (
                  <Text
                    style={[
                      styles.actionText,
                      { fontStyle: 'italic', fontSize: 11 },
                      this.props.additionalStyles && this.props.additionalStyles.actionText,
                    ]}
                  >{`${this.props.i18nKeys.reported || 'Reported'}`}</Text>
                ) : (
                  <Text
                    style={[styles.actionText, this.props.additionalStyles && this.props.additionalStyles.actionText]}
                  >{`${this.props.i18nKeys.report_label || 'Report'}`}</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
        {this.state.menuVisible && this.props.canEdit && (
          <View style={styles.menu}>
            {!this.props.hideEditButton && (
              <TouchableOpacity activeOpacity={0.7} style={styles.menuItem} onPress={this.handleEdit}>
                <Text style={styles.menuText}>{`${this.props.i18nKeys.edit_label || 'Edit'}`}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity activeOpacity={0.7} style={styles.menuItem} onPress={this.handleDelete}>
              <Text style={styles.menuText}>{`${this.props.i18nKeys.delete_label || 'Delete'}`}</Text>
            </TouchableOpacity>
          </View>
        )}
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
  usernameTapAction: PropTypes.func,
  additionalStyles: PropTypes.object,
  i18nKeys: PropTypes.object,
};
