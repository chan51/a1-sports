import { CommonActions } from '@react-navigation/native';

const config: any = {};

export function setNavigator(nav: any) {
  if (nav) {
    config.navigator = nav;
  }
}

export function navigate(name: string, params?: any) {
  if (config.navigator && name) {
    let action = CommonActions.navigate({ name, params });
    config.navigator.dispatch(action);
  }
}

export function goBack() {
  if (config.navigator) {
    let action = CommonActions.goBack();
    config.navigator.dispatch(action);
  }
}

export function reset(routeName = 'Login', index = 0, params?) {
  if (config.navigator) {
    let action = CommonActions.reset({
      index,
      routes: [{ name: routeName, params }],
    });
    config.navigator.dispatch(action);
  }
}
