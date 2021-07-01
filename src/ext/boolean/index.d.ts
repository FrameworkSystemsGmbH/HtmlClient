interface BooleanConstructor {

  trueIfNull: (value: boolean | null | undefined) => boolean;

  falseIfNull: (value: boolean | null | undefined) => boolean;

  nullIfTrue: (value: boolean) => boolean | null;

  nullIfFalse: (value: boolean) => boolean | null;

}
