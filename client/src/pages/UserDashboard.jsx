import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { Calendar, Ticket, CheckCircle, XCircle, Search } from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);  // currently booking eventId
  const [confirmation, setConfirmation] = useState(null); // { event, message }
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [evRes, bkRes] = await Promise.all([
        api.get('/events'),
        api.get('/events/my-bookings'),
      ]);
      setEvents(evRes.data);
      setBookings(bkRes.data.map((b) => b.eventId));
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleBook = async (event) => {
    setBooking(event.id);
    setError('');
    try {
      await api.post(`/events/${event.id}/book`);
      setConfirmation({ event, message: `You've booked a ticket for "${event.title}"! 🎉` });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(null);
    }
  };

  const isBooked = (id) => bookings.includes(id);

  const pct = (e) => (e.available_tickets / e.total_tickets) * 100;
  const barClass = (e) => {
    const p = pct(e);
    if (p > 60) return 'high';
    if (p > 25) return 'medium';
    return 'low';
  };

  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="container"><div className="spinner"><div className="spinner-circle" /></div></div>
  );

  return (
    <div className="container">
      {/* Confirmation Modal */}
      {confirmation && (
        <div className="modal-overlay" onClick={() => setConfirmation(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">🎟️</div>
            <div className="modal-title">Booking Confirmed!</div>
            <div className="modal-text">{confirmation.message}</div>
            <div className="modal-actions">
              <button id="close-confirmation" className="btn btn-primary" onClick={() => setConfirmation(null)}>
                Awesome!
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="page-header">
        <h1 className="page-title">Welcome back, <span>{user?.name}</span>! 👋</h1>
        <p className="page-subtitle">Discover and book your next great experience</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Available Events</div>
          <div className="stat-value accent">{events.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">My Bookings</div>
          <div className="stat-value success">{bookings.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Sold Out</div>
          <div className="stat-value warning">{events.filter((e) => e.available_tickets === 0).length}</div>
        </div>
      </div>

      {error && <div className="alert alert-error"><XCircle size={16}/> {error}</div>}

      {/* Search */}
      <div className="form-group" style={{ marginBottom: '24px', maxWidth: '400px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            id="event-search"
            className="form-control"
            style={{ paddingLeft: '40px' }}
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <Ticket size={48} />
          <h3>No events found</h3>
          <p>Check back soon for upcoming events</p>
        </div>
      ) : (
        <div className="events-grid">
          {filtered.map((event) => {
            const soldOut = event.available_tickets === 0;
            const booked = isBooked(event.id);
            const percentage = pct(event);
            return (
              <div key={event.id} className="card event-card">
                <div className="event-card-accent" />
                <div className="event-card-body">
                  <h3 className="event-title">{event.title}</h3>
                  <div className="event-meta">
                    <div className="event-meta-item">
                      <Calendar size={14} />
                      {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="event-meta-item">
                      <Ticket size={14} />
                      {soldOut ? 'No tickets left' : `${event.available_tickets} of ${event.total_tickets} tickets remaining`}
                    </div>
                  </div>
                  <div className="tickets-bar-wrap">
                    <div className="tickets-bar-label">
                      <span>Availability</span>
                      <span>{Math.round(percentage)}%</span>
                    </div>
                    <div className="tickets-bar">
                      <div className={`tickets-bar-fill ${barClass(event)}`} style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                </div>
                <div className="event-card-footer">
                  {soldOut ? (
                    <span className="sold-out-badge"><XCircle size={15} /> Sold Out</span>
                  ) : booked ? (
                    <span className="btn btn-success btn-full" style={{ cursor: 'default' }}>
                      <CheckCircle size={15} /> Booked
                    </span>
                  ) : (
                    <button
                      id={`book-${event.id}`}
                      className="btn btn-primary btn-full"
                      onClick={() => handleBook(event)}
                      disabled={booking === event.id}
                    >
                      <Ticket size={15} />
                      {booking === event.id ? 'Booking...' : 'Book Ticket'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
