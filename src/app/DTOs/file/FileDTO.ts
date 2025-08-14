export class FileDTO {
  public name: string;
  public extension: string;
  public size: number;
  public fileContainerGuid: string;

  constructor(
    name: string,
    extension: string,
    size: number,
    fileContainerGuid: string
  ) {
    this.name = name;
    this.extension = extension;
    this.size = size;
    this.fileContainerGuid = fileContainerGuid;
  }
}
