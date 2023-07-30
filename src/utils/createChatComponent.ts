interface ChatComponent {
  text: string;
  extra: {
    text: string;
    color?: string;
  }[];
}

/**
 * Converts raw text into a chat component.
 * @param text The raw text to be converted into a chat component. e.g. "§7A Minecraft server"
 * @returns The chat component object.
 */
export default function createChatComponent(text: string): ChatComponent {
  const chatComponent: ChatComponent = {
    text: "",
    extra: [],
  };

  const parts = text.split("§");
  let previousColor = "";

  parts.forEach((part, index) => {
    if (index === 0) {
      chatComponent.text = part;
    } else {
      const colorCode = part.charAt(0);
      const remainingText = part.slice(1);

      const extraComponent = {
        text: remainingText,
        color: getColorFromCode(colorCode),
      };

      if (previousColor) {
        extraComponent.color = previousColor;
      }

      chatComponent.extra.push(extraComponent);

      previousColor = extraComponent.color;
    }
  });

  return chatComponent;
}

function getColorFromCode(colorCode: string): string | undefined {
  // Map Minecraft color codes to CSS color names or hex values
  const colorMap: { [key: string]: string } = {
    0: "black",
    1: "dark_blue",
    2: "dark_green",
    3: "dark_aqua",
    4: "dark_red",
    5: "dark_purple",
    6: "gold",
    7: "gray",
    8: "dark_gray",
    9: "blue",
    a: "green",
    b: "aqua",
    c: "red",
    d: "light_purple",
    e: "yellow",
    f: "white",
  };

  return colorMap[colorCode] || undefined;
}
