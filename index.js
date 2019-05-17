/**
 * Created by tino on 6/6/17.
 */
import React, { PureComponent } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Modal,
  Dimensions,
  ActivityIndicator,
  Keyboard,
  TextInput,
  TouchableHighlight
} from "react-native";
import moment from "moment";
import PropTypes from "prop-types";
import IconFa from "react-native-vector-icons/FontAwesome";
import IconFa5 from "react-native-vector-icons/FontAwesome5Pro";
import IconFa5Pro from "react-native-vector-icons/FontAwesome5Pro";
import styles from "./styles";
import Collapsible from "react-native-collapsible";
import Comment from "./Comment";

const screen = Dimensions.get("screen");

export default class Comments extends PureComponent {
  constructor(props) {
    super(props);
    this.bookmark = null;
    this.props = props;
    this.state = {
      replyCommentText: null,
      editCommentText: null,
      editingComment: null,
      newCommentText: null,
      loadingComments: !(props.data && props.data.length),
      likesModalVisible: false,
      likesModalData: null,
      editModalVisible: false,
      expanded: [],
      pagination: []
    };

    this.textInputs = [];
    this.renderComment = this.renderComment.bind(this);

    this.handleReport = this.handleReport.bind(this);
    this.handleReply = this.handleReply.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUsernameTap = this.handleUsernameTap.bind(this);
    this.handleLikesTap = this.handleLikesTap.bind(this);
    this.handleEditAction = this.handleEditAction.bind(this);
    this.renderLike = this.renderLike.bind(this);
  }

  setLikesModalVisible(visible) {
    this.setState({ likesModalVisible: visible });
  }

  setEditModalVisible(visible) {
    this.setState({ editModalVisible: visible });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data) {
      this.setState({
        loadingComments: false
      });
    }
  }

  renderIcon(props) {
    if (this.props.fa5) {
      return <IconFa5 {...props} />;
    }
    if (this.props.fa5Pro) {
      return <IconFa5Pro {...props} />;
    }

    return <IconFa {...props} />;
  }

  isExpanded(id) {
    return this.state.expanded.indexOf(id) !== -1;
  }

  toggleExpand(c, focus) {
    const id = this.props.keyExtractor(c);
    let expanded = this.state.expanded;

    let index = expanded.indexOf(id);

    if (index === -1) {
      expanded.push(id);
    } else {
      expanded.splice(index, 1);
    }
    this.forceUpdate();
    this.setState({ expanded: expanded });
    if (focus && index === -1) {
      this.focusOnReplyInput(id);
    }
  }

  handleReport(c) {
    this.props.reportAction(c);
  }

  focusOnReplyInput(id) {
    let input = this.textInputs["input" + id];

    input.measure((x, y, width, height, pageX, pageY) => {
      console.log(pageY);
      input.focus();
      this.props.replyAction(pageY);
    });
  }

  handleReply(c) {
    if (!this.props.isChild) return;
    if (!this.props.isChild(c)) {
      this.toggleExpand(c, true);
    } else {
      this.focusOnReplyInput(this.props.parentIdExtractor(c));
    }
  }

  handleLike(c) {
    this.props.likeAction(c);
  }

  handleDelete(c) {
    this.props.deleteAction(c);
  }

  handleEdit(c) {
    this.setState({
      editCommentText: this.props.bodyExtractor(c),
      editingComment: c
    });

    this.setEditModalVisible(!this.state.editModalVisible);
  }

  handleUsernameTap(username) {
    if (this.props.usernameTapAction) {
      this.props.usernameTapAction(username);
    }
  }

  handleLikesTap(c) {
    this.setState({ likesModalData: this.props.likesExtractor(c) });
    this.setLikesModalVisible(!this.state.likesModalVisible);
  }

  handleEditAction(c) {
    this.props.editAction(this.state.editCommentText, c);
  }

  /**
   *
   * Generates a single comment
   * */
  generateComment(c) {
    return (
      <Comment
        data={c}
        id={this.props.keyExtractor(c)}
        usernameTapAction={this.handleUsernameTap}
        username={this.props.usernameExtractor(c)}
        body={this.props.bodyExtractor(c)}
        likesNr={this.props.likesExtractor(c)?this.props.likesExtractor(c).length:0}
        canEdit={this.canUserEdit(c)}
        updatedAt={this.props.editTimeExtractor(c)}
        replyAction={this.props.replyAction ? this.handleReply : null}
        image={this.props.imageExtractor(c)}
        child={true}
        isOwnComment={
          this.props.usernameExtractor(c) == this.props.viewingUserName
        }
        reportAction={this.props.reportAction ? this.handleReport : null}
        liked={this.props.likeExtractor ? this.props.likeExtractor(c) : null}
        reported={
          this.props.reportedExtractor ? this.props.reportedExtractor(c) : null
        }
        likeAction={this.props.likeAction ? this.handleLike : null}
        editAction={this.handleEditAction}
        deleteAction={this.handleDelete}
        editComment={this.handleEdit}
        likesTapAction={this.props.likeAction ? this.handleLikesTap : null}
      />
    );
  }

  /**
   * Renders comments children
   * */
  renderChildren(items) {
    if (!items || !items.length) return;
    let self = this;
    return items.map(function(c) {
      return (
        <View key={self.props.keyExtractor(c) + "" + Math.random()}>
          {self.generateComment(c)}
        </View>
      );
    });
  }

  /**
   * Returns last child id
   * */
  getLastChildCommentId(item) {
    if (!item) return;
    const items = item[this.props.childPropName];
    return this.props.keyExtractor(items[items.length - 1]);
  }

  /**
   * Returns first child id
   * */
  getFirstChildCommentId(item) {
    if (!item) return;
    const items = item[this.props.childPropName];

    return this.props.keyExtractor(items[0]);
  }

  /**
   * Does a pagination action
   * */
  paginate(fromCommentId, direction, parentCommentId) {
    this.setState({ loadingComments: true });
    this.props.paginateAction(fromCommentId, direction, parentCommentId);
  }

  /**
   * Can user edit a comment
   * */
  canUserEdit(item) {
    if (this.props.viewingUserName == this.props.usernameExtractor(item)) {
      if (!this.props.editMinuteLimit) return true;
      let created =
        moment(this.props.createdTimeExtractor(item)).valueOf() / 1000;
 
      return (
        new Date().getTime() / 1000 - created < this.props.editMinuteLimit * 60
      );
    }
    return false;
  }

  renderLike(l) {
    let like = l.item;
    return (
      <TouchableHighlight
        onPress={() => {
          this.setLikesModalVisible(false), like.tap(like.name);
        }}
        style={styles.likeButton}
        key={like.user_id + ""}>
        <View style={[styles.likeContainer]}>
          <Image style={[styles.likeImage]} source={{ uri: like.image }} />
          <Text style={[styles.likeName]}>{like.name}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  /**
   * Renders a comment with pagination
   * */
  renderComment(c) {
    const item = c.item;
    return (
      <View>
        {this.generateComment(item)}
        <View style={{ marginLeft: 40 }}>
          {item.childrenCount && this.props.childPropName ? (
            <TouchableHighlight onPress={() => this.toggleExpand(item)}>
              <View style={styles.repliedSection}>
                <Image
                  style={styles.repliedImg}
                  source={{
                    uri: this.props.imageExtractor(
                      item[this.props.childPropName][0]
                    )
                  }}
                />
                <Text style={styles.repliedUsername}>
                  {" "}
                  {this.props.usernameExtractor(
                    item[this.props.childPropName][0]
                  )}{" "}
                </Text>
                <Text style={styles.repliedText}>replied</Text>
                <Text style={styles.repliedCount}>
                  {" "}
                  * {this.props.childrenCountExtractor(item)}
                  {this.props.childrenCountExtractor(item) > 1
                    ? " replies"
                    : " reply"}
                </Text>
              </View>
            </TouchableHighlight>
          ) : null}
          <Collapsible
            easing={"easeOutCubic"}
            duration={400}
            collapsed={!this.isExpanded(this.props.keyExtractor(item))}>
            {this.props.childrenCountExtractor(item) &&
            this.props.paginateAction ? (
              <View>
                {this.props.childPropName &&
                this.props.childrenCountExtractor(item) >
                  item[this.props.childPropName].length ? (
                  <TouchableHighlight
                    onPress={() =>
                      this.paginate(
                        this.getFirstChildCommentId(item),
                        "down",
                        this.props.keyExtractor(item)
                      )
                    }>
                    <Text style={{ textAlign: "center", paddingTop: 15 }}>
                      Show previous...
                    </Text>
                  </TouchableHighlight>
                ) : null}

                {this.renderChildren(
                  item[this.props.childPropName],
                  this.props.keyExtractor(item)
                )}

                {this.props.childrenCountExtractor(item) >
                  item[this.props.childPropName].length &&
                this.props.paginateAction ? (
                  <TouchableHighlight
                    onPress={() =>
                      this.paginate(
                        this.getLastChildCommentId(item),
                        "up",
                        this.props.keyExtractor(item)
                      )
                    }>
                    <Text style={{ textAlign: "center", paddingTop: 15 }}>
                      Show more...
                    </Text>
                  </TouchableHighlight>
                ) : null}
              </View>
            ) : null}
            <View style={styles.inputSection}>
              <TextInput
                ref={input =>
                  (this.textInputs[
                    "input" + this.props.keyExtractor(item)
                  ] = input)
                }
                style={styles.input}
                multiline={true}
                value={this.state.replyCommentText}
                onChangeText={text => this.setState({ replyCommentText: text })}
                placeholder={"Write comment"}
                numberOfLines={3}
              />
              <TouchableHighlight
                onPress={() => {
                  this.props.saveAction(
                    this.state.replyCommentText,
                    this.props.keyExtractor(item)
                  );
                  this.setState({ replyCommentText: null });
                  Keyboard.dismiss();
                }}>
                {this.renderIcon({
                  style: styles.submit,
                  name: "caret-right",
                  size: 40,
                  color: "gray"
                })}
              </TouchableHighlight>
            </View>
          </Collapsible>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            ref={input => (this.textInputs["inputMain"] = input)}
            multiline={true}
            onChangeText={text => this.setState({ newCommentText: text })}
            placeholder={"Write comment"}
            numberOfLines={3}
          />
          <TouchableHighlight
            onPress={() => {
              this.props.saveAction(this.state.newCommentText, false);
              this.setState({ newCommentText: null });
              this.textInputs["inputMain"].clear();
              Keyboard.dismiss();
            }}>
            {this.renderIcon({
              style: styles.submit,
              name: "caret-right",
              size: 40,
              color: "gray"
            })}
          </TouchableHighlight>
        </View>
        {!this.state.loadingComments && !this.props.data ? (
          <Text style={{ textAlign: "center" }}>No comments yet</Text>
        ) : null}

        {!this.state.loadingComments &&
        this.props.data &&
        this.props.data.length &&
        this.props.paginateAction ? (
          <TouchableHighlight
            onPress={() => {
              this.paginate(
                this.props.keyExtractor(this.props.data[0]),
                "down"
              );
            }}>
            <View>
              <Text style={{ textAlign: "center", color: "gray" }}>
                Show previous
              </Text>
            </View>
          </TouchableHighlight>
        ) : null}
        {/* Comments */}
        {this.props.data ? (
          <FlatList
            keyboardShouldPersistTaps="always"
            style={{ backgroundColor: "white" }}
            data={this.props.data}
            extraData={this.props.lastCommentUpdate}
            initialNumToRender={this.props.initialDisplayCount || 20}
            keyExtractor={item => this.props.keyExtractor(item) + ""}
            renderItem={this.renderComment}
          />
        ) : null}

        {this.state.loadingComments ? (
          <View
            style={{
              position: "absolute",
              zIndex: 10,
              bottom: 0,
              height: 60,
              backgroundColor: "rgba(255,255,255, 0.9)"
            }}>
            <ActivityIndicator
              animating={true}
              style={{
                height: 50,
                width: screen.width,
                alignItems: "center",
                justifyContent: "center"
              }}
              size="small"
            />
          </View>
        ) : null}

        {!this.state.loadingComments &&
        this.props.data &&
        this.props.data.length &&
        this.props.paginateAction ? (
          <TouchableHighlight
            style={{ height: 70 }}
            onPress={() => {
              this.paginate(
                this.props.keyExtractor(
                  this.props.data[this.props.data.length - 1]
                ),
                "up"
              );
            }}>
            <Text style={{ textAlign: "center", color: "gray" }}>
              Show more
            </Text>
          </TouchableHighlight>
        ) : (
          <Text style={{ textAlign: "center", color: "gray" }}>
            No comments yet
          </Text>
        )}

        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.likesModalVisible}
          onRequestClose={() => {
            this.setLikesModalVisible(false);
          }}>
          <TouchableHighlight
            onPress={() => this.setLikesModalVisible(false)}
            style={{
              position: "absolute",
              width: 100,
              zIndex: 9,
              alignSelf: "flex-end",
              top: 10
            }}>
            <View style={{ position: "relative", left: 50, top: 5 }}>
              {this.renderIcon({ name: "times", size: 40 })}
            </View>
          </TouchableHighlight>
          <Text style={styles.likeHeader}>Users that liked the comment</Text>
          {this.state.likesModalVisible ? (
            <FlatList
              initialNumToRender="10"
              keyExtractor={item => item.like_id + ""}
              data={this.state.likesModalData}
              renderItem={this.renderLike}
            />
          ) : null}
        </Modal>

        <Modal
          animationType={"slide"}
          onShow={() => {
            this.textInputs["editCommentInput"].focus();
          }}
          transparent={true}
          visible={this.state.editModalVisible}
          onRequestClose={() => {
            this.setEditModalVisible(false);
            this.setState({ editModalData: null });
          }}>
          <View style={styles.editModalContainer}>
            <View style={styles.editModal}>
              <TextInput
                ref={input => (this.textInputs["editCommentInput"] = input)}
                style={styles.input}
                multiline={true}
                value={this.state.editCommentText}
                onChangeText={text => this.setState({ editCommentText: text })}
                placeholder={"Edit comment"}
                numberOfLines={3}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around"
                }}>
                <TouchableHighlight
                  onPress={() => this.setEditModalVisible(false)}>
                  <View style={styles.editButtons}>
                    <Text>Cancel</Text>
                    {this.renderIcon({ name: "times", size: 20 })}
                  </View>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={() => {
                    this.props.editAction(
                      this.state.editCommentText,
                      this.state.editingComment
                    );
                    this.setEditModalVisible(!this.state.editModalVisible);
                  }}>
                  <View style={styles.editButtons}>
                    <Text>Save</Text>
                    {this.renderIcon({ name: "caret-right", size: 20 })}
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

Comments.propTypes = {
  data: PropTypes.array.isRequired,
  viewingUserName: PropTypes.string,
  initialDisplayCount: PropTypes.number,
  editMinuteLimit: PropTypes.number,
  usernameTapAction: PropTypes.func,
  childPropName: PropTypes.string,
  isChild: PropTypes.func,
  keyExtractor: PropTypes.func.isRequired,
  parentIdExtractor: PropTypes.func,
  usernameExtractor: PropTypes.func.isRequired,
  editTimeExtractor: PropTypes.func.isRequired,
  createdTimeExtractor: PropTypes.func.isRequired,
  bodyExtractor: PropTypes.func.isRequired,
  imageExtractor: PropTypes.func.isRequired,
  likeExtractor: PropTypes.func,
  reportedExtractor: PropTypes.func,
  likesExtractor: PropTypes.func,
  childrenCountExtractor: PropTypes.func,
  replyAction: PropTypes.func,
  saveAction: PropTypes.func.isRequired,
  deleteAction: PropTypes.func,
  editAction: PropTypes.func.isRequired,
  reportAction: PropTypes.func,
  likeAction: PropTypes.func,
  paginateAction: PropTypes.func
};
