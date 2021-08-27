export const chartTypes = {
  BAR: 'bar',
  LINE: 'linear',
  PIE: 'pie',
};

export const getChartData = (originalData, chartType) => {
  const chartData = {};

  if (chartType === 'pie') {
    chartData.label = Object.keys(originalData);
    chartData.value = Object.values(originalData);
  } else {
    chartData.x = Object.keys(originalData);
    chartData.y = Object.values(originalData);
  }

  return chartData;
};
