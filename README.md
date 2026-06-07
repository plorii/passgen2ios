# PassGen2 - iOS
**PassGen2iOS** is a mobile version of [PassGen2](https://github.com/plorii/passgen2) developed for iOS.


## Build it yourself:
You are able to build a version of the App yourself

### Requirements
- macOS (tested with macOS Sonoma)
- Xcode (Older Versions [here](https://xcodereleases.com/))
- [Node.js](https://nodejs.org/en/download/)
- git (you can also manualy download the repo)

### Build
1. Clone the Repository
```bash
git clone https://github.com/plorii/passgen2ios
```
2. Install it's dependencies
```bash
cd ./passgen2ios/artifacts/passgen2/
npm install
```

3. Build the prebuild
```bash
npx expo prebuild --platform ios
```

4. Open it in Xcode
```bash
open ./ios/PassGen2.xcodeproj
```
