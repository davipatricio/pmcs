import { Colors } from '../utils/components';
import type { ChatComponent } from './encode';

/**
 * Converts a chat component into raw text.
 *
 * @param component - The chat component to be converted into raw text.
 * @returns The raw text.
 * @example
 * ```javascript
 * const component = fromChatComponent({ text: 'A Minecraft server' });
 * ```
 * @example
 * ```javascript
 * const component = fromChatComponent({ text: 'A Minecraft server', color: 'gray' });
 * ```
 * @example
 * ```javascript
 * const component = fromChatComponent({ text: 'A Minecraft server', color: 'gray', bold: true });
 * ```
 * @example
 * ```javascript
 * const component = fromChatComponent({ text: 'A Minecraft server', color: 'gray', bold: true, extra: [{ text: ' running on ' }, { text: '1.8.9', color: 'red' }] });
 * ```
 */
export function fromChatComponent(component: ChatComponent): string {
  let output = '';

  if (component.color)
    output += `§${Object.keys(Colors).find((key) => Colors[key as keyof typeof Colors].color === component.color)}`;
  if (component.bold) output += '§l';
  if (component.italic) output += '§o';
  if (component.obfuscated) output += '§k';
  if (component.strikethrough) output += '§m';
  if (component.underlined) output += '§n';

  output += component.text;

  if (component.extra) {
    for (const extraComponent of component.extra) {
      output += fromChatComponent(extraComponent);
    }
  }

  return output;
}
