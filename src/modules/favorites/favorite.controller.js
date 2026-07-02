// src/modules/favorites/favorite.controller.js
const service = require('./favorite.service');
const { sendSuccess } = require('../../utils/apiResponse');

const toggle         = async (req, res) => sendSuccess(res, 200, 'Favorite toggled',  await service.toggle(req.user.id, req.params.propertyId));
const getMyFavorites = async (req, res) => sendSuccess(res, 200, 'Favorites fetched', await service.getMyFavorites(req.user.id));

module.exports = { toggle, getMyFavorites };
