const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/resolve", async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: "URL parameter is required" });
  }

  console.log(`Resolving: ${targetUrl}`);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Emulate a real user to avoid bots detection if necessary
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    );

    let directLink = null;

    // Intercept network requests to find the video file
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const url = request.url();
      // Look for .mp4, .m3u8, or common video keywords
      if (
        url.includes(".mp4") ||
        url.includes(".m3u8") ||
        url.includes("/video/")
      ) {
        directLink = url;
      }
      request.continue();
    });

    // Navigate to the embed URL
    await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 45000 });

    // If not found yet, try clicking Play
    if (!directLink) {
      const playButtonSelectors = [
        ".vjs-big-play-button",
        "button.play",
        "#play",
        ".play-btn",
      ];
      for (const selector of playButtonSelectors) {
        const btn = await page.$(selector);
        if (btn) {
          await btn.click();
          await new Promise((r) => setTimeout(r, 4000)); // Wait for player to load source
          break;
        }
      }
    }

    // Final check in document if network interception missed it
    if (!directLink) {
      directLink = await page.evaluate(() => {
        // Look for common video hosts patterns
        const v = document.querySelector("video");
        if (v && v.src && !v.src.startsWith("blob:")) return v.src;

        const s = document.querySelector("video source");
        if (s && s.src) return s.src;

        // OkPrime specific: sometimes link is in JS variable or data attribute
        const scripts = Array.from(document.querySelectorAll("script"));
        for (const script of scripts) {
          const content = script.textContent;
          const match = content.match(/file:"([^"]+\.mp4[^"]*)"/);
          if (match) return match[1];
        }

        return null;
      });
    }

    if (directLink) {
      console.log(`Found direct link: ${directLink}`);
      res.json({ url: directLink });
    } else {
      console.error("Could not find video source");
      res.status(404).json({ error: "Direct video link not found" });
    }
  } catch (error) {
    console.error("Error during resolution:", error.message);
    res
      .status(500)
      .json({ error: "Failed to resolve link", details: error.message });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Resolver API running on http://localhost:${PORT}`);
});
