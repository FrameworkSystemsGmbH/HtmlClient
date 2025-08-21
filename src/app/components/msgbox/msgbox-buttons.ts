import { MsgBoxButtons } from '@app/enums/msgbox-buttons';
import { MsgBoxDefaultButton } from '@app/enums/msgbox-defaultbutton';
import { MsgBoxResult } from '@app/enums/msgbox-result';

export const createAllButtons = () => [
  {
    label: 'Yes',
    showFor: [MsgBoxButtons.YesNo, MsgBoxButtons.YesNoCancel],
    focusWhen: (focus: string) => focus === MsgBoxDefaultButton.First,
    result: MsgBoxResult.Yes
  },
  {
    label: 'No',
    showFor: [MsgBoxButtons.YesNo, MsgBoxButtons.YesNoCancel],
    focusWhen: (focus: string) => focus === MsgBoxDefaultButton.Second,
    result: MsgBoxResult.No
  },
  {
    label: 'Ok',
    showFor: [MsgBoxButtons.Ok, MsgBoxButtons.OkCancel],
    focusWhen: (focus: string) => focus === MsgBoxDefaultButton.First,
    result: MsgBoxResult.Ok
  },
  {
    label: 'Abort',
    showFor: [MsgBoxButtons.AbortRetryIgnore],
    focusWhen: (focus: string) => focus === MsgBoxDefaultButton.First,
    result: MsgBoxResult.Abort
  },
  {
    label: 'Retry',
    showFor: [MsgBoxButtons.AbortRetryIgnore, MsgBoxButtons.RetryCancel],
    focusWhen: (focus: string, btns: MsgBoxButtons) =>
      focus === MsgBoxDefaultButton.First ||
      (focus === MsgBoxDefaultButton.Second && btns === MsgBoxButtons.AbortRetryIgnore),
    result: MsgBoxResult.Retry
  },
  {
    label: 'Ignore',
    showFor: [MsgBoxButtons.AbortRetryIgnore],
    focusWhen: (focus: string) => focus === MsgBoxDefaultButton.Last,
    result: MsgBoxResult.Ignore
  },
  {
    label: 'Cancel',
    showFor: [MsgBoxButtons.OkCancel, MsgBoxButtons.RetryCancel, MsgBoxButtons.YesNoCancel],
    focusWhen: (focus: string) => focus === MsgBoxDefaultButton.Last,
    result: MsgBoxResult.Cancel
  }
];
