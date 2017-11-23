import { DateTimeFormatService } from 'app/services/formatter/datetime-format.service';
import { NumberFormatService } from 'app/services/formatter/number-format.service';
import { PatternFormatService } from 'app/services/formatter/pattern-format.service';
import { StringFormatService } from 'app/services/formatter/string-format.service';

export const ALL_FORMATTERS = [
  DateTimeFormatService,
  NumberFormatService,
  PatternFormatService,
  StringFormatService
];
