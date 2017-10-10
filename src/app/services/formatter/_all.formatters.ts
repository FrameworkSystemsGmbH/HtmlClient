import { DateTimeFormatService } from './datetime-format.service';
import { NumberFormatService } from './number-format.service';
import { PatternFormatService } from './pattern-format.service';
import { StringFormatService } from './string-format.service';

export const ALL_FORMATTERS = [
  DateTimeFormatService,
  NumberFormatService,
  PatternFormatService,
  StringFormatService
];
