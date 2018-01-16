/**
 * Created by tino on 6/6/17.
 */
import React, { Component } from 'react'
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Dimensions
} from 'react-native'

import styles from './styles'
import Comments from 'react-native-comments'
import * as commentActions from './ExampleActions'


export default class ExampleComments extends Component {
  constructor (props) {
    super(props)
    this.props = props
    this.config = new Config()
    this.state = {
      comments: [],
      loadingComments: true,
      lastCommentUpdate: null,
      review: props.review ? props.review : null,
      login: null,
      id: props.id
    }

    this.scrollIndex = 0

  }

  static navigatorStyle = {}

  componentWillReceiveProps (nextProps) {

    if (nextProps.comments) {
      this.setState({comments: nextProps.comments, loadingComments: false})
    }

  }

  extractUsername (c) {
    try {
      return c.user && c.user.username && c.user.username !== '' ? JSON.parse(c.user.username) : null
    } catch (e) {
      console.log(e)
    }
  }

  extractBody (c) {
    try {
      return c.body && c.body !== '' ? JSON.parse(c.body) : null
    } catch (e) {
      console.log(e)
    }
  }

  extractImage (c) {

    try {
      return c.user.image_id && c.user.image_id !== '' ? this.config.urls.api_url +
        '/data/images/users/' + c.user.image_id : this.config.urls.api_url +
        '/data/images/users/no_image.png'

    } catch (e) {
      console.log(e)
    }
  }

  extractChildrenCount (c) {
    try {
      return c.childrenCount || 0
    } catch (e) {
      console.log(e)
    }
  }

  extractEditTime (item) {
    try {
      return item.updated_at
    } catch (e) {
      console.log(e)
    }
  }

  extractCreatedTime (item) {
    try {
      return item.created_at
    } catch (e) {
      console.log(e)
    }
  }

  likeExtractor (item) {
    return item.hasUserLiked
  }

  reportedExtractor (item) {
    return item.reported
  }



  likesExtractor (item) {

    return item.likes.map((like) => {
      return {
        image: like.image,
        name: like.user.name,
        user_id: like.user_id,
        tap: (username) => {
         console.log('Taped: '+username)
        }
      }
    })

  }

  isCommentChild(item){
    return  item.parent !== null
  }

  render () {
    const review = this.state.review
    const data = this.state.comments

    return (
      /*
      * They should add scroll to end on save action
      *They should not update comments if there are modals opened
      *
      * */
      <ScrollView style={styles.container}

                  onScroll={(event) => {
                    this.scrollIndex = event.nativeEvent.contentOffset.y
                  }}
                  ref={'scrollView'}>
        {review ? <View>
            <ReviewCardLarge review={review}
                             vote={review.vote}
                             collapsed={false}
                             followedUser={review.followed_user}
                             navigator={this.props.navigator}
            />
          </View>
          : null}

        {this.state.comments.length ? <Comments
          data={data}
          //To compare is user the owner
          viewingUserName={this.state.login.user ? this.state.login.user.username : null}
          //how many comments to display on init
          initialDisplayCount={10}
          //How many minutes to pass before locking for editing
          editMinuteLimit={900}

          lastCommentUpdate={this.state.lastCommentUpdate}
          //What happens when user taps on username or photo
          usernameTapAction={(username) => {
            this.props.navigator.showModal({
              screen: 'M.Profile',
              passProps: {
                profileUsername: username,
                title: username
              }
            })
          }}
          //Where can we find the children within item.
          //Children must be prepared before for pagination sake
          childPropName={'children'}
          isChild={() =>this.isCommentChild(item)}
          //We use this for key prop on flat list (i.e. its comment_id)
          keyExtractor={item => item.comment_id}
          //what prop holds the comment owners username
          usernameExtractor={item => this.extractUsername(item)}
          //when was the comment last time edited
          editTimeExtractor={item => this.extractEditTime(item)}
          //When was the comment created
          createdTimeExtractor={item => this.extractCreatedTime(item)}
          //where is the body
          bodyExtractor={item => this.extractBody(item)}
          //where is the user image
          imageExtractor={item => this.extractImage(item)}
          //Where to look to see if user liked comment
          likeExtractor={item => this.likeExtractor(item)}
          //Where to look to see if user reported comment
          reportedExtractor={item => this.reportedExtractor(item)}
          //Where to find array with user likes
          likesExtractor={item => this.likesExtractor(item)}
          //Where to get nr of replies
          childrenCountExtractor={item => this.extractChildrenCount(item)}

          //what to do when user clicks reply. Usually its header height + position (b/c scroll list heights are relative)
          replyAction={offset => {
            this.refs.scrollView.scrollTo({x: null, y: this.scrollIndex + offset - 300, animated: true})

          }}
          //what to do when user clicks submits edited comment
          saveAction={(text, parentCommentId) => {
            this.props.actions.save(this.props.id, text, 'review', parentCommentId)
          }}

          //what to do when user clicks submits edited comment
          editAction={(text, comment) => {
            this.props.actions.edit(this.props.id, comment, text)
          }}

          //what to do when user clicks report submit
          reportAction={(comment) => this.props.actions.report(this.props.id, comment)}
          //what to do when user clicks like
          likeAction={(comment) => {
            this.props.actions.like(this.props.id, comment)
          }
          }
          //Must return promise
          paginateAction={(from_comment_id, direction, parent_comment_id) => {
            //Must return array of new comments after pagination
            this.props.actions.paginateComments(
              review.review_id,
              'review',
              from_comment_id,
              direction,
              parent_comment_id)
            let self = this
            setTimeout(function () {
              self.refs.scrollView.scrollTo(500)
            }, 3000)

          }
          }
        /> : null}

      </ScrollView>

    )
  }
}

