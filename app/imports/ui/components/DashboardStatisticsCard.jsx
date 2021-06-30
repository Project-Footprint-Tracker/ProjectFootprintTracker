import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Header, Modal, Popup } from 'semantic-ui-react';

/* global document */

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
    userProfile,
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

  /* DOM Styling */
  useEffect(() => {
    const dashboardCards = document.getElementsByClassName('general-card');
    const dashboardModals = document.getElementsByClassName('card-modal');
    const cardHeaders = document.getElementsByClassName('card-header');
    if (userProfile.theme === 'dark') {
      for (let i = 0; i < dashboardCards.length; i++) {
        dashboardCards[i].classList.add('dark-card');
      }
      for (let i = 0; i < dashboardModals.length; i++) {
        dashboardModals[i].classList.add('dark-card');
      }
      for (let i = 0; i < cardHeaders.length; i++) {
        cardHeaders[i].classList.add('dark-card-header');
      }
    } else {
      for (let i = 0; i < dashboardCards.length; i++) {
        dashboardCards[i].classList.remove('dark-card');
      }
      for (let i = 0; i < dashboardModals.length; i++) {
        dashboardModals[i].classList.remove('dark-card');
      }
      for (let i = 0; i < cardHeaders.length; i++) {
        cardHeaders[i].classList.remove('dark-card-header');
      }
    }
  }, [userProfile, moreInfo]);

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
