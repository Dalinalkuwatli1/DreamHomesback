// src/modules/favorites/favorite.repository.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const find     = (userId, propertyId) => prisma.favorite.findUnique({ where: { userId_propertyId: { userId, propertyId } } });
const create   = (userId, propertyId) => prisma.favorite.create({ data: { userId, propertyId } });
const remove   = (userId, propertyId) => prisma.favorite.delete({ where: { userId_propertyId: { userId, propertyId } } });
const findAll  = (userId) => prisma.favorite.findMany({ where: { userId }, include: { property: { include: { images: true, _count: { select: { favorites: true } } } } }, orderBy: { createdAt: 'desc' } });

module.exports = { find, create, remove, findAll };
