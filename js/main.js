// Beacon carbon badge
window.onload = function() { 
  if (('fetch' in window)) { // If the fetch API is not available, don't do anything.

      // Calc loading time
      setTimeout(() => {
          const perfData = window.performance.timing;
          const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
          document.querySelector('.js-timing').textContent = (pageLoadTime / 1000).toFixed(1) + 's';
      }, 1);

      // Set up CO2 call
      const output = document.querySelector('.js-grams');
      const dbUrl = encodeURIComponent(window.location.href);

      let cachedResponse = localStorage.getItem('dbb_' + dbUrl);
      let check = true;

      if (cachedResponse) {
          const data = JSON.parse(cachedResponse);
          if ((Math.ceil(Math.abs(new Date().getTime() - data.t) / (1000 * 3600 * 24))) >= 7) {
              check = true;
          } else {
              output.textContent = data.co2;
              check = false;
          }
      }
      
      if (check) {
          
          fetch('https://digitalbeacon.co/badge?url=' + dbUrl)
              .then(function (data) {
                  if (!data.ok) {
                      throw Error(data);
                  }
                  
                  return data.json();
              })

              .then(function (data) {

                  document.querySelector('.js-grams').textContent = data.co2;
                  // Save the result into localStorage with a timestamp
                  data.t = new Date().getTime()
                  localStorage.setItem('dbb_' + dbUrl, JSON.stringify(data))
              })

              // Handle error responses
              .catch(function (e) {
                  console.log(JSON.stringify(e));
                  localStorage.removeItem('dbb_' + dbUrl);
                  output.textContent = 'error';
              });

      }
  } else {
      document.querySelector('.js-carbon').style.display = 'none';
  }
};