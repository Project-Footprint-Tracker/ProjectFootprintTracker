import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Form, Grid, Header, Loader, Pagination, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Trips } from '../../api/trip/TripCollection';
import TripHistoryRow from '../components/trips/TripHistoryRow';
import { imperialUnits, metricUnits } from '../../api/utilities/constants';
import SavedCommutesModal from '../components/trips/SavedCommutesModal';
import { SavedCommutes } from '../../api/saved-commute/SavedCommute';
import AddTripModal from '../components/trips/AddTripModal';
import ModesChart from '../components/charts/ModesChart';
import CEDataChart from '../components/charts/CEDataChart';

const TripHistory = (props) => {
  const [metric, setMetric] = useState(false);
  const [page, setPage] = useState(1);
  const maxRow = 20;
  const maxPage = Math.ceil(props.trips.length / maxRow);

  const handleChangeUnit = (prevState) => setMetric(!prevState);

  const headerUnits = {};

  const chartStyle = {
    height: 400,
  };

  if (metric) {
    headerUnits.distance = metricUnits.distance;
    headerUnits.mpgKMLUnit = metricUnits.mpgKML;
    headerUnits.ce = metricUnits.ce;
  } else {
    headerUnits.distance = imperialUnits.distance;
    headerUnits.mpgKMLUnit = imperialUnits.mpgKML;
    headerUnits.ce = imperialUnits.ce;
  }

  const handleTripRows = () => {
    const start = (page * maxRow) - maxRow;
    const end = (page === maxPage) ? props.numTrips : (page * maxRow);
    return props.trips.slice(start, end);
  };

  const handlePaginationChange = (e, { activePage }) => setPage(activePage);

  return (props.ready ? (
    <Container style={{ width: 900, paddingBottom: 50 }}>
      <Grid id='overview' container centered>
        <Grid.Row>
          <Header as='h1' textAlign='center'>
            MY TRIP HISTORY
            <Header.Subheader>
              <Grid.Column
                as={Form.Radio}
                toggle
                label='Convert to metric'
                checked={metric}
                onChange={() => handleChangeUnit(metric)}
              />
            </Header.Subheader>
          </Header>
        </Grid.Row>

        <Grid.Row columns={2}>
          <Grid.Column width={7} floated='left'>
            <ModesChart
              modesData={props.modesData}
              chartStyle={chartStyle}
            />
          </Grid.Column>
          <Grid.Column width={9} floated='right'>
            <CEDataChart
              ceSaved={props.dailyCESaved}
              ceProduced={props.dailyCEProduced}
              fuelSaved={props.dailyFuelSaved}
              chartStyle={chartStyle}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <AddTripModal
              owner={props.owner}
              savedCommutes={props.savedCommutes}
              metric={metric}
            />
            <SavedCommutesModal
              owner={props.owner}
              savedCommutes={props.savedCommutes}
              metric={metric}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column textAlign='center'>
            <Table fixed striped compact textAlign='center'>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width={2} rowSpan={2}>Date</Table.HeaderCell>
                  <Table.HeaderCell width={3} rowSpan={2}>Mode of Transportation</Table.HeaderCell>
                  <Table.HeaderCell width={2} rowSpan={2}>Distance Traveled ({headerUnits.distance})</Table.HeaderCell>
                  <Table.HeaderCell width={2} rowSpan={2}>{headerUnits.mpgKMLUnit}</Table.HeaderCell>
                  <Table.HeaderCell width={3} colSpan={2}>Carbon Emissions ({headerUnits.ce})</Table.HeaderCell>
                  <Table.HeaderCell width={1} rowSpan={2}/>
                </Table.Row>
                <Table.Row>
                  <Table.HeaderCell>Saved</Table.HeaderCell>
                  <Table.HeaderCell>Produced</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {handleTripRows().map((trip) => <TripHistoryRow
                  key={trip._id}
                  trip={trip}
                  savedCommutes={props.savedCommutes}
                  metric={metric}
                />)}
              </Table.Body>
            </Table>
            <Pagination
              activePage={page}
              onPageChange={handlePaginationChange}
              totalPages={maxPage}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  ) :
    <Loader active>Getting Trip Data</Loader>);
};

TripHistory.propTypes = {
  trips: PropTypes.array.isRequired,
  numTrips: PropTypes.number.isRequired,
  modesData: PropTypes.object.isRequired,
  dailyCESaved: PropTypes.object.isRequired,
  dailyCEProduced: PropTypes.object.isRequired,
  dailyFuelSaved: PropTypes.object.isRequired,
  savedCommutes: PropTypes.array.isRequired,
  owner: PropTypes.string,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  // Get access to Trip documents.
  const owner = Meteor.user()?.username;
  const ready = Trips.subscribeTrip().ready() && SavedCommutes.subscribeSavedCommute().ready() && owner !== undefined;
  const trips = Trips.find({ owner }, { sort: { date: -1 } }).fetch();
  const numTrips = Trips.count();
  const modesData = Trips.getModesOfTransport(owner);
  const dailyCESaved = Trips.getCEReducedPerDay(owner);
  const dailyCEProduced = Trips.getCEProducedPerDay(owner);
  const dailyFuelSaved = Trips.getFuelSavedPerDay(owner);
  const savedCommutes = SavedCommutes.find({}, { sort: { name: 'asc' } }).fetch();
  return {
    trips,
    numTrips,
    modesData,
    dailyCESaved,
    dailyCEProduced,
    dailyFuelSaved,
    savedCommutes,
    owner,
    ready,
  };
})(TripHistory);
