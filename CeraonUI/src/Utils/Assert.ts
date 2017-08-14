
export default function assert(condition: boolean, text: string) {
  if (!condition) {
    throw text;
  }
}