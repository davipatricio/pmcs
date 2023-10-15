/* eslint-disable id-length */
interface Color {
  color: string;
}

interface Modifier {
  bold?: boolean;
  italic?: boolean;
  obfuscated?: boolean;
  strikethrough?: boolean;
  underlined?: boolean;
}

export const Colors: Record<string, Color> = {
  '0': { color: 'black' },
  '1': { color: 'dark_blue' },
  '2': { color: 'dark_green' },
  '3': { color: 'dark_aqua' },
  '4': { color: 'dark_red' },
  '5': { color: 'dark_purple' },
  '6': { color: 'gold' },
  '7': { color: 'gray' },
  '8': { color: 'dark_gray' },
  '9': { color: 'blue' },
  a: { color: 'green' },
  b: { color: 'aqua' },
  c: { color: 'red' },
  d: { color: 'light_purple' },
  e: { color: 'yellow' },
  f: { color: 'white' },
};

export const Modifiers: Record<string, Modifier> = {
  k: { obfuscated: true },
  l: { bold: true },
  m: { strikethrough: true },
  n: { underlined: true },
  o: { italic: true },
  r: { obfuscated: false, bold: false, strikethrough: false, underlined: false, italic: false },
};
