import { Colors } from "./constants/colors";

interface ChatComponent {
  text: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underlined?: boolean;
  strikethrough?: boolean;
  obfuscated?: boolean;

  extra?: ChatComponent[];
}

/**
 * Converts raw text into a chat component.
 * @param text The raw text to be converted into a chat component. e.g. "§7A Minecraft server"
 * @returns The chat component object.
 */
export default function createChatComponent(text: string): ChatComponent {
  const parts = text.split("§");
  const chatComponent: ChatComponent = {
    text: parts.shift() || ""
  };

  if (parts.length !== 0) {
    let previousColor = "";

    chatComponent.extra = parts.map((part) => {
      const colorCode = part.charAt(0) as keyof typeof Colors;
      const remainingText = part.slice(1);

      const extraComponent = {
        text: remainingText,
        color: getColorFromCode(colorCode) || previousColor
      };

      previousColor = extraComponent.color;

      return extraComponent;
    });
  }

  return chatComponent;
}

function getColorFromCode(colorCode: keyof typeof Colors) {
  return Colors[colorCode];
}
