// src/modules/properties/property.repository.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const propertyInclude = {
  images:  true,
  owner:   { select: { id: true, name: true, email: true, phone: true, avatar: true } },
  _count:  { select: { favorites: true, reviews: true } },
};

const findAll = (skip, take, where, orderBy) =>
  prisma.property.findMany({ where, skip, take, orderBy, include: propertyInclude });

const countAll   = (where)       => prisma.property.count({ where });
const findById   = (id)          => prisma.property.findUnique({ where: { id }, include: propertyInclude });
const create     = (data)        => prisma.property.create({ data, include: propertyInclude });
const updateById = (id, data)    => prisma.property.update({ where: { id }, data, include: propertyInclude });
const deleteById = (id)          => prisma.property.delete({ where: { id } });

module.exports = { findAll, countAll, findById, create, updateById, deleteById };
