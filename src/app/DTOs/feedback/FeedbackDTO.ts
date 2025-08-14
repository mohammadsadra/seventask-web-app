import {UserDTO} from '../user/UserDTO';

export class FeedbackDTO {
  public Title: string;
  public description: string;
  public attachment: string;


  constructor(
    Title: string,
    description: string,
    attachment: string,
  ) {
    this.Title = Title;
    this.description = description;
    this.attachment = attachment;
  }
}
