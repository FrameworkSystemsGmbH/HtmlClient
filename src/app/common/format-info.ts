export class FormatInfo {
  public prefixPart: string = String.empty();
  public digitsPart: string = String.empty();
  public decimalsPart: string = String.empty();
  public suffixPart: string = String.empty();

  public firstDigitZeroPos: number;
  public lastDecimalZeroPos: number;

  public isPercent: boolean = false;
  public isPermille: boolean = false;
  public hasGrouping: boolean = false;
  public negativeFirst: boolean = false;

  public hasPrefixPart(): boolean {
    return !!this.prefixPart;
  }

  public hasDigitsPart(): boolean {
    return !!this.digitsPart;
  }

  public hasDecimalsPart(): boolean {
    return !!this.decimalsPart;
  }

  public hasSuffixPart(): boolean {
    return !!this.suffixPart;
  }

  public hasFirstDigitZero(): boolean {
    return this.firstDigitZeroPos != null;
  }

  public hasLastDecimalZero(): boolean {
    return this.lastDecimalZeroPos != null;
  }

  public getDigitsCount(): number {
    return this.hasDigitsPart() ? this.digitsPart.length : 0;
  }

  public getDecimalsCount(): number {
    return this.hasDecimalsPart() ? this.decimalsPart.length : 0;
  }
}
