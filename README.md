# Youtube-Chat-in-Fullscreen
Show Youtube live chat when in full screen mode

### Know Issues

- Author name can not stick to one line if it is little bit long
- Content script will inject into one Youtube page multiple times
- The container of the react app become null sometime (cant find reason right now)

### Fixed

- (Fixed) Several instance of `@material-ui/styles` initialized in content scripts (There can be multiple content script being injected into one single Youtube page)
- (Fixed) The overlay still exist when the tab goes to another watch page(without refreshing)
- (Fixed) Chat items in the list update simultaneously, not one by one(setTimeout call in forEach)
- (Fixed) When chat list reach its max size, the scrollHeight of the container may decrease, causing scroll direction detector to fail(since the current scrollTop is smaller than last scrollTop, but it still can be a scroll down action)

### TODO

- [x] Gradually add new chat item to the chat list
- [x] Keep chat list scroll to the bottom, at least user scroll them up
- [x] Create an options pages (options popup is enough)
- [x] Able to turn on/off the extension
- [ ] Drag and move the overlay
- [ ] Support live stream replay video page
- [ ] Show membership ticker and super chat
- [ ] Turn on/off the chat list overlay directly temporarily without going to options page
- [ ] Able to resize and change font size without options page









