const { I2C } = require('i2c');
const i2c0 = new I2C(0); // GPIO 4 and 5

import { VL52L0X } from "vl53l0x";

const vl = new VL52L0X(i2c0);

setInterval(()=>{console.log(vl.performSingleMeasurement());}, 1000);


