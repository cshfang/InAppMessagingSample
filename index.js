import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

import { AppRegistry } from 'react-native';
import Amplify from 'aws-amplify';

import awsconfig from './src/aws-exports';

import App from './App';
import { name as appName } from './app.json';

Amplify.configure(awsconfig);

AppRegistry.registerComponent(appName, () => App);
