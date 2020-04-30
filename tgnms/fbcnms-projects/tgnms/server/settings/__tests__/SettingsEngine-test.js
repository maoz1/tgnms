/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @format
 * @flow
 */

import SettingsEngine, {logger as settingsLogger} from '../SettingsEngine';

import type {EnvMap} from '../../../shared/dto/Settings';
import type {JestMockFn} from 'jest';

const EventEmitter = require('events');
const fsMock: JestMockFn = require('fs');

let emitter: EventEmitter;
let signalMock: JestMockFn<*, *>;
let killMock: JestMockFn<*, *>;
jest.mock('fs', () => new (require('memfs').Volume)());
jest.spyOn(fsMock, 'writeFileSync');
const OLD_ENV = process.env;
beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  fsMock.mkdirSync('.', {recursive: true});
  process.env = {...OLD_ENV, NMS_SETTINGS_ENABLED: 'true'};
  writeSettingsFile('{}');
  delete process.env.NODE_ENV;
  emitter = new EventEmitter();
  signalMock = jest
    .spyOn(process, 'once')
    .mockImplementation((...args) => emitter.once(...args));
  killMock = jest.spyOn(process, 'kill').mockImplementation(() => {});
});
afterEach(() => {
  fsMock.reset();
  process.env = OLD_ENV;
  jest.clearAllMocks();
  jest.resetModules();
});

describe('Settings Engine', () => {
  const TEST_SETTINGS = [
    {
      key: 'PORT',
      required: true,
      dataType: 'INT',
      defaultValue: 8080,
      requiresRestart: true,
    },
    {
      key: 'API_REQUEST_TIMEOUT',
      required: false,
      dataType: 'INT',
      defaultValue: 5000,
      requiresRestart: false,
    },
    {
      key: 'LOG_LEVEL',
      required: false,
      dataType: 'STRING',
      defaultValue: 'info',
      requiresRestart: true,
    },
    {
      key: 'MYSQL_DB',
      required: true,
      dataType: 'STRING',
      defaultValue: '',
      requiresRestart: true,
    },
    {
      key: 'MYSQL_HOST',
      required: true,
      dataType: 'STRING',
      defaultValue: '',
      requiresRestart: true,
    },
    {
      key: 'MYSQL_PASS',
      required: true,
      dataType: 'SECRET_STRING',
      defaultValue: '',
      requiresRestart: true,
    },
    {
      key: 'MYSQL_PORT',
      required: true,
      dataType: 'STRING',
      defaultValue: '',
      requiresRestart: true,
    },
    {
      key: 'MYSQL_USER',
      required: true,
      dataType: 'STRING',
      defaultValue: '',
      requiresRestart: true,
    },

    {
      key: 'LOGIN_ENABLED',
      required: true,
      dataType: 'STRING',
      defaultValue: 'info',
      requiresRestart: true,
    },
  ];
  let settings: SettingsEngine;

  beforeEach(() => {
    settings = new SettingsEngine();
  });
  describe('configure', () => {
    test('reads settings from .env file using dotenv', () => {
      const processEnvBefore = {...process.env};
      writeEnvFile(`API_REQUEST_TIMEOUT=1000`);
      expect(processEnvBefore['API_REQUEST_TIMEOUT']).toBe(undefined);
      settings.initialize(TEST_SETTINGS);
      const processEnvAfter = {...process.env};
      expect(processEnvAfter['API_REQUEST_TIMEOUT']).toBe('1000');
    });
    test('settings from .env file do not overwrite existing env vars', () => {
      process.env['DONOTOVERWRITE'] = 'expected-value';
      const processEnvBefore = {...process.env};
      writeEnvFile(
        `API_REQUEST_TIMEOUT=value
      DONOTOVERWRITE=overwritten, fail!`,
      );
      expect(processEnvBefore['DONOTOVERWRITE']).toBe('expected-value');
      settings.initialize(TEST_SETTINGS);
      const processEnvAfter = {...process.env};
      expect(processEnvAfter['DONOTOVERWRITE']).toBe('expected-value');
    });
    test('settings from settings file do not overwrite existing env vars', () => {
      process.env['DONOTOVERWRITE'] = 'expected-value';
      const processEnvBefore = {...process.env};
      writeSettingsFile(
        `{
        "API_REQUEST_TIMEOUT":"value",
        "DONOTOVERWRITE":"overwritten, fail!"
      }`,
      );
      expect(processEnvBefore['DONOTOVERWRITE']).toBe('expected-value');
      settings.initialize(TEST_SETTINGS);
      const processEnvAfter = {...process.env};
      expect(processEnvAfter['DONOTOVERWRITE']).toBe('expected-value');
    });
    test('DISABLE_ENV_FILE disables loading from the env file', () => {
      const warnLogSpy = jest
        .spyOn(settingsLogger, 'warn')
        .mockImplementation(() => {});
      process.env['DISABLE_ENV_FILE'] = '';
      const processEnvBefore = {...process.env};
      writeEnvFile(`FAIL_IF_EXISTS=failure`);
      expect(processEnvBefore['FAIL_IF_EXISTS']).toBe(undefined);
      settings.initialize(TEST_SETTINGS);
      const processEnvAfter = {...process.env};
      expect(processEnvAfter['FAIL_IF_EXISTS']).toBe(undefined);
      expect(warnLogSpy).toHaveBeenCalled();
    });
    test('NMS_SETTINGS_ENABLED=false disables loading from the settings file', () => {
      process.env['NMS_SETTINGS_ENABLED'] = 'false';
      const processEnvBefore = {...process.env};
      writeSettingsFile(`{"LOG_LEVEL":"failure"}`);
      expect(processEnvBefore['LOG_LEVEL']).toBe(undefined);
      settings.initialize(TEST_SETTINGS);
      const processEnvAfter = {...process.env};
      expect(processEnvAfter['LOG_LEVEL']).toBe(undefined);
    });
    test('values from .env file are loaded into process.env', () => {
      writeEnvFile(`
    API_REQUEST_TIMEOUT=1000
    UNREGISTERED_KEY=unregistered
    `);
      settings.initialize(TEST_SETTINGS);
      const processEnvAfter = {...process.env};
      expect(processEnvAfter['API_REQUEST_TIMEOUT']).toBe('1000');
      expect(processEnvAfter['UNREGISTERED_KEY']).toBe('unregistered');
    });
    test('invalid settings file logs error and continues', () => {
      const errorLogSpy = jest
        .spyOn(settingsLogger, 'error')
        .mockImplementation(() => {});
      writeSettingsFile(`{"SHOULDNOTEXIST":"SHOULDNOTEXIST", bad json...}`);
      expect(errorLogSpy).not.toHaveBeenCalled();
      settings.initialize(TEST_SETTINGS);
      expect(process.env['SHOULDNOTEXIST']).toBe(undefined);
      expect(errorLogSpy).toHaveBeenCalled();
    });
    test('invalid settings file does not affect settings from env file', () => {
      writeSettingsFile(`{"SHOULDNOTEXIST":"SHOULDNOTEXIST", bad json...}`);
      settings.initialize(TEST_SETTINGS);
      expect(process.env['SHOULDNOTEXIST']).toBe(undefined);
    });
    test('values from settings file are loaded into process.env', () => {
      const processEnvBefore = {...process.env};
      writeSettingsFile(`{"PORT":"8081"}`);
      expect(processEnvBefore.PORT).toBe(undefined);
      settings.initialize(TEST_SETTINGS);
      const processEnvAfter = {...process.env};
      expect(processEnvAfter.PORT).toBe('8081');
    });
    test('values from the settings file overwrite values from .env file', () => {
      const processEnvBefore = {...process.env};
      writeSettingsFile(`{"PORT":"SETTINGS_VAL"}`);
      writeEnvFile(`PORT=ENV_VAL`);
      expect(processEnvBefore.PORT).toBe(undefined);
      settings.initialize(TEST_SETTINGS);
      const processEnvAfter = {...process.env};
      expect(processEnvAfter.PORT).toBe('SETTINGS_VAL');
    });
    test('logs error if settings file is specified but not found at startup', () => {
      const errorLogSpy = jest
        .spyOn(settingsLogger, 'error')
        .mockImplementation(() => {});
      fsMock.unlinkSync('settings.json');
      expect(fsMock.existsSync('settings.json')).toBe(false);
      expect(errorLogSpy).not.toHaveBeenCalled();
      settings.initialize(TEST_SETTINGS);
      expect(errorLogSpy).toHaveBeenCalled();
    });
    test('sets settingsState properly', () => {
      writeSettingsFile(`{"PORT":"8080","API_REQUEST_TIMEOUT":"5000"}`);
      writeEnvFile(`PORT=8081
      API_REQUEST_TIMEOUT=100`);
      settings.initialize(TEST_SETTINGS);
      expect(settings.state).toMatchObject({
        current: {
          PORT: '8080',
          API_REQUEST_TIMEOUT: '5000',
        },
        registeredSettings: {
          PORT: {
            key: 'PORT',
            required: true,
            dataType: 'INT',
            defaultValue: 8080,
          },
        },
        envMaps: {
          initialEnv: {},
          dotenvEnv: {
            PORT: '8081',
            API_REQUEST_TIMEOUT: '100',
          },
          settingsFileEnv: {
            PORT: '8080',
            API_REQUEST_TIMEOUT: '5000',
          },
        },
      });
    });
    test('settingsState is frozen', () => {
      writeSettingsFile(`{"PORT":"8080","API_REQUEST_TIMEOUT":"5000"}`);
      settings.initialize(TEST_SETTINGS);
      expect(() => {
        const state = settings.state;
        state.current = {};
      }).toThrow();
    });
  });

  describe('updateSettings', () => {
    beforeEach(() => {
      writeSettingsFile(
        `{"PORT":"8080","API_REQUEST_TIMEOUT":"5000","MYSQL_PORT":"3000"}`,
      );
      writeEnvFile(`{"LOGIN_ENABLED":"true"}`);
    });

    test('updates the current settings state', () => {
      const _envBefore = {...process.env};
      settings.initialize(TEST_SETTINGS);
      const _envConfigure = {...process.env};
      expect(settings.state).toMatchObject({
        current: {
          PORT: '8080',
          API_REQUEST_TIMEOUT: '5000',
          MYSQL_PORT: '3000',
        },
      });
      settings.update({
        PORT: '8085',
      });
      const newSettingsState = settings.state;
      expect(newSettingsState.current.PORT).toBe('8085');
      expect(newSettingsState.envMaps.settingsFileEnv.PORT).toBe('8085');
    });
    test('updates process.env', () => {
      const envBefore = {...process.env};
      expect(envBefore.PORT).toBe(undefined);
      settings.initialize(TEST_SETTINGS);
      settings.update({
        PORT: '8085',
      });
      const envUpdated = {...process.env};
      expect(envUpdated.PORT).toBe('8085');
    });
    test('writes to configured settings json file', () => {
      settings.initialize(TEST_SETTINGS);
      settings.update({
        MYSQL_PORT: '3390',
      });
      const fileContents = fsMock.readFileSync('settings.json');
      expect(fileContents).toBeInstanceOf(Buffer);
      expect(JSON.parse(fileContents.toString())).toEqual({
        MYSQL_PORT: '3390',
        API_REQUEST_TIMEOUT: '5000',
        PORT: '8080',
      });
    });
    test('does not overwrite env vars which came from the CLI environment', () => {
      process.env.MYSQL_USER = 'no-overwrite';
      settings.initialize(TEST_SETTINGS);

      settings.update({
        MYSQL_USER: 'updated',
      });
      const envUpdated = {...process.env};
      expect(envUpdated.MYSQL_USER).toBe('no-overwrite');
    });
    test('overwrites env vars which came from .env', () => {
      writeEnvFile('LOGIN_ENABLED=overwrite');
      settings.initialize(TEST_SETTINGS);
      settings.update({
        LOGIN_ENABLED: 'true',
      });
      const envUpdated = {...process.env};
      expect(envUpdated.LOGIN_ENABLED).toBe('true');
    });
    test('overwrites env vars which came from settings json file', () => {
      settings.initialize(TEST_SETTINGS);
      settings.update({
        MYSQL_USER: 'updated',
      });
      const envUpdated = {...process.env};
      expect(envUpdated.MYSQL_USER).toBe('updated');
    });
    test('if any updated settings require restart, the NMS is restarted', () => {
      settings.initialize(TEST_SETTINGS);
      expect(killMock).not.toHaveBeenCalled();
      settings.update({
        MYSQL_USER: 'updated',
      });
      jest.runAllTimers();
      expect(killMock).toHaveBeenCalled();
    });
    test('if no updated settings require restart, no restart occurs', () => {
      settings.initialize(TEST_SETTINGS);
      expect(killMock).not.toHaveBeenCalled();
      expect(killMock).not.toHaveBeenCalled();
      settings.update({
        API_REQUEST_TIMEOUT: '2000',
      });
      jest.runAllTimers();
      expect(killMock).not.toHaveBeenCalled();
      expect(killMock).not.toHaveBeenCalled();
    });
    test('creates settings file if it does not already exist', () => {
      fsMock.unlinkSync('settings.json');
      expect(fsMock.existsSync('settings.json')).toBe(false);
      settings.initialize(TEST_SETTINGS);
      settings.update({
        API_REQUEST_TIMEOUT: '2000',
      });
      expect(fsMock.existsSync('settings.json')).toBe(true);
    });
    test('creates settings directory path if it does not exist', () => {
      const newpath = 'new/settings/path/settings.json';
      fsMock.unlinkSync('settings.json');
      expect(fsMock.existsSync('settings.json')).toBe(false);
      expect(fsMock.existsSync(newpath)).toBe(false);
      process.env['NMS_SETTINGS_FILE'] = newpath;
      settings.initialize(TEST_SETTINGS);
      settings.update({
        API_REQUEST_TIMEOUT: '2000',
      });
      expect(fsMock.existsSync(newpath)).toBe(true);
    });
    test('only writes settings which are different from existing environment', () => {
      // overwrite settings file to prevent merge
      writeSettingsFile('{}');
      settings.initialize(TEST_SETTINGS);
      settings.update({
        MYSQL_USER: 'test',
      });
      const fileData = JSON.parse(
        fsMock.readFileSync('settings.json', {encoding: 'utf8'}).toString(),
      );
      expect(fileData).toMatchObject({
        MYSQL_USER: 'test',
      });
    });
  });

  describe('helpers', () => {
    describe('_makeSettingsMap', () => {
      test('logs errors and overwrites duplicate keys', () => {
        const errorLogSpy = jest
          .spyOn(settingsLogger, 'error')
          .mockImplementation(() => {});
        expect(errorLogSpy).not.toHaveBeenCalled();
        const settingsMap = settings._makeSettingsMap([
          {
            key: 'PORT',
            required: true,
            dataType: 'INT',
            defaultValue: 8080,
          },
          {
            key: 'PORT',
            required: true,
            dataType: 'STRING',
            defaultValue: '',
          },
        ]);
        expect(settingsMap).toEqual({
          PORT: {
            key: 'PORT',
            required: true,
            dataType: 'STRING',
            defaultValue: '',
          },
        });
        expect(errorLogSpy).toHaveBeenCalled();
      });
    });
    describe('merge settings', () => {
      test('last settings arg is highest precedence', () => {
        const envFile: EnvMap = {
          KEY1: 'VAL1',
          KEY2: 'VAL2',
          KEY3: 'VAL3',
        };
        const cliArg: EnvMap = {
          KEY1: 'VAL1-cli',
        };
        expect(
          settings._mergeKeys([envFile, cliArg], ['KEY1', 'KEY2', 'KEY3']),
        ).toEqual({
          KEY1: 'VAL1-cli',
          KEY2: 'VAL2',
          KEY3: 'VAL3',
        });
      });
      test('only registered settings are copied out', () => {
        const envFile: EnvMap = {
          KEY1: 'VAL1',
          KEY2: 'VAL2',
          UNKNOWNKEY: 'UNKNOWNVAL',
        };
        const cliArg: EnvMap = {
          KEY1: 'VAL1-cli',
        };
        expect(
          settings._mergeKeys([envFile, cliArg], ['KEY1', 'KEY2']),
        ).toEqual({
          KEY1: 'VAL1-cli',
          KEY2: 'VAL2',
        });
      });
    });
  });

  describe('restart', () => {
    test(
      'if NMS receives the SIGUSR2 signal, it is being hosted by nodemon ' +
        'and should restart using a signal',
      () => {
        expect(signalMock).not.toHaveBeenCalled();
        expect(killMock).not.toHaveBeenCalled();
        const restarter = settings._createRestartHandler();
        expect(signalMock).toHaveBeenCalled();
        expect(killMock).not.toHaveBeenCalled();
        restarter.restart();
        emitter.emit('SIGUSR2');
        jest.runAllTimers();
        expect(signalMock).toHaveBeenCalled();
        expect(killMock).toHaveBeenCalled();
      },
    );
    test(
      'if NMS fails to receive SIGUSR2 signal, it is running without nodemon' +
        'and must restart itself',
      () => {
        expect(signalMock).not.toHaveBeenCalled();
        expect(killMock).not.toHaveBeenCalled();
        expect(killMock).not.toHaveBeenCalled();
        const restarter = settings._createRestartHandler();
        expect(signalMock).toHaveBeenCalled();
        expect(killMock).not.toHaveBeenCalled();
        expect(killMock).not.toHaveBeenCalled();
        restarter.restart();
        jest.runAllTimers();
        expect(killMock).toHaveBeenCalled();
      },
    );
  });
});

function writeEnvFile(fileData: string) {
  return fsMock.writeFileSync('.env', fileData, {encoding: 'utf8'});
}

function writeSettingsFile(fileData: string) {
  return fsMock.writeFileSync('settings.json', fileData, {encoding: 'utf8'});
}