![](https://i.postimg.cc/jqpN9c26/mistwxscanv2banner.png)

------------

**Weatherscan v2** is a simulated recreation of "Weatherscan" by The Weather Channel in HTML/CSS/JS, by ***mist weather media***

Online demo: [v2.weatherscan.net](https://v2.weatherscan.net)

© Mist Weather Media 2026.

------------

**Special thanks to these talented minds who made this project possible!**

**Joe Molinelli (TheGoldDiamond9)** - Lead Developer  
**COLSTER** - Developer  
**JensonWX** - Developer  
**Miceoroni** - Map Developer  
**zachNet** - README

and the rest of the Mist Creative Team for their support!

------------

Need support beyond the scope of this README? A guide for configuring this simulator will come soon. In the meantime, feel free to join our Discord for support!

[***mist weather media*** on Discord](https://discord.gg/hV2w5sZQxz)

# Initial Setup (Source code)

1. Install [Bun](https://bun.sh/docs/installation) (fast all-in-one JavaScript runtime & package manager).
2. Acquire *weather.com*, *mapbox.com*, *developer.tomtom*, and *HERE.com* API keys. These are required for weather data, radar frames, and traffic, respectively.
3. Go to `/main/configs` and open `yourConfig.json`.
4. Line 4 is where your *weather.com* API key goes. Replace `"YOUR_API_KEY"` with your *weather.com* API key.
5. Line 5 is where your *mapbox.com* API key goes. Replace `"YOUR_API_KEY"` with your *mapbox.com* API key.
6. Line 6 is where your *developer.tomtom.com* API key goes. Replace `"YOUR_API_KEY"` with your *developer.tomtom.com* API key. (optional, only if you want traffic report)
7. Line 7 is where your *HERE.com* API key goes. Replace `"YOUR_API_KEY"` with your *HERE.com* API key. (optional, only if you want traffic flow)
8. Save your changes to `yourConfig.json` and close it.
9. In your terminal within the project directory, run `bun install`. (This project has no external dependencies thanks to Bun, but this step creates the lockfile and prepares scripts.)
10. Run the simulator with:
    ```bash
    bun run start
    ```
    Or simply:
    ```bash
    bun app.js
    ```
    For development with auto-reload on file changes:
    ```bash
    bun run dev
    ```

> **Note:** This project has been adapted to run natively on Bun using its built-in high-performance HTTP server. No more `node_modules` bloat or slow startup!

------------

Enjoy the nostalgia! You're all set.

Many thanks for using our simulator! We hope you like it.
