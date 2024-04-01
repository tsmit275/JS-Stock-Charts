let api_base_url = "https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1day&apikey=e2b8949e6f8747eb9a053ee29d270e4c";


async function getStocksFromApi() {
   try {
       const response = await fetch(api_base_url);
       const data = await response.json();
       return [data.GME, data.MSFT, data.DIS, data.BNTX];
   } catch (error) {
       console.error("error getting stocks from api", error);
   }
}


function getColor(stock) {
   if (stock === "GME") {
       return 'rgba(61, 161, 61, 0.7)';
   }
   if (stock === "MSFT") {
       return 'rgba(209, 4, 25, 0.7)';
   }
   if (stock === "DIS") {
       return 'rgba(18, 4, 209, 0.7)';
   }
   if (stock === "BNTX") {
       return 'rgba(166, 43, 158, 0.7)';
   }
}


async function main() {
   const stocks = await getStocksFromApi();


   const timeChartCanvas = document.querySelector('#time-chart');
   new Chart(timeChartCanvas.getContext('2d'), {
       type: 'line',
       data: {
           labels: stocks[0].values.map(value => value.datetime),
           datasets: stocks.map(stock => ({
               label: stock.meta.symbol,
               data: stock.values.map(value => parseFloat(value.high)),
               backgroundColor: getColor(stock.meta.symbol),
               borderColor: getColor(stock.meta.symbol),
           }))
       }
   });


   function findHighest(values) {
       let highest = 0;
       values.forEach(value => {
           if (parseFloat(value.high) > highest) {
               highest = parseFloat(value.high);
           }
       });
       return highest;
   }


   const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
   new Chart(highestPriceChartCanvas.getContext('2d'), {
       type: 'bar',
       data: {
           labels: stocks.map(stock => stock.meta.symbol),
           datasets: [{
               label: 'Highest',
               data: stocks.map(stock => findHighest(stock.values)),
               backgroundColor: stocks.map(stock => getColor(stock.meta.symbol)),
               borderColor: stocks.map(stock => getColor(stock.meta.symbol)),
           }]
       }
   });


   // Bonus: Average Price Chart
   const averagePriceChartCanvas = document.querySelector('#average-price-chart');
   new Chart(averagePriceChartCanvas.getContext('2d'), {
       type: 'line',
       data: {
           labels: stocks[0].values.map(value => value.datetime),
           datasets: stocks.map(stock => ({
               label: stock.meta.symbol,
               data: stock.values.map(value => parseFloat(value.close)),
               backgroundColor: getColor(stock.meta.symbol),
               borderColor: getColor(stock.meta.symbol),
           }))
       }
   });
}


main();



