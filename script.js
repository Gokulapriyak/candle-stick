// Generate random candlestick data
const generateRandomData = () => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    const open = Math.random() * 100;
    const close = open + (Math.random() - 0.5) * 10; // Close is close to open with small fluctuation
    const high = Math.max(open, close) + Math.random() * 5; // High is above the open/close
    const low = Math.min(open, close) - Math.random() * 5; // Low is below the open/close
    data.push({ x: `Day ${i + 1}`, o: open, h: high, l: low, c: close });
  }
  return data;
};

// Define pattern recognition functions
const isHammer = (candle) => {
  return (candle.c - candle.o) < 0.1 * (candle.h - candle.l) && (candle.l - Math.min(candle.o, candle.c)) > 2 * Math.abs(candle.c - candle.o);
};

const isDoji = (candle) => {
  return Math.abs(candle.c - candle.o) < 0.1 * (candle.h - candle.l);
};

const isEngulfing = (prevCandle, currentCandle) => {
  return currentCandle.o < currentCandle.c && prevCandle.o > prevCandle.c &&
         currentCandle.o < prevCandle.c && currentCandle.c > prevCandle.o;
};

// Data setup
const data = generateRandomData();
const labels = Array.from({ length: data.length }, (_, i) => `Day ${i + 1}`);

// Candlestick chart data
const candlestickData = {
  labels: labels,
  datasets: [{
    label: 'Candlestick Chart',
    data: data.map(candle => ({
      x: labels[data.indexOf(candle)],
      o: candle.o,
      h: candle.h,
      l: candle.l,
      c: candle.c
    })),
    borderColor: 'black',
    borderWidth: 1
  }]
};

// Initialize the chart
const ctx = document.getElementById('candlestickChart').getContext('2d');
const candlestickChart = new Chart(ctx, {
  type: 'candlestick',
  data: candlestickData,
  options: {
    responsive: true,
    scales: {
      x: { type: 'category' },
      y: { beginAtZero: false }
    }
  }
});

// Highlight patterns after chart creation
data.forEach((candle, i) => {
  // Hammer pattern
  if (isHammer(candle)) {
    candlestickChart.data.datasets[0].backgroundColor = candlestickChart.data.datasets[0].backgroundColor || [];
    candlestickChart.data.datasets[0].backgroundColor[i] = 'green'; // Highlight hammer in green
  }

  // Doji pattern
  if (isDoji(candle)) {
    candlestickChart.data.datasets[0].backgroundColor = candlestickChart.data.datasets[0].backgroundColor || [];
    candlestickChart.data.datasets[0].backgroundColor[i] = 'yellow'; // Highlight Doji in yellow
  }

  // Engulfing pattern (check with the previous candle)
  if (i > 0 && isEngulfing(data[i - 1], candle)) {
    candlestickChart.data.datasets[0].backgroundColor = candlestickChart.data.datasets[0].backgroundColor || [];
    candlestickChart.data.datasets[0].backgroundColor[i - 1] = 'red'; // Highlight previous candle in red
    candlestickChart.data.datasets[0].backgroundColor[i] = 'red'; // Highlight engulfing candle in red
  }
});

// Update chart after applying pattern detection
candlestickChart.update();
