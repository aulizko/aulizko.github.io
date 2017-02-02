const fs = require('fs');
const postcss = require('postcss');
const cssnano = require('cssnano');
const precss = require('precss');
const awsm = require('awsm.css');

fs.readFile('postcss/main.css', (err, css) => {
  postcss([awsm(), precss, cssnano])
    .process(css, {
      from: 'postcss/main.css', 
      to: 'css/main.css', 
      map: {inline:false}
    })
    .then(result => {
      fs.writeFileSync('css/main.css', result.css);
      if ( result.map ) fs.writeFileSync('css/main.css.map', result.map);
    })
    .catch(err => {
      console.log(err);
    });
});