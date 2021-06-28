import React from 'react';
import PropTypes from 'prop-types';
import Plot from '../../../../../node_modules/react-plotly.js/react-plotly';

// A base chart that can be customized to visualize any data in any way.
// chartData is formatted as an array of objects with each object being a specific chart.
// chartLayout is formatted as an object that contains any custom look of the chart
// Refer to https://plotly.com/javascript/
function Chart({ chartData, chartLayout, chartStyle }) {

  const style = chartStyle || { width: '100%', height: '100%' };

  return (
    <div>
      <Plot
        data={chartData}
        layout={chartLayout}
        useResizeHandler={true}
        style={style}
      />
    </div>
  );
}

Chart.propTypes = {
  chartData: PropTypes.array.isRequired,
  chartLayout: PropTypes.object.isRequired,
  chartStyle: PropTypes.object,
};

export default Chart;
