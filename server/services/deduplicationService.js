/**
 * AI RESCUEFLOW SHADOW — Deduplication Service
 * Ensures each incident notifies each recipient only once.
 * Tracks recipient, incident, retryCount, lastAttempt, and status.
 * 
 * DISCLAIMER: SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED
 */

class DeduplicationService {
  constructor() {
    // Map key format: `${incidentId}::${recipientKey}`
    this.records = new Map();
  }

  _getKey(incidentId, recipient) {
    const rKey = typeof recipient === 'object' && recipient !== null
      ? (recipient.id || recipient.phone || recipient.email || recipient.name || JSON.stringify(recipient))
      : String(recipient);
    return `${String(incidentId)}::${rKey}`;
  }

  /**
   * Check if a recipient can be notified for a given incident.
   * Returns true if recipient has not been notified yet for this incident.
   */
  canNotify(incidentId, recipient) {
    const key = this._getKey(incidentId, recipient);
    const record = this.records.get(key);
    if (!record) return true;
    return record.status !== 'DISPATCHED';
  }

  /**
   * Records an attempt to notify a recipient for an incident.
   * If already notified, increments retryCount and flags as SKIPPED_DUPLICATE.
   */
  recordAttempt(incidentId, recipient, intendedStatus = 'DISPATCHED') {
    const key = this._getKey(incidentId, recipient);
    const existing = this.records.get(key);
    const now = new Date().toISOString();

    const recipientIdentifier = typeof recipient === 'object' && recipient !== null
      ? (recipient.id || recipient.phone || recipient.email || recipient.name)
      : String(recipient);

    if (existing) {
      existing.retryCount += 1;
      existing.lastAttempt = now;
      existing.status = 'SKIPPED_DUPLICATE';
      return {
        allowed: false,
        isDuplicate: true,
        record: { ...existing }
      };
    }

    const newRecord = {
      recipient: recipientIdentifier,
      incident: String(incidentId),
      retryCount: 1,
      lastAttempt: now,
      status: intendedStatus
    };

    this.records.set(key, newRecord);
    return {
      allowed: true,
      isDuplicate: false,
      record: { ...newRecord }
    };
  }

  /**
   * Filters a list of recipients for an incident, returning only those that can be notified,
   * and automatically records the dispatch attempt.
   */
  filterAndRecordRecipients(incidentId, recipients) {
    const accepted = [];
    const duplicates = [];

    for (const r of recipients) {
      const result = this.recordAttempt(incidentId, r, 'DISPATCHED');
      if (result.allowed) {
        accepted.push({ recipient: r, record: result.record });
      } else {
        duplicates.push({ recipient: r, record: result.record });
      }
    }

    return { accepted, duplicates };
  }

  /**
   * Retrieves all records associated with a specific incident ID.
   */
  getIncidentRecords(incidentId) {
    const results = [];
    const prefix = `${String(incidentId)}::`;
    for (const [key, record] of this.records.entries()) {
      if (key.startsWith(prefix)) {
        results.push({ ...record });
      }
    }
    return results;
  }

  /**
   * Clears records for a specific incident or all records if no ID provided.
   */
  clearRecords(incidentId = null) {
    if (!incidentId) {
      this.records.clear();
      return;
    }
    const prefix = `${String(incidentId)}::`;
    for (const key of this.records.keys()) {
      if (key.startsWith(prefix)) {
        this.records.delete(key);
      }
    }
  }
}

export const deduplicationService = new DeduplicationService();
export default deduplicationService;
