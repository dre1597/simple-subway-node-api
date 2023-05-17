export class HelloController {
  public get(): { hello: string } {
    return { hello: 'world' };
  }
}
