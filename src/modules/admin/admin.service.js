// src/modules/admin/admin.service.js
const repo     = require('./admin.repository');
const userRepo = require('../users/user.repository');
const propRepo = require('../properties/property.repository');

const getDashboardStats = () => repo.getDashboardStats();

const getUsers = async (query) => {
  const page  = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip  = (page - 1) * limit;
  const where = query.search
    ? { OR: [{ name: { contains: query.search } }, { email: { contains: query.search } }] }
    : {};
  const [users, total] = await Promise.all([userRepo.findAll(skip, limit, where), userRepo.countAll(where)]);
  return { users, total, page, totalPages: Math.ceil(total / limit) };
};

const getProperties = async (query) => {
  const page  = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip  = (page - 1) * limit;
  const where = query.status ? { status: query.status } : {};
  const [properties, total] = await Promise.all([repo.getProperties(skip, limit, where), propRepo.countAll(where)]);
  return { properties, total, page, totalPages: Math.ceil(total / limit) };
};

const approveProperty = (id) => repo.updatePropertyStatus(id, 'ACTIVE');
const rejectProperty  = (id) => repo.updatePropertyStatus(id, 'REJECTED');
const getReports      = ()   => ({ message: 'Reports endpoint — connect analytics here' });
const getLogs         = ()   => ({ message: 'Logs endpoint — connect Winston/Morgan logs here' });

module.exports = { getDashboardStats, getUsers, getProperties, approveProperty, rejectProperty, getReports, getLogs };
