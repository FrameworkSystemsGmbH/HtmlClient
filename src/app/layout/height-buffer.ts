export class HeightBuffer {

  public static defaultSize: number = 3;

  protected size = HeightBuffer.defaultSize;
  protected widths: Array<number>;
  protected heights: Array<number>;
  protected generations: Array<number>;
  protected generationCounter: number = 0;

  public setSize(size: number): void {
    if (!size || size < 1) {
      this.size = HeightBuffer.defaultSize;
    } else {
      this.size = size;
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
    for (let i = 0; i < this.size; i++) {
      if (this.widths[i] === width) {
        this.generations[i] = ++this.generationCounter;
        return this.heights[i];
      }
    }

    // 2. No value for requested width found in buffer
    // => Look for position of the oldest generation.
    let firstGenerationPos: number = 0;
    let firstGenerationValue: number = Number.MAX_VALUE;
    for (let i = 0; i < this.size; i++) {
      const currentGenerationValue: number = this.generations[i];
      if (currentGenerationValue < firstGenerationValue) {
        firstGenerationValue = currentGenerationValue;
        firstGenerationPos = i;
      }
    }

    // 3. Calculate the value and save it
    const result: number = heightCalculator();
    this.widths[firstGenerationPos] = width;
    this.heights[firstGenerationPos] = result;
    this.generations[firstGenerationPos] = ++this.generationCounter;

    return result;
  }

  public clear(): void {
    this.widths = new Array<number>(this.size);
    this.heights = new Array<number>(this.size);
    this.generations = new Array<number>(this.size);
    this.generationCounter = 0;
  }
}
