// src/modules/properties/property.controller.js
const service = require('./property.service');
const { sendSuccess } = require('../../utils/apiResponse');

const getAll = async (req, res) => {
  const { properties, ...meta } = await service.getAll(req.query);
  sendSuccess(res, 200, 'Properties fetched', properties, meta);
};

const getById  = async (req, res) => sendSuccess(res, 200, 'Property fetched', await service.getById(parseInt(req.params.id)));
const create   = async (req, res) => sendSuccess(res, 201, 'Property created', await service.create(req.body, req.files, req.user.id));
const update   = async (req, res) => sendSuccess(res, 200, 'Property updated', await service.update(parseInt(req.params.id), req.body, req.files, req.user.id));
const remove   = async (req, res) => { await service.remove(parseInt(req.params.id), req.user.id, req.user.role); sendSuccess(res, 204, 'Property deleted'); };
const updateStatus = async (req, res) => sendSuccess(res, 200, 'Status updated', await service.updateStatus(parseInt(req.params.id), req.body.status));

module.exports = { getAll, getById, create, update, remove, updateStatus };
