import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BeepService {

  public processBeep(actionJson: any): void {
    if (actionJson == null) {
      return;
    }

    switch (actionJson.method) {
      case 'Beep':
        this.beep(actionJson.length, actionJson.frequency);
        break;
      case 'BeepDouble':
        this.beepDouble(actionJson.length1, actionJson.length2, actionJson.frequency1, actionJson.frequency2);
        break;
      case 'BeepMultiple':
        this.beepMultiple(actionJson.beepCount, actionJson.beepLength, actionJson.breakLength, actionJson.frequency);
        break;
    }
  }

  private beep(length: number, frequency: number): void {
    const ctx = new window.AudioContext();
    const osc = ctx.createOscillator();

    osc.frequency.setValueAtTime(Math.roundDec(1000, 0), 0);

    osc.connect(ctx.destination);
    osc.start();

    setTimeout(() => {
      osc.stop();
    }, length);
  }

  private beepDouble(length1: number, length2: number, frequency1: number, frequency2: number): void {
    const ctx = new window.AudioContext();
    const osc = ctx.createOscillator();

    osc.frequency.setValueAtTime(Math.roundDec(frequency1, 0), 0);
    osc.frequency.setValueAtTime(Math.roundDec(frequency2, 0), length1 / 1000);

    osc.connect(ctx.destination);
    osc.start();

    setTimeout(() => {
      osc.stop();
    }, length1 + length2);
  }

  private beepMultiple(beepCount: number, beepLength: number, breakLength: number, frequency: number): void {
    const ctx = new window.AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.setValueAtTime(Math.roundDec(frequency, 0), 0);

    let time: number = 0;

    for (let i = 0; i < beepCount; i++) {
      if (i !== 0) {
        gain.gain.setValueAtTime(0, time);
        time += breakLength / 1000;
      }

      gain.gain.setValueAtTime(1, time);
      time += beepLength / 1000;
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    setTimeout(() => {
      osc.stop();
    }, beepCount * beepLength + (beepCount - 1) * breakLength);
  }
}
