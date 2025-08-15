import { MsgBoxButtons } from '@app/enums/msgbox-buttons';
import { MsgBoxDefaultButton } from '@app/enums/msgbox-defaultbutton';

export const createAllButtons = (defaultButtonFocusType: typeof MsgBoxDefaultButton) => [
  {
    label: 'Yes',
    showFor: [MsgBoxButtons.YesNo, MsgBoxButtons.YesNoCancel],
    focusWhen: (focus: string) => focus === defaultButtonFocusType.First,
    clickHandler: 'onYesClick'
  },
  {
    label: 'No',
    showFor: [MsgBoxButtons.YesNo, MsgBoxButtons.YesNoCancel],
    focusWhen: (focus: string) => focus === defaultButtonFocusType.Second,
    clickHandler: 'onNoClick'
  },
  {
    label: 'Ok',
    showFor: [MsgBoxButtons.Ok, MsgBoxButtons.OkCancel],
    focusWhen: (focus: string) => focus === defaultButtonFocusType.First,
    clickHandler: 'onOkClick'
  },
  {
    label: 'Abort',
    showFor: [MsgBoxButtons.AbortRetryIgnore],
    focusWhen: (focus: string) => focus === defaultButtonFocusType.First,
    clickHandler: 'onAbortClick'
  },
  {
    label: 'Retry',
    showFor: [MsgBoxButtons.AbortRetryIgnore, MsgBoxButtons.RetryCancel],
    focusWhen: (focus: string, btns: MsgBoxButtons) =>
      focus === defaultButtonFocusType.First ||
      (focus === defaultButtonFocusType.Second && btns === MsgBoxButtons.AbortRetryIgnore),
    clickHandler: 'onRetryClick'
  },
  {
    label: 'Ignore',
    showFor: [MsgBoxButtons.AbortRetryIgnore],
    focusWhen: () => false,
    clickHandler: 'onIgnoreClick'
  },
  {
    label: 'Cancel',
    showFor: [MsgBoxButtons.OkCancel, MsgBoxButtons.RetryCancel, MsgBoxButtons.YesNoCancel],
    focusWhen: () => false,
    clickHandler: 'onCancelClick'
  }
];
