# a1-sports-exchange

Start project - npm start
Dev Build project Android - npm run build-dev-android
Prod Build project Android - npm run build-prod-android
Build project Ios - expo build:ios

npm run build-android
expo publish --release-channel production

Get Android Keystore - expo fetch:android:keystore
Get Android Key Hash - expo fetch:android:hashes
Get Android Keystore Details - keytool -list -v -keystore ./c4cook-mobile-app.jks -alias QGNoYW41MS9jNGNvb2stbW9iaWxlLWFwcA== -storepass 11c842369d044040919b91bfade77760 -keypass 649931f30cc444499e28ead905363038


app.json
{
  "expo": {
    "name": "A1 Sports",
    "slug": "a1-sports-exchange-app",
    "privacy": "hidden",
    "version": "1.0.1",
    "scheme": "a1sports-exchange",
    "platforms": ["ios", "android"],
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#fff",
      "backgroundPosition": "center"
    },
    "androidStatusBar": {
      "barStyle": "light-content",
      "backgroundColor": "#000"
    },
    "updates": {
      "fallbackToCacheTimeout": 0,
      "enabled": false
    },
    "assetBundlePatterns": ["**/*"],
    "packagerOpts": {
      "sourceExts": ["js", "ts", "tsx", "jsx"]
    },
    "notification": {
      "color": "#F5AF19",
      "icon": "./assets/images/notification-icon.png"
    },
    "android": {
      "package": "com.a1sports.exchange.android",
      "versionCode": 2,
      "permissions": ["INTERNET"],
      "adaptiveIcon": {
        "backgroundImage": "./assets/images/notification-icon.png",
        "backgroundColor": "#F5AF19"
      },
      "useNextNotificationsApi": true,
      "googleServicesFile": "./google-services.json",
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [
            {
              "scheme": "http",
              "host": "*.a1sports.exchange.com",
              "pathPrefix": "/app"
            },
            {
              "scheme": "https",
              "host": "*.a1sports.exchange.com",
              "pathPrefix": "/app"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    },
    "ios": {
      "bundleIdentifier": "com.a1sports.exchange.ios",
      "buildNumber": "1.0.0",
      "supportsTablet": false,
      "googleServicesFile": "./GoogleService-Info.plist",
      "infoPlist": {
        "UIBackgroundModes": ["location", "fetch"]
      }
    },
    "web": {
      "favicon": "./assets/images/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "ae1e1d08-baf2-4b0a-80e6-24247fc1da5d"
      }
    }
  }
}
