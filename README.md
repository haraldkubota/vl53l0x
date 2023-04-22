# Drivers for Kaluma (JerryScript for Raspberry Pico)

The amount of drivers for various I2C (and other) sensors was surprisingly low for Kaluma. Espruino was much better in this regard, but since both JavaScript, it should not be difficult to adopt drivers from one to the other platform.

## TOF Sensor VL53L0X

Link: https://www.st.com/en/imaging-and-photonics-solutions/vl53l0x.html
Espruino driver: https://www.espruino.com/modules/VL53L0X.js

### How to use

```
npm install --save https://github.com/haraldkubota/vl53l0x
kaluma bundle ./ex.js
kaluma flash ./bundle.js
```

