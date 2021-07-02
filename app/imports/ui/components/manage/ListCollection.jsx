import React from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import CollectionAccordion from './CollectionAccordion';

const ListCollection = ({ collection, items, descriptionPairs, handleDelete, handleOpenUpdate, itemTitle }) => {
  const count = collection.count();
  const collectionName = collection.getCollectionName();

  return (
    <Segment padded>
      <Header dividing>
        {collectionName} ({count})
      </Header>
      <Grid>
        {items.map(item => (
          <CollectionAccordion key={item._id} id={item._id} title={itemTitle(item)}
            descriptionPairs={descriptionPairs(item)}
            updateDisabled={false}
            deleteDisabled={false}
            handleOpenUpdate={handleOpenUpdate}
            handleDelete={handleDelete}
          />
        ))}
      </Grid>
    </Segment>
  );
};

ListCollection.propTypes = {
  collection: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  descriptionPairs: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleOpenUpdate: PropTypes.func.isRequired,
  itemTitle: PropTypes.func.isRequired,
};

export default ListCollection;
