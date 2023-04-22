// Adopted from https://www.espruino.com/modules/VL53L0X.js
// Initial version for Espruino: Copyright (c) 2017 Gordon Williams, Pur3 Ltd. See the file LICENSE for copying permission.

export class VL52L0X {

    /**
     Init VL53 Sensor if no address is provided, default address is used.
     Store Address in a variable which is used for communication.
     */

    constructor(i2c, options) {
        this.i2c = i2c;
        this.options = options || {};
        this.ad = 0x52 >> 1;
        // Change I2C address, if specified in options
        if (this.options.address) {
            this.ad = this.options.address >> 1;
            this.i2c.write(new Uint8Array([0x8a, this.ad]), 0x52 >> 1);
        }
        this.init();
    }

    init() {
        this.w(0x80, 0x01);
        this.w(0xFF, 0x01);
        this.w(0x00, 0x00);
        this.StopVariable = this.r(0x91, 1)[0];
        this.w(0x00, 0x01);
        this.w(0xFF, 0x00);
        this.w(0x80, 0x00);
    }

    C = {
        REG_SYSRANGE_START: 0,
        REG_RESULT_RANGE_STATUS: 0x0014
    }

    r(addr, n) {
        this.i2c.write(new Uint8Array([addr]), this.ad);
        return this.i2c.read(n, this.ad);
    }
    w(addr, d) {
        this.i2c.write(new Uint8Array([addr, d]), this.ad);
    }

    /** Perform one measurement and return the result.

     Returns an object of the form:

     {
   distance , // distance in mm
   signalRate, // target reflectance
   ambientRate, // ambient light.
   effectiveSpadRtnCount //  effective SPAD count for the return signal
}
     */
    performSingleMeasurement() {
        // start measurement
        this.w(0x80, 0x01);
        this.w(0xFF, 0x01);
        this.w(0x00, 0x00);
        this.w(0x91, this.StopVariable);
        this.w(0x00, 0x01);
        this.w(0xFF, 0x00);
        this.w(0x80, 0x00);
        // VL53L0X_DEVICEMODE_SINGLE_RANGING:
        this.w(this.C.REG_SYSRANGE_START, 0x01);
        // wait for it to finish
        while (!this.r(this.C.REG_RESULT_RANGE_STATUS, 1)[0] & 1) ;
        // read and format data
        let d = new DataView(this.r(0x14, 12).buffer);
        let res = {
            distance: d.getUint16(10),
            signalRate: d.getUint16(6) / 128,
            ambientRate: d.getUint16(8) / 128,
            effectiveSpadRtnCount: d.getUint16(2) / 256
        }
        // TODO: use LinearityCorrectiveGain/etc
        return res;
    }
}
