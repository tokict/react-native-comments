/**
 * Created by tino on 6/6/17.
 */
import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  FlatList,
  Modal,
  ActivityIndicator,
  TextInput,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native'

import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/FontAwesome'
import styles from './styles'
import Collapsible from 'react-native-collapsible'
import Comment from './Comment'

export default class Comments extends Component {

  constructor (props) {
    super(props)
    this.bookmark = null
    this.props = props
    this.state = {
      loadingComments: props.data && props.data.length ? false : true,
      comments: props.data,
      likesModalVisible: false,
      likesModalData: null,
      editModalVisible: false,
      commentsLastUpdated: null,
      expanded: [],
      pagination: []
    }
    this.newCommentText = null
    this.replyCommentText = null
    this.editCommentText = null
    this.editingComment = null
    this.textInputs = []

  }

  setLikesModalVisible (visible) {
    this.setState({likesModalVisible: visible})
  }

  setEditModalVisible (visible) {
    this.setState({editModalVisible: visible})
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.data) {
      this.setState({
        comments: nextProps.data,
        commentsLastUpdated: new Date().getTime()
      })
    }

    if (nextProps.lastCommentUpdate) {
      this.setState({
        comments: nextProps.data,
        commentsLastUpdated: new Date().getTime(),
        loadingComments: false,
        editModalVisible: false,
      })
    }
  }

  isExpanded (id) {
    return this.state.expanded.indexOf(id) !== -1
  }

  toggleExpand (id) {

    let expanded = this.state.expanded

    let index = expanded.indexOf(id)
    console.log(expanded);
    if (index === -1) {
      expanded.push(id)
    } else {

      expanded.splice(index, 1)

    }

    this.setState({expanded: expanded})

  }

  generateComment (c) {
    return <Comment
      id={this.props.keyExtractor(c)}
      usernameTapAction={(username) => this.props.usernameTapAction(username)}
      username={this.props.usernameExtractor(c)}
      body={this.props.bodyExtractor(c)}
      likes={this.props.likesExtractor(c)}
      canEdit={this.canUserEdit(c)}
      updatedAt={this.props.editTimeExtractor(c)}
      replyAction={() => {
        if (!this.props.isChild(c)) {
          this.toggleExpand(this.props.keyExtractor(c))
        } else {
          let input = this.textInputs['input' + this.props.parentIdExtractor(c)]
          console.log(['input' + this.props.parentIdExtractor(c)])
          input.measure((x, y, width, height, pageX, pageY) => {
            input.focus()
            this.props.replyAction(pageY)
          })
        }
      }

      }
      image={this.props.imageExtractor(c)}
      child={true}
      reportAction={() => this.props.reportAction(c)}
      liked={this.props.likeExtractor(c)}
      reported={this.props.reportedExtractor(c)}
      likeAction={() => this.props.likeAction(c)}
      editAction={() => this.props.editAction(c)}
      editComment={() => {
        this.editCommentText = this.props.bodyExtractor(c)
        this.editingComment = c
        this.setEditModalVisible(!this.state.editModalVisible)

      }
      }
      likesTapAction={() => {
        this.setState({likesModalData: this.props.likesExtractor(c)})
        this.setLikesModalVisible(!this.state.likesModalVisible)
        console.log(33)
      }}
    />
  }

  /*Create comment instance and return*/
  renderChildren (items) {
    if (!items.length) return
    let self = this
    return items.map(function (c) {

      return <View
        key={self.props.keyExtractor(c) + '' + Math.random()}>
        {self.generateComment(c)}

      </View>

    })

  }

  getLastChildCommentId (item) {
    if (!item) return
    const items = item[this.props.childPropName]
    return this.props.keyExtractor(items[items.length - 1])
  }

  getFirstChildCommentId (item) {
    if (!item) return
    const items = item[this.props.childPropName]

    return this.props.keyExtractor(items[0])
  }

  paginate (fromCommentId, direction, parentCommentId) {
    this.setState({loadingComments: true})
    console.log(2, this.state)
    this.props.paginateAction(fromCommentId, direction, parentCommentId)

  }

  canUserEdit (item) {
    if(this.props.viewingUserName == this.props.usernameExtractor(item)) {
      if (!this.props.editMinuteLimit) return true
      let created = new Date(this.props.createdTimeExtractor(item)).getTime() / 1000
      return new Date().getTime() / 1000 - created < this.props.editMinuteLimit * 60
    }
    return false
  }

  renderLikesModal () {
    if (this.state.likesModalData) {
      console.log(this.state.likesModalData)
      return this.state.likesModalData.map(like => <TouchableHighlight
        onPress={() => like.tap(like.name)}
        style={styles.likeButton} key={like.user_id}>
        <View style={[styles.likeContainer]}>
          <Image
            style={[styles.likeImage]}
            source={{uri: like.image}}/>
          <Text style={[styles.likeName]}>{like.name}</Text>
        </View>
      </TouchableHighlight>)
    }
    return null
  }

  showCommentById () {}

  render () {
    return (
      <View style={{flex: 1}}>
        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            ref={(input) => this.textInputs['inputMain'] = input}
            multiline={true}
            onChangeText={((text) => this.newCommentText = text)}
            placeholder={'Write comment'}
            numberOfLines={3}
          />
          <TouchableHighlight onPress={() => {
            this.props.saveAction(this.newCommentText, false)
            this.newCommentText = null
            this.textInputs['inputMain'].clear()

          }}>
            <Icon style={styles.submit} name="caret-right" size={40} color="#000"/>
          </TouchableHighlight>
        </View>
        <TouchableHighlight onPress={() => {
          this.paginate(this.props.keyExtractor(this.state.comments[0]), 'down')
        }}>
          <View>
            {this.state.loadingComments ? <ActivityIndicator
              animating={this.state.loadingComments}
              style={{
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',

              }}
              size="small"
            /> : <Text style={{textAlign: 'center'}}>Show previous</Text>}
          </View>
        </TouchableHighlight>

        {/*Comments*/}
        {this.state.comments
          ? <FlatList style={{backgroundColor: 'white'}}
                      data={this.state.comments}
                      extraData={this.state.commentsLastUpdated}
                      initialNumToRender={this.props.initialDisplayCount}
                      keyExtractor={item => this.props.keyExtractor(item)}
                      renderItem={({item}) => {
                        return <View>

                          {this.generateComment(item)}
                          <View style={{marginLeft: 70}}>
                            {item.childrenCount ? <TouchableHighlight onPress={() => this.toggleExpand(this.props.keyExtractor(item))}>
                              <View style={styles.repliedSection}>
                                <Image style={styles.repliedImg}
                                       source={{uri: 'http://2.bp.blogspot.com/_49qDiEUz6EI/SrdOxJq8bqI/AAAAAAAAAEQ/ExxEYG8wskQ/s200/A-246904-1209425280.jpeg'}}/>
                                <Text style={styles.repliedUsername}>Tino...</Text>
                                <Text style={styles.repliedText}>replied</Text>
                                <Text
                                  style={styles.repliedCount}>* {this.props.childrenCountExtractor(item)}
                                  {this.props.childrenCountExtractor(item) > 1 ? ' replies' : ' reply'}</Text>
                              </View>
                            </TouchableHighlight> : null}
                            <Collapsible
                              easing={'easeOutCubic'}
                              duration={400}
                              collapsed={!this.isExpanded(this.props.keyExtractor(item))}>
                              {this.props.childrenCountExtractor(item) ? <View>
                                  {this.props.childrenCountExtractor(item) > item[this.props.childPropName].length
                                    ? <TouchableHighlight
                                      onPress={() =>
                                        this.paginate(this.getFirstChildCommentId(item), 'down',
                                          this.props.keyExtractor(item))
                                      }>
                                      <Text style={{textAlign: 'center', paddingTop: 15}}>Show
                                        previous...</Text>
                                    </TouchableHighlight>
                                    : null}

                                  {this.renderChildren(item[this.props.childPropName], this.props.keyExtractor(item))}

                                  {this.props.childrenCountExtractor(item) > item[this.props.childPropName].length
                                    ? <TouchableHighlight
                                      onPress={() => this.paginate(this.getLastChildCommentId(item), 'up',
                                        this.props.keyExtractor(item))}>
                                      <Text style={{textAlign: 'center', paddingTop: 15}}>Show
                                        more...</Text>
                                    </TouchableHighlight>
                                    : null}</View>
                                : null}
                              <View style={styles.inputSection}>
                                <TextInput
                                  ref={(input) => this.textInputs['input' + this.props.keyExtractor(item)] = input}
                                  style={styles.input}
                                  multiline={true}
                                  onChangeText={(text => this.replyCommentText = text)}
                                  placeholder={'Write comment'}
                                  numberOfLines={3}
                                />
                                <TouchableHighlight onPress={() => {
                                  this.props.saveAction(
                                    this.replyCommentText, this.props.keyExtractor(item))
                                  this.replyCommentText = null
                                  this.textInputs['input' + this.props.keyExtractor(item)].clear()
                                }
                                }>
                                  <Icon style={styles.submit} name="caret-right" size={40}
                                        color="#000"/>
                                </TouchableHighlight>
                              </View>
                            </Collapsible>
                          </View>


                        </View>
                      }

                      }


          />
          : null}

        {this.state.loadingComments ? <ActivityIndicator
          animating={this.state.loadingComments}
          style={{
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',

          }}
          size="small"
        /> : <TouchableHighlight style={{height: 70}}
          onPress={() => {console.log(12, this.state.comments[this.state.comments.length - 1])
            this.paginate(this.props.keyExtractor(this.state.comments[this.state.comments.length - 1]), 'up')

          }
          }>

            <Text style={{textAlign: 'center'}}>Show more</Text>

        </TouchableHighlight>}


        <Modal animationType={'slide'}
               transparent={false}
               visible={this.state.likesModalVisible}
               onRequestClose={() => {
                 this.setLikesModalVisible(false)
                 this.setState({likesModalData: null})
               }}>
          <Text style={styles.likeHeader}>Users that liked the comment</Text>
          {this.renderLikesModal()}
        </Modal>

        <Modal animationType={'slide'}
               onShow={() => {this.textInputs['editCommentInput'].focus()}}
               transparent={true}
               visible={this.state.editModalVisible}
               onRequestClose={() => {
                 this.setEditModalVisible(false)
                 this.setState({editModalData: null})
               }}>
          <View style={styles.editModalContainer}>
            <View style={styles.editModal}>
              <TextInput
                ref={(input) => this.textInputs['editCommentInput'] = input}
                style={styles.input}
                multiline={true}
                defaultValue={this.editCommentText}
                onChangeText={(text => this.editCommentText = text)}
                placeholder={'Edit comment'}
                numberOfLines={3}
              />
              <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <TouchableHighlight onPress={() => this.setState({editModalVisible: false})}>
                  <View style={styles.editButtons}>
                    <Text>Cancel</Text>
                    <Icon name={'times'} size={20}/>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={() => this.props.editAction(this.editCommentText, this.editingComment)}>
                  <View style={styles.editButtons}>
                    <Text>Save</Text>
                    <Icon name={'send'} size={20}/>
                  </View>
                </TouchableHighlight>
              </View>
            </View>

          </View>
        </Modal>
      </View>
    )
  }
}

Comments.propTypes = {
  data: PropTypes.array.isRequired,
  viewingUserName: PropTypes.string,
  initialDisplayCount: PropTypes.number,
  editMinuteLimit: PropTypes.number,
  lastCommentUpdate: PropTypes.number,
  usernameTapAction: PropTypes.func.isRequired,
  childPropName: PropTypes.string.isRequired,
  isChild: PropTypes.func.isRequired,
  keyExtractor: PropTypes.func.isRequired,
  parentIdExtractor: PropTypes.func.isRequired,
  usernameExtractor: PropTypes.func.isRequired,
  editTimeExtractor: PropTypes.func.isRequired,
  createdTimeExtractor: PropTypes.func.isRequired,
  bodyExtractor: PropTypes.func.isRequired,
  imageExtractor: PropTypes.func.isRequired,
  likeExtractor: PropTypes.func.isRequired,
  reportedExtractor: PropTypes.func.isRequired,
  likesExtractor: PropTypes.func.isRequired,
  childrenCountExtractor: PropTypes.func.isRequired,
  replyAction: PropTypes.func.isRequired,
  saveAction: PropTypes.func.isRequired,
  editAction: PropTypes.func.isRequired,
  reportAction: PropTypes.func.isRequired,
  likeAction: PropTypes.func.isRequired,
  paginateAction: PropTypes.func.isRequired
}


