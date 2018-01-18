

# React native comments
![Screenshot](https://tinotokic.com/img/react-native-comments.gif)

[React native comments](https://github.com/tokict/react-native-comments) is a presentational component for rendering Facebook like comments with likes, reporting, replying,  pagination, etc. The pagination and actions are proxied which means you need to have your own pagination and data storage solution and implement action logic (liking, reporting etc).

## Getting started

`$ npm install react-native-comments --save`

If you dont have the dependency `react-native-vector-icons`, please make sure you also run: 

* `npm install react-native-vector-icons --save`

* `react-native link`

on the terminal and restart your packager. This will add some necessary fonts and Info.plist updates on your xcode project.


## Implementation notes
You should add scroll to end of comments on succesful save action

Do not update comments if the user is not expecting update. Updating comments could close some modals the user was potentially viewing


## Properties

| Name            | Type            | Description 					| Must return          | Passed params |
|-----------------|--------------   |-------------------------------|-------------------|----------|
| data            | array   | Array of comments to render. One item = one complete comment with children |	
| viewingUserName | string  | What is the username of the current user. used to check editability|
| initialDisplayCount  | number        | How many comments to render at first |
| editMinuteLimit   | number           | Time limit for editing new comments. None for limitless|
| usernameTapAction  | func            | Function to call when username and image are taped on comment| username
| childPropName       | string            | The property name where we can find array of children for particular comment|
| isChild            | func            | Function to call to check is it a child or parent comment | bool |
| keyExtractor        | func            | Function to call when component needs to extract comment key (comment unique id)| number (unique)|
| parentIdExtractor        | func            | Function to call when component needs to extract parent comment key (comment unique id)| number (unique)|
| usernameExtractor    | func            | Function to call to get the username of the comment creator | string|
| editTimeExtractor     | func             | Function to call to get time of last comment update | Timestamp|
| createdTimeExtractor    | func            | Function to call to get comment creation time | Timestamp|
| bodyExtractor    | func             | Function to call to get body of the comment | String|
| imageExtractor    | func            | Function to call to get image url of comment creator | string|
| likeExtractor     | func             | Function to call to check has the user liked the comment | bool|
| reportedExtractor   | func                | Function to call to check has the user reported the comment| bool|
| likesExtractor       | func             | Function to call to get array users that liked the comment | array { image: string, name:string, user_id: number, tap : function}|
| childrenCountExtractor  | func              | Function to call to get number of total children on the comment |  number|
| replyAction      | func                     |  Function to call when user taps reply|
| saveAction            | func                  |  Function to call in order to save comment. Should save comment and update data prop|
| editAction            | func                   |  Function to call when user taps edit. Should save comment and update data prop|
| reportAction            | func                       |  Function to call when user taps report. Should update data prop|
| likeAction            | func                       |  Function to call when user taps like. Should update data prop|
| paginateAction            | func                |  Function to call when user taps show more or show previous.Should update data prop with new comments either prepended or appended to main comments or one comments children|


## Usage
```javascript
import Comments from 'react-native-comments';

class Screen extends Component {
  constructor(props) {
    super(props);
    this.props = props;
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
        image: this.config.urls.api_url+'/data/images/users/'+like.user_id+'/'+like.user.image,
        name: JSON.parse(like.user.name),
        user_id: like.user_id,
        tap: (username) => {
          this.props.navigator.showModal({
            screen: "M.Profile",
            passProps: {profileUsername: username},
          title: username})
        }
      }
    })

  }

  isCommentChild(item){
    return  item.parent !== null
  }

  render() {
  const data = this.state.comments

    return (
    <ScrollView 
            style={styles.container}
            onScroll={(event) => {
                this.scrollIndex = event.nativeEvent.contentOffset.y
            }}
            ref={'scrollView'}>
    
        {this.state.comments.length ? <Comments
          data={data}
          viewingUserName={this.state.login.user ? this.state.login.user.username : null}
          initialDisplayCount={10}
          editMinuteLimit={900}
          childrenPerPage={5}
          lastCommentUpdate={this.state.lastCommentUpdate}
          usernameTapAction={username => this.props.navigator.showModal({
              screen: 'M.Profile',
              passProps: {
                profileUsername: username,
                title: username
              }
            })
          }
          childPropName={'children'}
          isChild={() =>this.isCommentChild(item)}
          keyExtractor={item => item.comment_id}
          usernameExtractor={item => this.extractUsername(item)}
          editTimeExtractor={item => this.extractEditTime(item)}
          createdTimeExtractor={item => this.extractCreatedTime(item)}
          bodyExtractor={item => this.extractBody(item)}
          imageExtractor={item => this.extractImage(item)}
          likeExtractor={item => this.likeExtractor(item)}
          reportedExtractor={item => this.reportedExtractor(item)}
          likesExtractor={item => this.likesExtractor(item)}
          childrenCountExtractor={item => this.extractChildrenCount(item)}
          timestampExtractor={item => item.updated_at}
          replyAction={offset => {
            this.refs.scrollView.scrollTo({x: null, y: this.scrollIndex + offset - 300, animated: true})
          }}
          saveAction={(text, parentCommentId) => {
            this.props.actions.save(this.props.id, text, 'review', parentCommentId)
          }}
          editAction={(text, comment) => {
            this.props.actions.edit(this.props.id, comment, text)
          }}
          reportAction={(comment) => this.props.actions.report(this.props.id, comment)}
          likeAction={(comment) => {
            this.props.actions.like(this.props.id, comment)
          }
          }
          paginateAction={(from_comment_id, direction, parent_comment_id) => {
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

      </ScrollView>)
  }
}

export default Screen;
```


## Author
- Tino Tokić
- Email: ttokic1985@gmail.com


## License
MIT