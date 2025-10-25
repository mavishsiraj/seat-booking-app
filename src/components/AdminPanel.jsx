import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = () => {
  const [buses, setBuses] = useState([]);
  const [editingBus, setEditingBus] = useState(null);
  const [formData, setFormData] = useState({
    busName: '',
    source: '',
    destination: '',
    date: '',
    departureTime: '',
    arrivalTime: '',
    price: ''
  });

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await axios.get('/api/admin/buses');
      setBuses(response.data);
    } catch (error) {
      console.error('Error fetching buses:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBus) {
        await axios.put(`http://localhost:3001/admin/buses/${editingBus._id}`, formData);
      } else {
        await axios.post('http://localhost:3001/admin/buses', formData);
      }
      setFormData({
        busName: '',
        source: '',
        destination: '',
        date: '',
        departureTime: '',
        arrivalTime: '',
        price: ''
      });
      setEditingBus(null);
      fetchBuses();
    } catch (error) {
      console.error('Error saving bus:', error);
    }
  };

  const handleEdit = (bus) => {
    setEditingBus(bus);
    setFormData({
      busName: bus.busName,
      source: bus.source,
      destination: bus.destination,
      date: bus.date,
      departureTime: bus.departureTime,
      arrivalTime: bus.arrivalTime,
      price: bus.price
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        await axios.delete(`http://localhost:3001/admin/buses/${id}`);
        fetchBuses();
      } catch (error) {
        console.error('Error deleting bus:', error);
      }
    }
  };

  return (
    <div className="admin-panel">
      <h2>{editingBus ? 'Edit Bus' : 'Add New Bus'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Bus Name:</label>
          <input
            type="text"
            name="busName"
            value={formData.busName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Source:</label>
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Destination:</label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Departure Time:</label>
          <input
            type="time"
            name="departureTime"
            value={formData.departureTime}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Arrival Time:</label>
          <input
            type="time"
            name="arrivalTime"
            value={formData.arrivalTime}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">{editingBus ? 'Update Bus' : 'Add Bus'}</button>
        {editingBus && (
          <button type="button" onClick={() => {
            setEditingBus(null);
            setFormData({
              busName: '',
              source: '',
              destination: '',
              date: '',
              departureTime: '',
              arrivalTime: '',
              price: ''
            });
          }}>Cancel Edit</button>
        )}
      </form>

      <h2>Bus List</h2>
      <div className="bus-list">
        <table>
          <thead>
            <tr>
              <th>Bus Name</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Date</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus._id}>
                <td>{bus.busName}</td>
                <td>{bus.source}</td>
                <td>{bus.destination}</td>
                <td>{bus.date}</td>
                <td>{bus.departureTime}</td>
                <td>{bus.arrivalTime}</td>
                <td>${bus.price}</td>
                <td>
                  <button onClick={() => handleEdit(bus)}>Edit</button>
                  <button onClick={() => handleDelete(bus._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;