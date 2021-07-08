import React from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import CollectionAccordion from './CollectionAccordion';
import { useStickyState } from '../../utilities/StickyState';
import DataModelPagination from './DataModelPagination';

const ListCollection = ({ collection, items, descriptionPairs, handleDelete, handleOpenUpdate, itemTitle }) => {
  const count = items.length;
  const collectionName = collection.getCollectionName();
  const [startIndex] = useStickyState(`Pagination.${collectionName}.index`, 0);
  const [showCount] = useStickyState(`Pagination.${collectionName}.count`, 25);
  const endIndex = startIndex + showCount;
  const itemsToShow = _.slice(items, startIndex, endIndex);

  return (
    <Segment padded>
      <Header dividing>
        {collectionName} ({count})
      </Header>
      <Grid>
        <DataModelPagination collection={collection} />
        {itemsToShow.map(item => (
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
