import { eventChannel } from 'redux-saga';
import { PermissionsAndroid } from 'react-native';
import { EventEmitter } from 'events';
import { call, put, take } from 'redux-saga/effects';
import FixtureApi from '../../App/Services/FixtureApi';

import {
  observePhone,
  registerPhone,
  requestPermissions,
  dialPhone
} from './PhoneSagas';

import {
  updateRegistration,
  updatePermissions,
  updateCall
} from '../Redux/Phone';

const address = 'meatloaf';
const localView = 'localView';
const remoteView = 'remoteView';

test('registerPhone', () => {
  const saga = registerPhone(FixtureApi);

  expect(saga.next().value).toEqual(
    put(updateRegistration({ loading: true, complete: false }))
  );

  expect(saga.next().value).toEqual(call(FixtureApi.registerPhone));

  expect(saga.next().value).toEqual(
    put(updateRegistration({ loading: false, complete: true }))
  );
});

test('registerPhone failure', () => {
  const saga = registerPhone(FixtureApi);

  saga.next();
  saga.next();

  expect(saga.throw(new Error('my error')).value).toEqual(
    put(updateRegistration({ loading: false, complete: false }))
  );

  expect(saga.next().done).toBeTruthy();
});

test('requestPermissions', () => {
  const saga = requestPermissions(FixtureApi);

  expect(saga.next().value).toEqual(
    call(FixtureApi.requestPermission, PermissionsAndroid.PERMISSIONS.CAMERA)
  );

  expect(saga.next().value).toEqual(
    call(
      FixtureApi.requestPermission,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    )
  );

  expect(saga.next().value).toEqual(put(updatePermissions(true)));
});

test('requestPermissions failure', () => {
  const saga = requestPermissions(FixtureApi);
  saga.next();

  expect(saga.throw(new Error('no cameras')).value).toEqual(
    put(updatePermissions(false))
  );
});

test('dialPhone', () => {
  const saga = dialPhone(FixtureApi, {
    payload: { address, localView, remoteView }
  });

  expect(saga.next().value).toEqual(
    put(updateCall({ outgoing: true, connected: false }))
  );

  expect(saga.next().value).toEqual(
    call(FixtureApi.dialPhone, { address, localView, remoteView })
  );
});

test('dialPhone failure', () => {
  const saga = dialPhone(FixtureApi, {
    payload: { address, localView, remoteView }
  });

  saga.next();
  saga.next();

  expect(saga.throw(new Error('Whoops!')).value).toEqual(
    put(updateCall({ outgoing: false, connected: false }))
  );
});

test('observePhone', () => {
  const saga = observePhone(FixtureApi);

  const channel = eventChannel(_emit => {
    return () => null;
  });

  expect(saga.next().value).toMatchObject({
    CALL: { args: [] }
  });

  expect(saga.next(channel).value).toEqual(take(channel));

  expect(saga.next({ type: 'phone:connected' }).value).toEqual(
    put(updateCall({ outgoing: false, connected: true }))
  );

  expect(saga.next(channel).value).toEqual(take(channel));

  expect(saga.next({ type: 'phone:disconnected' }).value).toEqual(
    put(updateCall({ outgoing: false, connected: false }))
  );

  saga.return(); // this generator contains a while loop. abort it.
});
