export class LateCheckInValidationError extends Error {
  constructor() {
    super('The check-in it can only be validated within 20 minutes of creation')
  }
}
