function logAuditEvent({ actorId, actorRole, action, entityType, entityId, metadata }) {
  const record = {
    timestamp: new Date().toISOString(),
    actorId: actorId || null,
    actorRole: actorRole || null,
    action,
    entityType: entityType || null,
    entityId: entityId || null,
    metadata: metadata || null,
  };

  console.log('[audit]', JSON.stringify(record));
}

module.exports = { logAuditEvent };
