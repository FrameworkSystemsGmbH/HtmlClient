import { MsgBoxIcon } from '@app/enums/msgbox-icon';
import { MsgBoxButtons } from '@app/enums/msgbox-buttons';

export interface IMsgBoxData {
  title: string;
  message: string;
  icon: MsgBoxIcon;
  buttons: MsgBoxButtons;
}
