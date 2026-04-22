import puppeteer from "puppeteer";

export interface ExportData {
  title: string;
  author?: string;
  content: string | Record<string, unknown>; // This would be the Tiptap JSON or HTML
}

export const generatePdf = async (data: ExportData): Promise<Buffer> => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--single-process",
    ],
  });
  const page = await browser.newPage();

  // Basic screenplay HTML wrapper
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @font-face {
          font-family: 'Courier Prime';
          src: local('Courier Prime'), local('Courier');
        }
        body {
          font-family: 'Courier Prime', 'Courier', monospace;
          font-size: 12pt;
          line-height: 1.2;
          margin: 0;
          padding: 0;
        }
        .page {
          padding-top: 1in;
          padding-bottom: 1in;
          padding-left: 1.5in;
          padding-right: 1in;
        }
        /* Basic screenplay elements styling */
        .scene-heading { text-transform: uppercase; font-weight: bold; margin-top: 24pt; margin-bottom: 12pt; }
        .action { margin-top: 12pt; margin-bottom: 12pt; }
        .character { text-align: center; width: 50%; margin-left: 25%; margin-top: 12pt; text-transform: uppercase; }
        .parenthetical { text-align: center; width: 40%; margin-left: 30%; }
        .dialogue { text-align: center; width: 70%; margin-left: 15%; margin-bottom: 12pt; }
        .transition { text-align: right; text-transform: uppercase; margin-top: 24pt; }
      </style>
    </head>
    <body>
      <div class="page">
        <h1>${data.title}</h1>
        ${data.author ? `<p>By ${data.author}</p>` : ""}
        <div class="content">
          ${typeof data.content === "string" ? data.content : "JSON content processing not implemented yet"}
        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(htmlContent);
  const pdfBuffer = await page.pdf({
    format: "Letter",
    printBackground: true,
    margin: {
      top: "1in",
      bottom: "1in",
      left: "1in",
      right: "1in",
    },
  });

  await browser.close();
  return Buffer.from(pdfBuffer);
};

export const generateFdx = async (data: ExportData): Promise<string> => {
  // Final Draft XML (FDX) implementation
  const fdxContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<FinalDraft DocumentType="Script" Version="4">
  <Content>
    <Paragraph Type="Scene Heading">
      <Text>${data.title}</Text>
    </Paragraph>
    <!-- FDX generation logic here -->
  </Content>
</FinalDraft>`;
  return fdxContent;
};
