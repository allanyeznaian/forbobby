SignShareMobile
SignShare Mobile Application Repository

get GitBash get Node get vsCode get nox player (android emulator) get expo go app for mobile device

navigate to desired directory with gitbash/cmd run following commands: npm install --global expo-cli

git clone https://github.com/chris-pangea-cds/SignShareMobile.git
make sure the cmd is in the same directory as the package.json file is

npm install
npm audit fix
to run the app: make sure the command prompt is in the same directory as package.json run following command: expo start

the browser will open to a screen with a QR code, which is how you'll run the app on your phone

to run on emulator: open nox player on the browser that opened previously click on run with android emulator







POSSIBLE ERRORS:

if you get error related to NativeAnimatedModule.startOperationBatch()
search for NativeAnimatedModule.startOperationBatch()
change the if statement to

 if (Platform.OS === 'android' && NativeAnimatedModule.startOperationBatch) {
      NativeAnimatedModule.startOperationBatch();
 }
 
 and

 if (Platform.OS === 'android' && NativeAnimatedModule.finishOperationBatch) {
      NativeAnimatedModule.finishOperationBatch();
    }