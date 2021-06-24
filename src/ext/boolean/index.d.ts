interface BooleanConstructor {

  trueIfNull: (value: boolean | null) => boolean;

  falseIfNull: (value: boolean | null) => boolean;

  nullIfTrue: (value: boolean) => boolean | null;

  nullIfFalse: (value: boolean) => boolean | null;

}
