// tslint:disable:interface-name
interface BooleanConstructor {

  trueIfNull(value: boolean): boolean;

  falseIfNull(value: boolean): boolean;

  nullIfTrue(value: boolean): boolean;

  nullIfFalse(value: boolean): boolean;

}
