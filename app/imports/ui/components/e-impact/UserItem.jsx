import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link, NavLink } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class UserItem extends React.Component {
  render() {
    return (
      <Table.Row>
        <Table.Cell>{this.props.user.profile.last}</Table.Cell>
        <Table.Cell>{this.props.user.profile.first}</Table.Cell>
        <Table.Cell>
          <Link as={NavLink} to={`/trips/${this.props.user.username}`}>{this.props.user.username}</Link>
        </Table.Cell>
      </Table.Row>
    );
  }
}

/** Require a document to be passed to this component. */
UserItem.propTypes = {
  user: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(UserItem);
