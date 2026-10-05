export class User {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly name: string | null,
    public passwordHash: string,
    public readonly createdAt: Date
  ) {}
}