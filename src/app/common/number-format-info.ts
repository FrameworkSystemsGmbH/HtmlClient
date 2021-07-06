export class NumberFormatInfo {
  public prefixPart: string = String.empty();
  public digitsPart: string = String.empty();
  public decimalsPart: string = String.empty();
  public suffixPart: string = String.empty();

  public firstDigitZeroPos: number | null = null;
  public lastDecimalZeroPos: number | null = null;

  public isPercent: boolean = false;
  public isPermille: boolean = false;
  public hasGrouping: boolean = false;
  public negativeFirst: boolean = false;

  public hasPrefixPart(): boolean {
    return this.prefixPart.length > 0;
  }

  public hasDigitsPart(): boolean {
    return this.digitsPart.length > 0;
  }

  public hasDecimalsPart(): boolean {
    return this.decimalsPart.length > 0;
  }

  public hasSuffixPart(): boolean {
    return this.suffixPart.length > 0;
  }

  public getDigitsCount(): number {
    return this.hasDigitsPart() ? this.digitsPart.length : 0;
  }

  public getDecimalsCount(): number {
    return this.hasDecimalsPart() ? this.decimalsPart.length : 0;
  }
}
