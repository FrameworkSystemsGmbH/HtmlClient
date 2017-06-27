import { Injectable } from '@angular/core';

@Injectable()
export class FontService {

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
  }

  public measureWidth(text: string, font: string, size: number, isBold: boolean, isItalic: boolean): number {
    this.context.font = (isBold ? 'bold' : String.empty()) + (isItalic ? ' italic' : String.empty()) + ' ' + size + 'px' + font;
    this.context.font = '14px Arial';
    return this.context.measureText(text).width;
  }

}
