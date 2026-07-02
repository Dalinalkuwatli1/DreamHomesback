// src/modules/admin/admin.repository.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDashboardStats = async () => {
  const [users, properties, messages, pendingProperties] = await Promise.all([
    prisma.user.count(),
    prisma.property.count(),
    prisma.message.count(),
    prisma.property.count({ where: { status: 'PENDING' } }),
  ]);
  return { users, properties, messages, pendingProperties };
};

const getProperties = (skip, take, where) =>
  prisma.property.findMany({ where, skip, take, orderBy: { createdAt: 'desc' }, include: { owner: { select: { id: true, name: true, email: true } }, images: { take: 1 } } });

const updatePropertyStatus = (id, status) => prisma.property.update({ where: { id }, data: { status } });

module.exports = { getDashboardStats, getProperties, updatePropertyStatus };
