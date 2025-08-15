import { MsgBoxButtons } from '@app/enums/msgbox-buttons';
import { MsgBoxDefaultButton } from '@app/enums/msgbox-defaultbutton';
import { MsgBoxIcon } from '@app/enums/msgbox-icon';

export interface IMsgBoxData {
  title: string;
  message: string;
  icon: MsgBoxIcon;
  buttons: MsgBoxButtons;
  defaultButton: MsgBoxDefaultButton;
}
