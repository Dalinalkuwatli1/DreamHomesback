// src/modules/favorites/favorite.service.js
const repo = require('./favorite.repository');

const toggle = async (userId, propertyId) => {
  const pid = parseInt(propertyId);
  const existing = await repo.find(userId, pid);
  if (existing) {
    await repo.remove(userId, pid);
    return { isFavorited: false };
  }
  await repo.create(userId, pid);
  return { isFavorited: true };
};

const getMyFavorites = async (userId) => repo.findAll(userId);

module.exports = { toggle, getMyFavorites };
