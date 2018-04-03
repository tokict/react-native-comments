/**
 * Created by tino on 6/6/17.
 */
import React, { PureComponent } from 'react'
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native'

import PropTypes from 'prop-types'
import TimeAgo from 'react-native-timeago'
import Icon from 'react-native-vector-icons/FontAwesome'
import styles from './styles'
import Collapsible from 'react-native-collapsible'
import * as commentActions from './ExampleActions'

export default class Comment extends PureComponent {

  constructor (props) {
    super(props)

    this.handleReport = this.handleReport.bind(this)
    this.handleReply = this.handleReply.bind(this)
    this.handleLike = this.handleLike.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.handleUsernameTap = this.handleUsernameTap.bind(this)
    this.handleLikesTap = this.handleLikesTap.bind(this)
  }

  handleReport(){
    this.props.reportAction(this.props.data)
  }
  handleReply(){
    this.props.replyAction(this.props.data)
  }
  handleLike(){
    this.props.likeAction(this.props.data)
  }
  handleEdit(){
    this.props.editComment(this.props.data)
  }
  handleUsernameTap(){
    this.props.usernameTapAction(this.props.username)
  }
  handleLikesTap(){
    this.props.likesTapAction(this.props.data)
  }

  render () {
    return (
      <View style={styles.commentContainer}>
        <View style={styles.left}>
          <TouchableHighlight onPress={this.handleUsernameTap}>
            <View style={{alignItems: 'center'}}>
              <Image
                style={[styles.image, {width: 30, height: 30, borderRadius: 15}]}
                source={{uri: this.props.image}}/>
              {this.props.likesNr ? <TouchableHighlight style={[styles.actionButton, {paddingTop: 5}]}
                                                        onPress={ this.handleLikesTap}>
                <View style={{flexDirection: 'row'}}>
                  <Icon name={'heart'} color={'#df1740'} size={15}/>
                  <Text style={styles.likeNr}> {this.props.likesNr}</Text>
                </View>
              </TouchableHighlight> : null}
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.right}>
          <View style={styles.rightContent}>
            <View style={styles.rightContentTop}>
              <TouchableHighlight onPress={this.handleUsernameTap}>
                <Text style={styles.name}>{this.props.username}</Text>
              </TouchableHighlight>

              {this.props.canEdit ? <TouchableHighlight
                style={styles.editIcon}
                onPress={this.handleEdit}>
                <Icon name={'edit'} size={15}/>
              </TouchableHighlight> : null}
            </View>
            <Text style={styles.body}>{this.props.body}</Text>
          </View>
          <View style={styles.rightActionBar}>
            <TimeAgo style={styles.time} time={this.props.updatedAt}/>
            <TouchableHighlight style={styles.actionButton}
                                onPress={this.handleLike }>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.actionText, {color: this.props.liked ? '#4DB2DF' : null}]}>Like </Text>

              </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.actionButton} onPress={this.handleReply}>
              <Text style={styles.actionText}>Reply</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.actionButton} onPress={this.handleReport}>
              {this.props.reported ? <Text style={{fontStyle: 'italic', fontSize: 11,}}>Reported</Text>
                : <Text style={styles.actionText}>Report</Text>}
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
  }
}

Comment.propTypes = {
  data: PropTypes.object,
  body: PropTypes.string,
  canEdit: PropTypes.bool,
  child: PropTypes.bool,
  editComment: PropTypes.func,
  image: PropTypes.string,
  likeAction: PropTypes.func,
  liked: PropTypes.bool,
  likesNr: PropTypes.number,
  likesTapAction: PropTypes.func,
  replyAction: PropTypes.func,
  reportAction: PropTypes.func,
  reported: PropTypes.bool,
  updatedAt: PropTypes.string,
  username: PropTypes.string,
  usernameTapAction: PropTypes.func
}