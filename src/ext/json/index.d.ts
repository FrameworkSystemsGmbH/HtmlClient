interface JSON {

  stringifyDecycle(obj: any, replacer?: (key: string, value: any) => any, spaces?: number, cycleReplacer?: (key: string, value: any) => any);

}
