import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Save, XCircle, Calendar, CheckCircle, Ticket } from 'lucide-react';

const EMPTY_FORM = { title: '', date: '', total_tickets: '' };

export default function AdminDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/events');
      setEvents(data);
    } catch {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const showMsg = (msg, isError = false) => {
    if (isError) { setError(msg); setSuccess(''); }
    else { setSuccess(msg); setError(''); }
    setTimeout(() => { setSuccess(''); setError(''); }, 3500);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        await api.put(`/events/${editId}`, form);
        showMsg('Event updated successfully ✓');
      } else {
        await api.post('/events', form);
        showMsg('Event created successfully ✓');
      }
      setForm(EMPTY_FORM);
      setEditId(null);
      fetchEvents();
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to save event', true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (event) => {
    setEditId(event.id);
    setForm({ title: event.title, date: event.date, total_tickets: event.total_tickets });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/events/${id}`);
      showMsg('Event deleted');
      setConfirmDelete(null);
      fetchEvents();
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to delete', true);
    } finally {
      setDeletingId(null);
    }
  };

  const totalTickets = events.reduce((s, e) => s + e.total_tickets, 0);
  const bookedTickets = events.reduce((s, e) => s + (e.total_tickets - e.available_tickets), 0);
  const soldOutCount = events.filter((e) => e.available_tickets === 0).length;

  return (
    <div className="container">
      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">🗑️</div>
            <div className="modal-title">Delete Event?</div>
            <div className="modal-text">
              Are you sure you want to delete <strong>"{confirmDelete.title}"</strong>? This action cannot be undone.
            </div>
            <div className="modal-actions">
              <button id="cancel-delete" className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button
                id="confirm-delete"
                className="btn btn-danger"
                onClick={() => handleDelete(confirmDelete.id)}
                disabled={deletingId === confirmDelete.id}
              >
                <Trash2 size={14} />
                {deletingId === confirmDelete.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="page-header">
        <h1 className="page-title">Admin <span>Dashboard</span></h1>
        <p className="page-subtitle">Manage all events and track ticket sales</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Total Events</div>
          <div className="stat-value accent">{events.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Tickets</div>
          <div className="stat-value">{totalTickets}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Booked</div>
          <div className="stat-value success">{bookedTickets}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Sold Out</div>
          <div className="stat-value warning">{soldOutCount}</div>
        </div>
      </div>

      <div className="admin-layout">
        {/* Create / Edit Form */}
        <div className="card admin-form-card">
          <div className="card-header">
            <h2 className="admin-form-title">
              {editId ? <><Edit2 size={18} /> Edit Event</> : <><Plus size={18} /> New Event</>}
            </h2>
          </div>
          <div className="card-body">
            {success && <div className="alert alert-success"><CheckCircle size={15}/> {success}</div>}
            {error && <div className="alert alert-error"><XCircle size={15}/> {error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Event Title</label>
                <input id="event-title" name="title" className="form-control" placeholder="e.g. Tech Summit 2024" value={form.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Event Date</label>
                <input id="event-date" name="date" type="date" className="form-control" value={form.date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Total Tickets</label>
                <input id="event-tickets" name="total_tickets" type="number" min="1" className="form-control" placeholder="e.g. 200" value={form.total_tickets} onChange={handleChange} required />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button id="save-event" type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
                  <Save size={14} />
                  {submitting ? 'Saving...' : editId ? 'Update Event' : 'Create Event'}
                </button>
                {editId && (
                  <button type="button" id="cancel-edit" className="btn btn-ghost" onClick={handleCancel}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Events Table */}
        <div className="card">
          <div className="card-header">
            <h2 className="admin-form-title"><Ticket size={18} /> All Events</h2>
          </div>
          {loading ? (
            <div className="spinner"><div className="spinner-circle" /></div>
          ) : events.length === 0 ? (
            <div className="empty-state">
              <Calendar size={40} />
              <h3>No events yet</h3>
              <p>Create your first event using the form</p>
            </div>
          ) : (
            <div className="events-table-wrap">
              <table className="events-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Tickets</th>
                    <th>Available</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => {
                    const soldOut = event.available_tickets === 0;
                    return (
                      <tr key={event.id}>
                        <td style={{ fontWeight: 600 }}>{event.title}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td>{event.total_tickets}</td>
                        <td>
                          <span style={{ color: soldOut ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>
                            {event.available_tickets}
                          </span>
                        </td>
                        <td>
                          {soldOut ? (
                            <span className="role-badge" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>Sold Out</span>
                          ) : (
                            <span className="role-badge" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>Active</span>
                          )}
                        </td>
                        <td>
                          <div className="table-actions">
                            <button id={`edit-${event.id}`} className="btn btn-ghost btn-sm" onClick={() => handleEdit(event)}>
                              <Edit2 size={13} /> Edit
                            </button>
                            <button id={`delete-${event.id}`} className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(event)}>
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
