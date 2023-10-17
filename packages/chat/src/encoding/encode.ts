import { Colors, Modifiers } from '../utils/components';

export interface ChatComponent {
  bold?: boolean;
  color?: string;
  extra?: ChatComponent[];
  italic?: boolean;
  obfuscated?: boolean;
  strikethrough?: boolean;
  text: string;
  underlined?: boolean;
}

/**
 * Converts raw text into a chat component.
 *
 * @param input - The raw text to be converted into a chat component. e.g. "§7A Minecraft server"
 * @returns The chat component object.
 * @example
 * ```javascript
 * const component = createChatComponent('§7A Minecraft server');
 * ```
 * @example
 * ```javascript
 * const component = createChatComponent('§7A Minecraft server §brunning on §c1.8.9');
 * ```
 * @example
 * ```javascript
 * const component = createChatComponent('§7§lA Minecraft server §brunning on §c1.8.9 §bwith §c100 §bplayers online');
 * ```
 */
export function createChatComponent(input: string): ChatComponent {
  if (!input.includes('§')) return { text: input };

  const finalComponent: ChatComponent = { text: '', extra: [] };

  let currentComponent: ChatComponent = { text: '' };
  let currentColor: string | undefined;
  let currentModifier: string | undefined;

  const characters = input.split('');

  for (let charIndex = 0; charIndex < characters.length; charIndex++) {
    const character = characters[charIndex];

    if (character === '§') {
      const nextCharacter = characters[charIndex + 1];

      // If the next character is 'r', reset the current component, color, and modifier.
      if (nextCharacter === 'r') {
        currentComponent = { text: '' };
        currentColor = undefined;
        currentModifier = undefined;
      } else {
        const color = Colors[nextCharacter];
        const modifier = Modifiers[nextCharacter];

        if (color) currentColor = color.color;
        if (modifier) currentModifier = nextCharacter;
      }

      charIndex++;
    } else {
      if (currentColor) currentComponent.color = currentColor;

      if (currentModifier) {
        const modifier = Modifiers[currentModifier];
        currentComponent = { ...currentComponent, ...modifier };
      }

      currentComponent.text += character;
    }

    // Check if the next character is also '§' or if we've reached the end of the input.
    if (characters[charIndex + 1] === '§' || charIndex === characters.length - 1) {
      finalComponent.extra!.push(currentComponent);
      // Reset the current component to start a new one.
      currentComponent = { text: '' };
    }
  }

  return finalComponent;
}
