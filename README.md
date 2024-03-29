# Youtube-Chat-in-Fullscreen

A chrome extension creates an overlay to show Youtube live chat when in full screen

<a href="https://chrome.google.com/webstore/detail/youtube-chat-in-fullscree/kmhclnjhlejdjlkgeebolkigafpaijkp"><img width='250' src="./images/ChromeWebStore_Badge_v2_496x150.png"/></a>

## Key Features

-   Show a live chat overlay when you are watching Youtube live stream in full screen
-   Also support video pages with chat replay
-   You can adjust position, opacity, size, and font size of the overlay as you wish

## Usages

-   Use `Ctrl+Shift+y` to toggle overlay
-   Press and hold `Ctrl+Alt`, then drag to move the position of overlay

## Known issue

If you have any issues and suggestions please feel free to create a issue, or join the discord sever https://discord.gg/RJGpyC98Ss

## Update

v1.0.0.2

-   Able to stop auto scroll down by scroll up
-   Much clear instructions on settings panel
-   Settings of overlay do not sync between device any more (prevent settings conflict)

v1.0.0.3 `4-Oct-2020`

-   Fixed auto scroll bug

v1.0.0.4 `7-Oct-2020`

-   Fixed unpredictable resizing issue
-   scroll to bottom when re-enter full screen mode (If auto scroll is still enable)

v1.0.0.5 `8-Oct-2020`

-   Fixed auto scroll bugs when re-enter full screen mode

v1.0.0.6 `12-Oct-2020`

-   Fixed the authentication request issue when using brand account
-   Fixed the problem that the chat overlay is still showing unrelated chat and visible when navigate video page

v1.0.0.7 `23-Oct-2020`

-   Show initial chat records in chat box
-   Fixed the freezing issue when go from a live streaming page to a normal video page
-   Less annoying little tool bar

v1.0.0.8 `25-Oct-2020`

-   Add some usage tips to pop up settings
-   Initial chat records of live stream will show instantly without waiting

v1.0.0.9 `4-Nov-2020`

-   Fixed the duplicate chat actions in chat queue

v1.0.0.10 `3-Jan-2021`

-   Fixed the issue that clicking drag button without moving it will causing overlay to crash
-   Do not need to give permission to access browser history
-   Hide overlay when original chat box is collapsed

v1.0.0.11 `14-Jan-2021`

-   Highlight the moderator
-   Able to change the background color of overlay and color of font
-   Able to adjust the opacity of super chat

v1.0.0.12 `19-Jan-2021`

-   Able to filter chat by type
-   Able to separate username and comment into two line
-   Fixed the crashing issue caused by empty user name

v1.0.0.13 `26-Jan-2021`

-   Native chat in beta
-   Verified user is highlight as the same as owner
-   Fixed the color of member name

v2.0

-   New Overlay UI
    -   Much intuitive resizing method
    -   Do not have annoying toolbar to block the content
-   Chat filter for each video page
-   Added Super Sticker Support
-   Fixed shortcut issue by change shortcut to ctrl+shift+y

v2.0.1 `2-May-2021`

-   Auto hide toolbar

v2.0.2 `26-Aug-2021`

-   Fixed bug the emoji url of message causing overlay to crash

v2.0.3 `28-Sept-2021`

-   Fixed Live Chat Membership Card

## Screenshot

_Chat overlay on Youtube Live Replay_

![Chat overlay screenshot](./images/v2.0-2.png)

_Chat overlay on Youtube Live_

![Chat overlay screenshot](./images/v2.0c.png)

_Settings Panel_

![settings panel screenshot](./images/v2.0-4.png)

## Credits

Native Chat Selector: [fiahfy/youtube-live-chat-selector](https://github.com/fiahfy/youtube-live-chat-selector)

## License

<a href="/LICENSE">GNU General Public License v3.0</a>
