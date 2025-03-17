# Upload YouTube Video Command Line Program

This project allows you to upload a video to YouTube via the command line using the YouTube Data API and OAuth2 authentication.

## Prerequisites

- Node.js (>= 12)
- A Google account enabled for the YouTube Data API
- OAuth2 client credentials from the Google Developer Console

## Setup

1. Clone this repository.
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the project root and add your YouTube client credentials:
   ```
   YOUTUBE_CLIENT_SECRET=your_client_secret_here
   YOUTUBE_CLIENT_ID=your_client_id_here
   ```
4. When running the program for the first time, you will be prompted to authorize the app and obtain an OAuth2 token. This token is stored in the `.credentials/` directory.

## Usage

Run the program using:

```
node quickstart.ts <video_file_path> <title> [description] [privacyStatus]
```

Example:

```
node quickstart.ts ./video.mp4 "My Test Video" "This is a test upload" public
```

## File Structure

- `.credentials/`  
  Contains the OAuth2 token file (`youtube-nodejs-quickstart.json`).

- `node_modules/`  
  Contains installed dependencies.

- `.env`  
  Contains environment variables for YouTube client credentials.

- `package.json`  
  Project metadata and dependency definitions.

- `quickstart.ts`  
  Main TypeScript file handling authentication and video upload.

- `tsconfig.json`  
  TypeScript configuration file.

- `README.md`  
  This file.

## Building the Project

Compile TypeScript files with:

```
npm run build
```

## Notes

- The OAuth2 process is initiated if no token is found in `.credentials/`.
- Ensure the video file exists and that you have the necessary permissions to read it.
- By default, if no privacyStatus is provided, the video is uploaded as "private".

## License

ISC

## Author

Neil Mahajan ([neilsmahajan@gmail.com](mailto:neilsmahajan@gmail.com))
