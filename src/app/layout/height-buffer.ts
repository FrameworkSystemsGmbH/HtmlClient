export class HeightBuffer {

  public static defaultSize: number = 3;

  protected _size: number = HeightBuffer.defaultSize;
  protected _widths: Array<number> = new Array<number>(this._size);
  protected _heights: Array<number> = new Array<number>(this._size);
  protected _generations: Array<number> = new Array<number>(this._size);
  protected _generationCounter: number = 0;

  public setSize(size: number): void {
    if (!size || size < 1) {
      this._size = HeightBuffer.defaultSize;
    } else {
      this._size = size;
    }

    this.clear();
  }

  /**
   * Returns the buffered height to a given width.
   * In case there is no value stored in the buffer for the given width,
   * hightCalculator gets executed and the result stored in the buffer.
   */
  public get(width: number, heightCalculator: () => number): number {
    // Requests for widths equal to or smaller than 0 return 0 without any calculations
    if (width <= 0) {
      return 0;
    }

    // 1. Search in buffer (and refresh generation if found)
    for (let i = 0; i < this._size; i++) {
      if (this._widths[i] === width) {
        this._generations[i] = ++this._generationCounter;
        return this._heights[i];
      }
    }

    /*
     * 2. No value for requested width found in buffer
     * => Look for position of the oldest generation.
     */
    let firstGenerationPos: number = 0;
    let firstGenerationValue: number = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < this._size; i++) {
      const currentGenerationValue: number = this._generations[i];
      if (currentGenerationValue < firstGenerationValue) {
        firstGenerationValue = currentGenerationValue;
        firstGenerationPos = i;
      }
    }

    // 3. Calculate the value and save it
    const result: number = heightCalculator();
    this._widths[firstGenerationPos] = width;
    this._heights[firstGenerationPos] = result;
    this._generations[firstGenerationPos] = ++this._generationCounter;

    return result;
  }

  public clear(): void {
    this._widths = new Array<number>(this._size);
    this._heights = new Array<number>(this._size);
    this._generations = new Array<number>(this._size);
    this._generationCounter = 0;
  }
}
