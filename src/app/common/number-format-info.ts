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
    return !String.isNullOrEmpty(this.prefixPart);
  }

  public hasDigitsPart(): boolean {
    return !String.isNullOrEmpty(this.digitsPart);
  }

  public hasDecimalsPart(): boolean {
    return !String.isNullOrEmpty(this.decimalsPart);
  }

  public hasSuffixPart(): boolean {
    return !String.isNullOrEmpty(this.suffixPart);
  }

  public getDigitsCount(): number {
    return this.hasDigitsPart() ? this.digitsPart.length : 0;
  }

  public getDecimalsCount(): number {
    return this.hasDecimalsPart() ? this.decimalsPart.length : 0;
  }
}
