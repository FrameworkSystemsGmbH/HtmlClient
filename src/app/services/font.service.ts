import { Injectable } from '@angular/core';

@Injectable()
export class FontService {

  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
  }

  public measureWidth(text: string, font: string, size: number, weight: string = 'normal'): number {
    this.context.font = font + ' ' + size + 'px' + ' ' + weight;
    return this.context.measureText(text).width;
  }

}
