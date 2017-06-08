import { ResponseControlDto } from '.';

export class ResponseFormDto {

  public id: string;
  public name: string;
  public title: string;
  public delta: boolean;
  public controls: Array<ResponseControlDto>;

}
