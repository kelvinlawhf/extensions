import React from 'react';
import moment from 'moment';
import _ from 'lodash';

import {
  View,
  Image,
  Subtitle,
  Caption,
  Text,
  Row,
  TouchableOpacity,
  Lightbox,
  dimensionRelativeToIphone,
} from '@shoutem/ui';

import { ActionSheet } from '@shoutem/ui-addons';

import { comment as commentShape } from '../components/shapes';

export default class CommentView extends React.Component {
  static propTypes = {
    comment: commentShape.isRequired,
    openProfile: React.PropTypes.func.isRequired,
    deleteComment: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleClickOnUser = this.handleClickOnUser.bind(this);
    this.renderStatusAttachments = this.renderStatusAttachments.bind(this);
    this.showActionSheet = this.showActionSheet.bind(this);
  }

  handleClickOnUser() {
    const { comment, openProfile } = this.props;
    const { user } = comment;

    openProfile(user);
  }

  renderStatusAttachments() {
    const { comment } = this.props;
    const { shoutem_attachments: attachments } = comment;
    const hasPicture = _.get(attachments, [0, 'type']) === 'picture';
    if (!hasPicture) {
      return null;
    }
    return (
      <Lightbox activeProps={{ styleName: 'preview' }}>
        <Image
          style={{ width: dimensionRelativeToIphone(305), height: dimensionRelativeToIphone(163) }}
          source={{ uri: attachments[0].url_large }}
        />
      </Lightbox>
    );
  }

  showActionSheet() {
    const { comment, deleteComment } = this.props;

    function actionSheet() {
      ActionSheet.showActionSheetWithOptions(
        {
          options: [
            'Delete',
            'Cancel'
          ],
          destructiveButtonIndex: 0,
          cancelButtonIndex: 1,
        },
        (index) => {
          switch (index) {
            case 0:
              deleteComment(comment);
          }
        }
      );
    }

    _.get(comment, 'deletable') === 'yes' ? actionSheet() : {}
  }

  render() {
    const { comment } = this.props;
    const { user, created_at, text } = comment;
    const profileImageUrl = user.profile_image_url;

    return (
      <TouchableOpacity onLongPress={this.showActionSheet}>
        <Row>
          <TouchableOpacity styleName="top" onPress={this.handleClickOnUser}>
            <Image
              styleName="small-avatar top"
              source={{ uri: profileImageUrl || undefined }}
              defaultSource={require('../assets/images/defaultAvatar.jpg')}
            />
          </TouchableOpacity>
          <View styleName="vertical md-gutter-left">
            <View styleName="horizontal space-between">
              <Subtitle>{`${user.name}`}</Subtitle>
              <Caption>{moment(created_at).fromNow()}</Caption>
            </View>
            <Text styleName="multiline">{text}</Text>
            {this.renderStatusAttachments()}
          </View>
        </Row>
      </TouchableOpacity>
    );
  }
}
