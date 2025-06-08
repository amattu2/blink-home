# Introduction

This is a fullstack Next.js project designed to provide a Blink Smart Security
(Immedia Semi) dashboard for web-based users. It currently supports the following
features:

- View Cloud-based clips and events
- View/Refresh camera thumbnails

Upcoming feature goals:

- Edit camera settings
- View camera live streams
- View local storage clips and events

# Getting Started

Clone the [.env.local.example](.env.local.example) file to `.env.local` and fill
in the required fields.

```bash
cp .env.local.example .env.local
```

| Variable | Description |
| --- | --- |
|APP_NAME|The name of the application|
|CLIENT_NAME|The name of the client passed to the Blink API. Should be consistent in order to persist sessions|
|LIVEVIEW_MIDDLEWARE_URL|The URL of the live view middleware WebSocket server. Refer to <https://github.com/amattu2/blink-liveview-middleware>. If empty, liveview is disabled.|
|SESSION_PASSWORD|The password used to encrypt the session cookie. Recommend a long and random password|
|SESSION_COOKIE_NAME|The name of the session cookie|

Install the dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
deployed application.
