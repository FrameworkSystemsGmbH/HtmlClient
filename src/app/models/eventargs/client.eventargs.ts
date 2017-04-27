import { FormWrapper } from '../../wrappers';

export class ClientEventArgs {

  constructor(
    private form: FormWrapper,
    private json: any
  ) { }

  public getForm(): FormWrapper {
    return this.form;
  }

  public getJson(): any {
    return this.json;
  }
}
