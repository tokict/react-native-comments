
# React native comments

![Screenshot](https://tinotokic.com/img/react-native-comments.gif)

[React native comments](https://github.com/tokict/react-native-comments) is a presentational component for rendering Facebook like comments with likes, reporting, replying, pagination, etc. The pagination and actions are proxied which means you need to have your own pagination and data storage solution and implement action logic (liking, reporting etc).

## Getting started

`$ npm install react-native-comments --save`

If you dont have the dependency `react-native-vector-icons`, please make sure you also run:

- `npm install react-native-vector-icons --save`

- `react-native link`

on the terminal and restart your packager. This will add some necessary fonts and Info.plist updates on your xcode project.

## Implementation notes

You should add scroll to end of comments on succesful save action

Do not update comments if the user is not expecting update. Updating comments could close some modals the user was potentially viewing

Edit, Delete and Report are available on long press on comment container.

## ToDo

Styling props

Spinners and style improvements

##Note:
OnLongTap opens the menu

## Properties

| Name                   | Type   | Description                                                                                                                                                                 | Must return                                                          | Passed params |
| ---------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------- |
| data                   | array  | Array of comments to render. One item = one complete comment with children                                                                                                  |
| fa5 or fa5Pro        | string | Select Fontawesome5 or FontAwesome5Pro if your app is already using them
| viewingUserName        | string | What is the username of the current user. used to check editability                                                                                                         |
| initialDisplayCount    | number | How many comments to render at first                                                                                                                                        |
| editMinuteLimit        | number | Time limit for editing new comments. None for limitless                                                                                                                     |
| usernameTapAction      | func   | Function to call when username and image are taped on comment                                                                                                               | username                                                             |
| childPropName          | string | The property name where we can find array of children for particular comment                                                                                                |
| isChild                | func   | Function to call to check is it a child or parent comment                                                                                                                   | bool                                                                 |
| keyExtractor           | func   | Function to call when component needs to extract comment key (comment unique id)                                                                                            | number (unique)                                                      |
| parentIdExtractor      | func   | Function to call when component needs to extract parent comment key (comment unique id)                                                                                     | number (unique)                                                      |
| usernameExtractor      | func   | Function to call to get the username of the comment creator                                                                                                                 | string                                                               |
| editTimeExtractor      | func   | Function to call to get time of last comment update                                                                                                                         | Timestamp                                                            |
| createdTimeExtractor   | func   | Function to call to get comment creation time                                                                                                                               | Timestamp                                                            |
| bodyExtractor          | func   | Function to call to get body of the comment                                                                                                                                 | String                                                               |
| imageExtractor         | func   | Function to call to get image url of comment creator                                                                                                                        | string                                                               |
| likeExtractor          | func   | Function to call to check has the user liked the comment                                                                                                                    | bool                                                                 |
| reportedExtractor      | func   | Function to call to check has the user reported the comment                                                                                                                 | bool                                                                 |
| likesExtractor         | func   | Function to call to get array users that liked the comment                                                                                                                  | array { image: string, name:string, user_id: number, tap : function} |
| childrenCountExtractor | func   | Function to call to get number of total children on the comment                                                                                                             | number                                                               |
| replyAction            | func   | Function to call when user taps reply                                                                                                                                       |
| saveAction             | func   | Function to call in order to save comment. Should save comment and update data prop                                                                                         |
| editAction             | func   | Function to call when user taps edit. Should save comment and update data prop                                                                                              |
| reportAction           | func   | Function to call when user taps report. Should update data prop                                                                                                             |
| likeAction             | func   | Function to call when user taps like. Should update data prop                                                                                                               |
| paginateAction         | func   | Function to call when user taps show more or show previous.Should update data prop with new comments either prepended or appended to main comments or one comments children |

## Usage

Check the included example app files

## Author

- Tino Tokić
- Email: ttokic1985@gmail.com

## License

MIT
