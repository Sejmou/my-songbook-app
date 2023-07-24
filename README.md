# My SongBook
A native mobile app for managing your own songbook.

## Features
 - Store songs on your device (accessible offline!)
 - Sync with 'the cloud' (via API that communicates with a remote Database)
 - Add songs from Genius.com
 - Organize songs into sections that can be jumped to quickly
 - MIDI controller support (for scrolling lyrics)
 - Dark mode

## Tech Stack
 - App: React Native with Expo and native module (for MIDI support)
 - Backend:
   - API: Serverless Node.js API hosted on Vercel
   - DB: Postgres hosted on Supabase

## Related
I am working on a project for [controlling Ableton Live via JavaScript in a desktop app](https://github.com/Sejmou/ableton-controls). Beware: It is very hacky and I am still trying to figure out a smarter and more stable way to implement it.
