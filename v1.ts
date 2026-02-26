namespace cutebotProV1 {

    let IR_Val = 0
    let _initEvents = true
    let PidUseFlag = 0
    let blocklength = 0
    let distanceUnitsFlag = 0
    let fourWayStateValue = 0
    let pulseCntL = 0
    let pulseCntR = 0

    let irstate: number;
    let state: number;
    let i2cAddr: number = 0x10;
    export class Packeta {
        public mye: string;
        public myparam: number;
    }


    /**
     * PWM control the car to travel at a specific speed
     */
    export function pwmCruiseControl(speedL: number, speedR: number): void {
        let i2cBuffer = pins.createBuffer(7)

        if (speedL == 0)
            speedL = 200
        else if (speedL > 0)
            Math.map(speedL, 0, 100, 20, 100);
        else
            Math.map(speedL, -100, 0, -100, -20);

        if (speedR == 0)
            speedR = 200
        else if (speedR > 0)
            Math.map(speedR, 0, 100, 20, 100);
        else
            Math.map(speedR, -100, 0, -100, -20);

        if (speedL > 0) {
            i2cBuffer[0] = 0x99;
            i2cBuffer[1] = 0x01;
            i2cBuffer[2] = CutebotProWheel.LeftWheel;
            i2cBuffer[3] = 0x01;
            i2cBuffer[4] = speedL;
            i2cBuffer[5] = 0x00;
            i2cBuffer[6] = 0x88;
        }
        else {
            i2cBuffer[0] = 0x99;
            i2cBuffer[1] = 0x01;
            i2cBuffer[2] = CutebotProWheel.LeftWheel;
            i2cBuffer[3] = 0x00;
            i2cBuffer[4] = -speedL;
            i2cBuffer[5] = 0x00;
            i2cBuffer[6] = 0x88;
        }
        pins.i2cWriteBuffer(i2cAddr, i2cBuffer)
        //basic.pause
        if (speedR > 0) {
            i2cBuffer[0] = 0x99;
            i2cBuffer[1] = 0x01;
            i2cBuffer[2] = CutebotProWheel.RightWheel;
            i2cBuffer[3] = 0x01;
            i2cBuffer[4] = speedR;
            i2cBuffer[5] = 0x00;
            i2cBuffer[6] = 0x88;
        }
        else {
            i2cBuffer[0] = 0x99;
            i2cBuffer[1] = 0x01;
            i2cBuffer[2] = CutebotProWheel.RightWheel;
            i2cBuffer[3] = 0x00;
            i2cBuffer[4] = -speedR;
            i2cBuffer[5] = 0x00;
            i2cBuffer[6] = 0x88;
        }
        pins.i2cWriteBuffer(i2cAddr, i2cBuffer)
    }

    /**
     * full speed forward
     */
    export function fullSpeedAhead(): void {
        let buf = pins.createBuffer(7);
        buf[0] = 0x99;
        buf[1] = 0x07;
        buf[2] = 0x00;
        buf[3] = 0x00;
        buf[4] = 0x00;
        buf[5] = 0x00;
        buf[6] = 0x88;
        pins.i2cWriteBuffer(i2cAddr, buf);
    }

    /**
     * full speed reverse
     */
    export function fullAstern(): void {
        let buf = pins.createBuffer(7);
        buf[0] = 0x99;
        buf[1] = 0x08;
        buf[2] = 0x00;
        buf[3] = 0x00;
        buf[4] = 0x00;
        buf[5] = 0x00;
        buf[6] = 0x88;
        pins.i2cWriteBuffer(i2cAddr, buf);
    }

    /**
     * stop immediately
     */
    export function stopImmediately(wheel: CutebotProMotors): void {
        let buf = pins.createBuffer(7);
        buf[0] = 0x99;
        buf[1] = 0x09;
        buf[2] = wheel;
        buf[3] = 0x00;
        buf[4] = 0x00;
        buf[5] = 0x00;
        buf[6] = 0x88;
        pins.i2cWriteBuffer(i2cAddr, buf);
    }




    /**
     * read motor speed
     */
    export function readSpeed(motor: CutebotProMotors1, speedUnits: CutebotProSpeedUnits): number {
        let speed: number
        let buf = pins.createBuffer(7)
        if (motor == 1) {
            buf[0] = 0x99;
            buf[1] = 0x05;
            buf[2] = motor;
            buf[3] = 0x00;
            buf[4] = 0x00;
            buf[5] = 0x00;
            buf[6] = 0x88;
            pins.i2cWriteBuffer(i2cAddr, buf);
            speed = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false)

            if (speedUnits == CutebotProSpeedUnits.Cms)
                return speed;
            else
                return speed / 0.3937;
        }
        else {
            buf[0] = 0x99;
            buf[1] = 0x05;
            buf[2] = motor;
            buf[3] = 0x00;
            buf[4] = 0x00;
            buf[5] = 0x00;
            buf[6] = 0x88;
            pins.i2cWriteBuffer(i2cAddr, buf);
            speed = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false)

            if (speedUnits == CutebotProSpeedUnits.Cms)
                return speed;
            else
                return speed / 0.3937;
        }
    }

    /**
    * 获取编码电机的脉冲数
    */
    export function pulseNumber(): void {
        let pulsenumberbuf = pins.createBuffer(10);
        let buf = pins.createBuffer(7)
        buf[0] = 0x99;
        buf[1] = 0x16;
        buf[2] = 0x00;
        buf[3] = 0x00;
        buf[4] = 0x00;
        buf[5] = 0x00;
        buf[6] = 0x88;
        pins.i2cWriteBuffer(i2cAddr, buf);
        pulsenumberbuf[0] = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false)
        pulsenumberbuf[1] = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false)
        pulsenumberbuf[2] = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false)
        pulsenumberbuf[3] = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false)
        pulseCntL = (pulsenumberbuf[0] << 24) | (pulsenumberbuf[1] << 16) | (pulsenumberbuf[2] << 8) | pulsenumberbuf[3]

        pulsenumberbuf[4] = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false)
        pulsenumberbuf[5] = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false)
        pulsenumberbuf[6] = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false)
        pulsenumberbuf[7] = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false)
        pulseCntR = (pulsenumberbuf[4] << 24) | (pulsenumberbuf[5] << 16) | (pulsenumberbuf[6] << 8) | pulsenumberbuf[7]

        pulsenumberbuf[8] = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false)
        if (pulsenumberbuf[8] == 1) {
            pulseCntL = -pulseCntL
        }

        pulsenumberbuf[9] = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false)
        if (pulsenumberbuf[9] == 1) {
            pulseCntR = -pulseCntR
        }

    }

    /**    
     * obtain the number of pulses produced by the coded motor on both sides of the wheel
    */
    export function readPulsenumberTest(motor: CutebotProMotors1): number {
        pulseNumber()
        if (motor == 1)
            return pulseCntL;
        else if (motor == 2)
            return pulseCntR;
        else
            return 0
    }

    /**
    * get the rotation degrees of wheel
    */
    export function readDistance(motor: CutebotProMotors1): number {
        let cylinderNumber: number;
        pulseNumber()
        if (motor == 1)
            //return pulseCntL;
            return Math.floor(pulseCntL * 360 / 1428 + 0.5);
        else
            //return pulseCntR;
            return Math.floor(pulseCntR * 360 / 1428 + 0.5);
    }




    /**
     * clear the rotation degrees of wheel
     */
    export function clearWheelTurn(motor: CutebotProMotors1): void {
        let buf = pins.createBuffer(7)
        buf[0] = 0x99;
        buf[1] = 0x0A;
        buf[2] = motor;
        buf[3] = 0x00;
        buf[4] = 0x00;
        buf[5] = 0x00;
        buf[6] = 0x88;
        pins.i2cWriteBuffer(i2cAddr, buf);
    }


    /**
    * select a headlights and set the RGB color.
    * @param R R color value of RGB color, eg: 0
    * @param G G color value of RGB color, eg: 128
    * @param B B color value of RGB color, eg: 255
    */
    export function singleHeadlights(light: CutebotProRGBLight, r: number, g: number, b: number): void {
        let buf = pins.createBuffer(7);
        if (light == 3) {
            buf[0] = 0x99;
            buf[1] = 0x0F;
            buf[2] = 0x03;
            buf[3] = r;
            buf[4] = g;
            buf[5] = b;
            buf[6] = 0x88;
            pins.i2cWriteBuffer(i2cAddr, buf);
        }
        else {
            if (light == 1) {
                buf[2] = 0x01;
            }
            if (light == 2) {
                buf[2] = 0x02;
            }
            buf[0] = 0x99;
            buf[1] = 0x0F;
            buf[3] = r;
            buf[4] = g;
            buf[5] = b;
            buf[6] = 0x88;
            pins.i2cWriteBuffer(i2cAddr, buf);
        }

    }


    /**
    * set LED headlights.
    */
    export function colorLight(light: CutebotProRGBLight, color: number) {
        let r: number, g: number, b: number = 0
        let buf = pins.createBuffer(7)
        r = color >> 16
        g = (color >> 8) & 0xFF
        b = color & 0xFF

        buf[0] = 0x99;
        buf[1] = 0x0F;
        buf[2] = light;
        buf[3] = r;
        buf[4] = g;
        buf[5] = b;
        buf[6] = 0x88;
        pins.i2cWriteBuffer(i2cAddr, buf)
    }

    /**
    * turn off all the LED lights
    */
    export function turnOffAllHeadlights(): void {
        let buf = pins.createBuffer(7);
        buf[0] = 0x99;
        buf[1] = 0x10;
        buf[2] = 0x03;
        buf[3] = 0x00;
        buf[4] = 0x00;
        buf[5] = 0x00;
        buf[6] = 0x88;
        pins.i2cWriteBuffer(i2cAddr, buf);
    }

    /**
    * get a status value of the 4-way line following sensor
    */
    export function trackbitStateValue() {
        let i2cBuffer = pins.createBuffer(7);
        i2cBuffer[0] = 0x99;
        i2cBuffer[1] = 0x12;
        i2cBuffer[2] = 0x00;
        i2cBuffer[3] = 0x00;
        i2cBuffer[4] = 0x00;
        i2cBuffer[5] = 0x00;
        i2cBuffer[6] = 0x88;
        pins.i2cWriteBuffer(i2cAddr, i2cBuffer)
        fourWayStateValue = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false)
        //basic.pause(5);
    }

    /**
    * 4-way line following sensor offset
    */
    export function getOffset(): number {
        let offset: number;
        let i2cBuffer = pins.createBuffer(7);
        i2cBuffer[0] = 0x99;
        i2cBuffer[1] = 0x14;
        i2cBuffer[2] = 0x00;
        i2cBuffer[3] = 0x00;
        i2cBuffer[4] = 0x00;
        i2cBuffer[5] = 0x00;
        i2cBuffer[6] = 0x88;
        pins.i2cWriteBuffer(i2cAddr, i2cBuffer)
        const offsetLow = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false);

        i2cBuffer[0] = 0x99;
        i2cBuffer[1] = 0x14;
        i2cBuffer[2] = 0x01;
        i2cBuffer[3] = 0x00;
        i2cBuffer[4] = 0x00;
        i2cBuffer[5] = 0x00;
        i2cBuffer[6] = 0x88;
        pins.i2cWriteBuffer(i2cAddr, i2cBuffer)

        const offsetHigh = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false)
        offset = (offsetHigh << 8) | offsetLow
        offset = Math.map(offset, 0, 6000, -3000, 3000);
        return offset;
    }

    /**
    * get Grayscale Sensor State
    */
    export function getGrayscaleSensorState(state: TrackbitStateType): boolean {
        return fourWayStateValue == state
    }

    /**
    * check whether the channel is online
    */
    export function trackbitChannelState(channel: TrackbitChannel, state: TrackbitType): boolean {
        if (state == TrackbitType.State_1)
            if (fourWayStateValue & (1 << (channel - 1))) {
                return true
            }
            else {
                return false
            }
        else {
            if (fourWayStateValue & (1 << (channel - 1))) {
                return false
            }
            else {
                return true
            }
        }
    }

    /**
    * get gray value.The range is from 0 to 255.
    */
    export function trackbitgetGray(channel: TrackbitChannel): number {
        let i2cBuffer = pins.createBuffer(7);
        i2cBuffer[0] = 0x99;
        i2cBuffer[1] = 0x11;
        i2cBuffer[2] = channel;
        i2cBuffer[3] = 0x00;
        i2cBuffer[4] = 0x00;
        i2cBuffer[5] = 0x00;
        i2cBuffer[6] = 0x88;
        pins.i2cWriteBuffer(i2cAddr, i2cBuffer)
        return pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false)
    }

    /**
      * cars can extend the ultrasonic function to prevent collisions and other functions..
      * @param Sonarunit two states of ultrasonic module, eg: Centimeters
      */
    export function ultrasonic(unit: SonarUnit, maxCmDistance = 500): number {
        // send pulse
        pins.setPull(DigitalPin.P8, PinPullMode.PullNone);
        pins.digitalWritePin(DigitalPin.P8, 0);
        control.waitMicros(2);
        pins.digitalWritePin(DigitalPin.P8, 1);
        control.waitMicros(10);
        pins.digitalWritePin(DigitalPin.P8, 0);
        // read pulse
        const d = pins.pulseIn(DigitalPin.P12, PulseValue.High, maxCmDistance * 50) / 0.96;
        switch (unit) {
            case SonarUnit.Centimeters:
                return Math.floor(d * 34 / 2 / 1000);
            case SonarUnit.Inches:
                return Math.floor(d * 34 / 2 / 1000 * 0.3937);
            default:
                return d;
        }
    }

    /**
     * control the car to travel at a specific speed (speed.min=20cm/s speed.max=50cm/s)
     */
    export function cruiseControl(speedL: number, speedR: number, speedUnits: CutebotProSpeedUnits): void {
        let buf = pins.createBuffer(7)
        let orientationL = 0
        let orientationR = 0

        if (speedUnits == CutebotProSpeedUnits.Cms) {
            speedL = speedL;
            speedR = speedR;
        }
        else {
            speedL = speedL / 0.3937;
            speedR = speedR / 0.3937;
        }

        if (speedL < 0) {
            speedL = -speedL
            orientationL = CutebotProOrientation.Retreat
        } else {
            orientationL = CutebotProOrientation.Advance
        }

        if (speedR < 0) {
            speedR = -speedR
            orientationR = CutebotProOrientation.Retreat
        } else {
            orientationR = CutebotProOrientation.Advance
        }

        if (speedL > 50)
            speedL = 50;
        //        else if (speedL != 0 && speedL < 20)
        //            speedL = 20;

        if (speedR > 50)
            speedR = 50;
        //        else if (speedR != 0 && speedR < 20)
        //            speedR = 20;

        buf[0] = 0x99;
        buf[1] = 0x02;
        buf[2] = orientationL;
        buf[3] = speedL;
        buf[4] = orientationR;
        buf[5] = speedR;
        buf[6] = 0x88;
        pins.i2cWriteBuffer(i2cAddr, buf)
        //basic.pause(110)
    }

    /**
     * set the car to travel a specific distance(distance.max=255cm, distance.min=0cm)
     */
    export function distanceRunning(orientation: CutebotProOrientation, distance: number, distanceUnits: CutebotProDistanceUnits): void {
        let buf = pins.createBuffer(7)
        let curtime = 0
        let oldtime = 0
        let tempdistance = 0
        let temp = 0
        CutebotPro.pwmCruiseControl(0, 0)
        if (distanceUnits == CutebotProDistanceUnits.Cm)
            tempdistance = distance;
        else if (distanceUnits == CutebotProDistanceUnits.Ft)
            tempdistance = distance / 0.3937;

        if (tempdistance > 3) {
            temp = Math.floor(tempdistance / 50) + 1
            tempdistance = tempdistance - temp
        }

        buf[0] = 0x99;
        buf[1] = 0x03;
        buf[2] = orientation;
        buf[3] = tempdistance;
        buf[4] = 0x00;
        buf[5] = 0x00;
        buf[6] = 0x88;
        pins.i2cWriteBuffer(i2cAddr, buf)
        /*oldtime = control.millis()
        while(1)
        {
            curtime = control.millis()
            if ((curtime - oldtime) == (distance * 1000 / 20 + 600))
                break
        }*/

        basic.pause(tempdistance * 1000 / 20)
        basic.pause(800)

    }

    /**
     * 
     */
    export function angleRunning(orientation: CutebotProWheel, angle: number, angleUnits: CutebotProAngleUnits): void {
        let buf = pins.createBuffer(7)
        let curtime = 0
        let oldtime = 0
        let tempangle = 0
        CutebotPro.pwmCruiseControl(0, 0)
        if (angleUnits == CutebotProAngleUnits.Angle)
            tempangle = angle;
        else if (angleUnits == CutebotProAngleUnits.Circle)
            tempangle = angle * 360;
        if (tempangle < 0)
            tempangle = -tempangle

        buf[0] = 0x99;
        buf[1] = 0x04;
        buf[2] = orientation;
        buf[3] = (tempangle >> 8) & 0xff;
        buf[4] = (tempangle >> 0) & 0xff;
        if (angle < 0)
            buf[5] = 0x00;
        else
            buf[5] = 0x01;
        buf[6] = 0x88;
        pins.i2cWriteBuffer(i2cAddr, buf)
        basic.pause(1000)
        while (1) {
            if (readSpeed(CutebotProMotors1.M1, CutebotProSpeedUnits.Cms) == 0 && readSpeed(CutebotProMotors1.M2, CutebotProSpeedUnits.Cms) == 0) {
                basic.pause(1000)
                if (readSpeed(CutebotProMotors1.M1, CutebotProSpeedUnits.Cms) == 0 && readSpeed(CutebotProMotors1.M2, CutebotProSpeedUnits.Cms) == 0)
                    break
            }

        }
    }

    /**
    * set block length
    */
    export function setBlockCnt(length: number, distanceUnits: CutebotProDistanceUnits): void {
        blocklength = length
        distanceUnitsFlag = distanceUnits
    }

    /**
    * run a specific number of block
    */
    export function runBlockCnt(cnt: number): void {
        distanceRunning(CutebotProOrientation.Advance, blocklength * cnt, distanceUnitsFlag)
    }


    /**
     * set the trolley to rotate at a specific Angle
     * OPTIMIZED PAUSES FOR V1.1 HARDWARE
     */
    export function trolleySteering(turn: CutebotProTurn, angle: number): void {
        let buf = pins.createBuffer(7)
        let curtime = 0
        let oldtime = 0
        let tempangle = 0
        let orientation = 0
        let cmd = 0
        CutebotPro.pwmCruiseControl(0, 0)
        basic.pause(200) // Modified: 1000ms -> 200ms

        if (angle == CutebotProAngle.Angle45)
            tempangle = 150
        else if (angle == CutebotProAngle.Angle90)
            tempangle = 316
        else if (angle == CutebotProAngle.Angle135)
            tempangle = 450
        else if (angle == CutebotProAngle.Angle180)
            tempangle = 630
        else if (angle < 180) {
            tempangle = 3.51 * angle
        }
        else {
            tempangle = 3.45 * angle
        }

        if (turn == CutebotProTurn.Left) {
            orientation = CutebotProWheel.RightWheel
            cmd = 0x04
        }
        else if (turn == CutebotProTurn.Right) {
            orientation = CutebotProWheel.LeftWheel
            cmd = 0x04
        }
        else {
            orientation = CutebotProWheel.AllWheel
            cmd = 23
            tempangle = tempangle + 4
        }

        buf[0] = 0x99;
        buf[1] = cmd;
        buf[2] = orientation;
        buf[3] = (tempangle >> 8) & 0xff;
        buf[4] = (tempangle >> 0) & 0xff;
        if (turn == CutebotProTurn.RightInPlace)
            buf[5] = 0x00;
        else
            buf[5] = 0x01;
        buf[6] = 0x88;
        pins.i2cWriteBuffer(i2cAddr, buf)
        basic.pause(150) // Modified: 1000ms -> 150ms
        while (1) {
            if (readSpeed(CutebotProMotors1.M1, CutebotProSpeedUnits.Cms) == 0 && readSpeed(CutebotProMotors1.M2, CutebotProSpeedUnits.Cms) == 0) {
                basic.pause(50) // Modified: 1000ms -> 50ms
                if (readSpeed(CutebotProMotors1.M1, CutebotProSpeedUnits.Cms) == 0 && readSpeed(CutebotProMotors1.M2, CutebotProSpeedUnits.Cms) == 0)
                    break
            }

        }
        basic.pause(100) // Modified: 1000ms -> 100ms
    }

    //% shim=IRV2::irCode
    function irCode(): number {
        return 0;
    }

    export function irCallback(handler: (code: number) => void) {
        pins.setPull(DigitalPin.P16, PinPullMode.PullUp)
        basic.forever(() => {
            IR_Val = irCode()
            if ((IR_Val == 0xff00 || (IR_Val & 0x00ff) == CutbotProIRButtons.Eight
                || (IR_Val & 0x00ff) == CutbotProIRButtons.Nine
                || (IR_Val & 0x00ff) == CutbotProIRButtons.Menu
                || (IR_Val & 0x00ff) == CutbotProIRButtons.Up
                || (IR_Val & 0x00ff) == CutbotProIRButtons.Left
                || (IR_Val & 0x00ff) == CutbotProIRButtons.Right
                || (IR_Val & 0x00ff) == CutbotProIRButtons.Down
                || (IR_Val & 0x00ff) == CutbotProIRButtons.OK
                || (IR_Val & 0x00ff) == CutbotProIRButtons.Plus
                || (IR_Val & 0x00ff) == CutbotProIRButtons.Minus
                || (IR_Val & 0x00ff) == CutbotProIRButtons.Back
                || (IR_Val & 0x00ff) == CutbotProIRButtons.Zero
                || (IR_Val & 0x00ff) == CutbotProIRButtons.One
                || (IR_Val & 0x00ff) == CutbotProIRButtons.Two
                || (IR_Val & 0x00ff) == CutbotProIRButtons.Three
                || (IR_Val & 0x00ff) == CutbotProIRButtons.Four
                || (IR_Val & 0x00ff) == CutbotProIRButtons.Five
                || (IR_Val & 0x00ff) == CutbotProIRButtons.Six
                || (IR_Val & 0x00ff) == CutbotProIRButtons.Seven)
                && IR_Val > 0xff
            ) {
                if (IR_Val == 0xff00)
                    IR_Val = 0x0001
                handler(IR_Val & 0x00ff)
            }
            basic.pause(20)
        })
    }
    /**
     * TODO: Get IR value
     */
    export function irButton(Button: CutbotProIRButtons): boolean {
        if (IR_Val == 0xffff) return false // over time
        return (IR_Val & 0x00ff) == Button
    }

    /*function initEvents(): void {
        if (_initEvents) {
            pins.setEvents(DigitalPin.P13, PinEventType.Edge);
            pins.setEvents(DigitalPin.P14, PinEventType.Edge);
            _initEvents = false;
        }
    }*/


    /**
     * servo control module
     */
    export function extendServoControl(servotype: ServoType, index: CutebotProServoIndex, angle: number): void {
        let angleMap: number
        if (servotype == 1) {
            angleMap = Math.map(angle, 0, 180, 0, 180);
        }

        if (servotype == 2) {
            angleMap = Math.map(angle, 0, 270, 0, 180);
        }

        if (servotype == 3) {
            angleMap = Math.map(angle, 0, 360, 0, 180);
        }

        let buf = pins.createBuffer(7)
        buf[0] = 0x99;
        buf[1] = 0x0D;
        buf[2] = index;
        buf[3] = angleMap;
        buf[4] = 0x00;
        buf[5] = 0x00;
        buf[6] = 0x88;
        pins.i2cWriteBuffer(i2cAddr, buf);
    }

    /**
     * continuous servo control
     */
    export function continuousServoControl(index: CutebotProServoIndex, speed: number): void {
        speed = Math.map(speed, -100, 100, 0, 180)
        extendServoControl(ServoType.Servo180, index, speed)
    }



    /**
     * motor control module
     */
    export function extendMotorControl(speed: number): void {
        let buf = pins.createBuffer(7)
        buf[0] = 0x99;
        buf[1] = 0x0B;
        if (speed >= 0) {
            buf[2] = 0x01;
            buf[3] = speed;
        }

        if (speed < 0) {
            buf[2] = 0x00;
            buf[3] = -speed;
        }
        buf[4] = 0x00;
        buf[5] = 0x00;
        buf[6] = 0x88;
        pins.i2cWriteBuffer(i2cAddr, buf);
    }


    /**
     * extend motor stop
     */
    export function extendMotorStop(): void {
        let buf = pins.createBuffer(7)
        buf[0] = 0x99;
        buf[1] = 0x0C;
        buf[2] = 0x02;
        buf[3] = 0xC8;
        buf[4] = 0x00;
        buf[5] = 0x00;
        buf[6] = 0x88;
        pins.i2cWriteBuffer(i2cAddr, buf);
    }

    /**
    * read version number
    */
    export function readVersions(): string {
        let cutebotProVersionsInteger: number = 0;
        let cutebotProVersionsDecimal: number = 0;

        let i2cBuffer = pins.createBuffer(7);
        i2cBuffer[0] = 0x99;
        i2cBuffer[1] = 0x15;
        i2cBuffer[2] = 0x00;
        i2cBuffer[3] = 0x00;
        i2cBuffer[4] = 0x00;
        i2cBuffer[5] = 0x00;
        i2cBuffer[6] = 0x88;
        pins.i2cWriteBuffer(i2cAddr, i2cBuffer)
        cutebotProVersionsDecimal = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false)

        i2cBuffer[0] = 0x99;
        i2cBuffer[1] = 0x15;
        i2cBuffer[2] = 0x01;
        i2cBuffer[3] = 0x00;
        i2cBuffer[4] = 0x00;
        i2cBuffer[5] = 0x00;
        i2cBuffer[6] = 0x88;
        pins.i2cWriteBuffer(i2cAddr, i2cBuffer)
        cutebotProVersionsInteger = pins.i2cReadNumber(i2cAddr, NumberFormat.UInt8LE, false)
        if (cutebotProVersionsDecimal / 10 > 1)
            return ("V" + convertToText(cutebotProVersionsInteger) + "." + convertToText(cutebotProVersionsDecimal / 10) + "." + convertToText(cutebotProVersionsDecimal % 10))
        else
            return ("V" + convertToText(cutebotProVersionsInteger) + "." + convertToText(0) + "." + convertToText(cutebotProVersionsDecimal % 10))
    }
}
