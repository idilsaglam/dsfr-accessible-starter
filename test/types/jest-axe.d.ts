// test/types/jest-axe.d.ts
declare namespace jest {
  interface Matchers<R> {
    toHaveNoViolations(): R;
  }
}
