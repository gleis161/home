// src/utils/content.ts
export interface ContentData {
  heading: string;
  content: string;
  ending: string;
}

export interface DonationItem {
  organization: string;
  description: string;
}

export interface DonationsData {
  title: string;
  items: DonationItem[];
}

export function parseMainContent(rawContent: string): ContentData {
  try {
    const lines = rawContent.split("\n").filter((line) => line.trim() !== "");
    const heading = lines[0]?.replace("# ", "") || "Error";
    const ending = lines[lines.length - 1]?.replace("# ", "") || "";
    const content = lines.slice(1, -1).join("\n").trim();
    
    return { heading, content, ending };
  } catch (error) {
    console.error("Error parsing main content:", error);
    return {
      heading: "You probably had the wrong passphrase.",
      content: "Could not load content.\nPlease try again later.",
      ending: ""
    };
  }
}

export function parseDonationsContent(rawContent: string): DonationsData {
  try {
    const lines = rawContent.split("\n").filter((line) => line.trim() !== "");
    const title = lines[0]?.replace("# ", "") || "Error";
    const items = lines.slice(1).map((line) => {
      const [org, ...descParts] = line.split(": ");
      return {
        organization: org || "",
        description: descParts.join(": ") || ""
      };
    });
    
    return { title, items };
  } catch (error) {
    console.error("Error parsing donations content:", error);
    return { title: "Content could not be parsed, do you know the passphrase?", items: [] };
  }
}
