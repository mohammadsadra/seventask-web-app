export class FeatureDTO {
  public description: string;
  public image: string;

  constructor(
    description: string,
    image: string,
  ) {
    this.description = description;
    this.image = image;
  }
}
