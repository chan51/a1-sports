# a1-sports

Start project - npm start
Build project Android - expo build:android
Build project Ios - expo build:ios

npm run build-android
expo publish --release-channel production

Get Android Keystore - expo fetch:android:keystore
Get Android Key Hash - expo fetch:android:hashes
Get Android Keystore Details - keytool -list -v -keystore ./c4cook-mobile-app.jks -alias QGNoYW41MS9jNGNvb2stbW9iaWxlLWFwcA== -storepass 11c842369d044040919b91bfade77760 -keypass 649931f30cc444499e28ead905363038
