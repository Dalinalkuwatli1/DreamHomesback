// src/modules/properties/property.service.js
const AppError = require('../../utils/AppError');
const repo     = require('./property.repository');
const { deleteImage } = require('../../config/cloudinary');

// ─── Build Filter/Sort/Pagination ────────────────────────────────
const buildQuery = (query) => {
  const page  = parseInt(query.page)  || 1;
  const limit = parseInt(query.limit) || 12;
  const skip  = (page - 1) * limit;

  const where = { status: 'ACTIVE' };
  if (query.type)     where.type = query.type;
  if (query.city)     where.city = { contains: query.city, mode: 'insensitive' };
  if (query.minPrice) where.price = { ...where.price, gte: parseFloat(query.minPrice) };
  if (query.maxPrice) where.price = { ...where.price, lte: parseFloat(query.maxPrice) };
  if (query.bedrooms) where.bedrooms = parseInt(query.bedrooms);
  if (query.search)   where.OR = [
    { title:       { contains: query.search, mode: 'insensitive' } },
    { description: { contains: query.search, mode: 'insensitive' } },
    { city:        { contains: query.search, mode: 'insensitive' } },
  ];

  const sortMap = {
    newest:     { createdAt: 'desc' },
    oldest:     { createdAt: 'asc' },
    price_asc:  { price: 'asc' },
    price_desc: { price: 'desc' },
  };
  const orderBy = sortMap[query.sort] || { createdAt: 'desc' };

  return { skip, limit, where, orderBy, page };
};

// ─── Get All ─────────────────────────────────────────────────────
const getAll = async (query) => {
  const { skip, limit, where, orderBy, page } = buildQuery(query);
  const [properties, total] = await Promise.all([
    repo.findAll(skip, limit, where, orderBy),
    repo.countAll(where),
  ]);
  return { properties, total, page, totalPages: Math.ceil(total / limit) };
};

// ─── Get By ID ───────────────────────────────────────────────────
const getById = async (id) => {
  const property = await repo.findById(id);
  if (!property) throw new AppError('Property not found', 404);
  return property;
};

// ─── Create ──────────────────────────────────────────────────────
const create = async (data, files, ownerId) => {
  const images = files?.map(f => ({ url: f.path, publicId: f.filename })) || [];
  return repo.create({
    ...data,
    price:    parseFloat(data.price),
    bedrooms: parseInt(data.bedrooms) || 0,
    bathrooms:parseInt(data.bathrooms) || 0,
    area:     parseFloat(data.area) || 0,
    ownerId,
    images:   { create: images },
  });
};

// ─── Update ──────────────────────────────────────────────────────
const update = async (id, data, files, userId) => {
  const property = await repo.findById(id);
  if (!property) throw new AppError('Property not found', 404);
  if (property.ownerId !== userId) throw new AppError('Not authorized to update this property', 403);

  const newImages = files?.map(f => ({ url: f.path, publicId: f.filename })) || [];
  return repo.updateById(id, {
    ...data,
    ...(newImages.length && { images: { create: newImages } }),
  });
};

// ─── Delete ──────────────────────────────────────────────────────
const remove = async (id, userId, role) => {
  const property = await repo.findById(id);
  if (!property) throw new AppError('Property not found', 404);
  if (property.ownerId !== userId && role !== 'ADMIN') throw new AppError('Not authorized', 403);

  // Delete Cloudinary images
  await Promise.all(property.images.map(img => deleteImage(img.publicId).catch(() => {})));
  await repo.deleteById(id);
};

// ─── Update Status (Admin) ───────────────────────────────────────
const updateStatus = async (id, status) => repo.updateById(id, { status });

module.exports = { getAll, getById, create, update, remove, updateStatus };
