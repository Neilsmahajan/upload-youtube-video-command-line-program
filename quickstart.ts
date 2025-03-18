import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import readline from "readline";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

const SCOPES = [
  "https://www.googleapis.com/auth/youtube",
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtube.force-ssl",
  "https://www.googleapis.com/auth/youtubepartner",
];
const TOKEN_DIR = ".credentials/";
const TOKEN_PATH = TOKEN_DIR + "youtube-nodejs-quickstart.json";

authorize(uploadVideo);

function authorize(callback: (auth: OAuth2Client) => void) {
  // Retrieve credentials from environment variables instead of hardcoded strings.
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const redirectUrl = "http://localhost:3000/api/auth/callback/google";
  if (!clientSecret || !clientId) {
    console.error(
      "Environment variables YOUTUBE_CLIENT_SECRET and/or YOUTUBE_CLIENT_ID not defined."
    );
    process.exit(1);
  }
  const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err: any, token: { toString: () => string }) => {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token.toString());
      callback(oauth2Client);
    }
  });
}

function getNewToken(
  oauth2Client: OAuth2Client,
  callback: (auth: OAuth2Client) => void
) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url: ", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code: string) => {
    rl.close();
    oauth2Client.getToken(code, (err, token) => {
      if (err || !token) {
        console.error("Error while trying to retrieve access token", err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

function storeToken(token: any) {
  try {
    fs.mkdirSync(TOKEN_DIR, { recursive: true });
  } catch (err: any) {
    if (err.code !== "EEXIST") {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log("Token stored to " + TOKEN_PATH);
  });
}

function uploadVideo(auth: OAuth2Client) {
  // Extract command-line arguments:
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log(
      "Usage: node quickstart.ts <video_file_path> <title> [description] [privacyStatus]"
    );
    process.exit(1);
  }
  const videoFile = args[0];
  const title = args[1];
  const description = args[2] || "";
  const privacyStatus = args[3] || "private";

  const youtube = google.youtube("v3");
  youtube.videos.insert(
    {
      auth: auth, // added to pass OAuth2 credentials
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title: title,
          description: description,
          tags: ["youtube-upload"],
          categoryId: "22",
        },
        status: {
          privacyStatus: privacyStatus,
        },
      },
      media: {
        body: fs.createReadStream(videoFile),
      },
    },
    (err, response) => {
      if (err) {
        console.error("Error uploading video:", err);
      } else {
        if (response && response.data) {
          console.log(
            "Video uploaded successfully. Video ID:",
            response.data.id
          );
        } else {
          console.error("Error: No response or response data.");
        }
      }
    }
  );
}
