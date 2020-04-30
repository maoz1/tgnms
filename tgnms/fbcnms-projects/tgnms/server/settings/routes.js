/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * @format
 * @flow
 */
const express = require('express');
const router = express.Router();
const config = require('../config');
import access from '../middleware/access';
import {getSettingsState, testSettings, updateSettings} from './settings';

router.use(access(['NMS_CONFIG_WRITE']));
router.get('/', (req, res) => {
  return res.json(getSettingsState());
});
router.post('/', (req, res) => {
  updateSettings(req.body);
  return res.json(config);
});
router.post('/test', (req, res) => {
  return testSettings(req.body).then(result => res.json(result));
});
module.exports = router;