import React, { useState } from 'react';
import { Accordion, Button } from 'semantic-ui-react';
import Markdown from 'react-markdown';
import PropTypes from 'prop-types';

const CollectionAccordion = ({ id, title, descriptionPairs, updateDisabled, deleteDisabled, handleDelete, handleOpenUpdate }) => {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  const getDescriptionPairValue = (descriptionPair) => {
    if (Array.isArray(descriptionPair.value)) {
      return descriptionPair.value.join(', ');
    }
    if (typeof descriptionPair.value === 'undefined') {
      return ' ';
    }
    return `${descriptionPair.value}`;
  };

  return (
    <Accordion fluid styled>
      <Accordion.Title active={active} onClick={handleClick}>
        {title}
      </Accordion.Title>
      <Accordion.Content active={active}>
        {descriptionPairs.map((descriptionPair, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={`${descriptionPair.label}-${index}`}>
            <b>{descriptionPair.label}:</b>
            <Markdown>{getDescriptionPairValue(descriptionPair)}</Markdown>
          </React.Fragment>
        ))}
        <p>
          <Button id={id} color="teal" basic size="mini" disabled={updateDisabled} onClick={handleOpenUpdate}>
            Update
          </Button>
          <Button id={id} color="teal" basic size="mini" disabled={deleteDisabled} onClick={handleDelete}>
            Delete
          </Button>
        </p>
      </Accordion.Content>
    </Accordion>
  );
};

CollectionAccordion.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.any,
  descriptionPairs: PropTypes.array,
  updateDisabled: PropTypes.bool,
  deleteDisabled: PropTypes.bool,
  handleDelete: PropTypes.func,
  handleOpenUpdate: PropTypes.func,
};

export default CollectionAccordion;
