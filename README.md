# Youtube-Chat-in-Fullscreen
Show Youtube live chat when in fullscreen mode

### Know Issues

- Author name can not stick to one line if it is little bit long

### Fixed

- (Fixed) Several instance of `@material-ui/styles` initialized in this application
- (Fixed) The overlay still exist when the tab goes to another watch page(without refreshing)
- (Fixed) Chat list update may go to fast, not one by one(setTimeout call in forEach)

### TODO

- [x] Gradually add new chat item to the chat list
- [x] Keep chat list scroll to the bottom, at least user scroll them up
- [ ] Able to turn on/off the extension
- [ ] Drag and move the overlay
- [ ] Support live stream replay video page
- [ ] Show membership ticker and super chat
- [ ] Turn on/off the chat list overlay directly temporarily without going to options page
- [ ] Able to resize and change font size without options page
- [ ] Create an options page





