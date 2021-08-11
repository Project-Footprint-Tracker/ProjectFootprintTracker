import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Header, Modal, Popup } from 'semantic-ui-react';

// Generalized structure of how a dashboard statistics card is setup.
function DashboardStatisticsCard(
  {
    cardHeader,
    topContent,
    popupTop,
    bottomContent,
    popupBottom,
    showMore,
    moreHeader,
    moreContent,
  },
) {

  const [openMore, setOpenMore] = useState(false);
  const moreInfo = (showMore) ?
    <Modal
      closeIcon
      open={openMore}
      onOpen={() => setOpenMore(true)}
      onClose={() => setOpenMore(false)}
      trigger={<Button className='card-button' compact floated='right'>Show more</Button>}
    >
      <Header className='card-modal'>{moreHeader}</Header>
      <Modal.Content className='card-modal'>
        {moreContent}
      </Modal.Content>
    </Modal> :
    <div> </div>;

  return (
    <Card className='general-card'>
      <Card.Header className='card-header'>{cardHeader}</Card.Header>
      <Card.Content textAlign='center'>
        <Popup
          on='hover'
          hideOnScroll
          trigger={topContent}
        >
          <Popup.Content>{popupTop}</Popup.Content>
        </Popup>
      </Card.Content>
      <Card.Content textAlign='center'>
        <Popup
          on='hover'
          hideOnScroll
          trigger={bottomContent}
        >
          <Popup.Content>{popupBottom}</Popup.Content>
        </Popup>
      </Card.Content>
      <Card.Content extra>
        {moreInfo}
      </Card.Content>
    </Card>

  );
}

DashboardStatisticsCard.propTypes = {
  cardHeader: PropTypes.string,
  topContent: PropTypes.element,
  popupTop: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  bottomContent: PropTypes.element,
  popupBottom: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  showMore: PropTypes.bool,
  moreHeader: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  moreContent: PropTypes.element,
  userProfile: PropTypes.object,
};

export default DashboardStatisticsCard;
