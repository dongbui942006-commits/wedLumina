import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingEmployee, setIsEditingEmployee] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [stats, setStats] = useState({ totalRevenue: 0, totalProductsSold: 0 });

  const emptyProduct = { name: '', category: '', price: '', image: '', isNew: false };
  const emptyEmployee = { name: '', position: '', email: '', phone: '' };

  useEffect(() => {
    fetchProducts();
    fetchStats();
    fetchEmployees();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/employees');
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const method = currentProduct.id ? 'PUT' : 'POST';
    const url = currentProduct.id 
      ? `http://localhost:5000/api/products/${currentProduct.id}`
      : 'http://localhost:5000/api/products';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentProduct)
      });
      setIsEditing(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (product) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) return;
    try {
      await fetch(`http://localhost:5000/api/employees/${id}`, { method: 'DELETE' });
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    const method = currentEmployee.id ? 'PUT' : 'POST';
    const url = currentEmployee.id 
      ? `http://localhost:5000/api/employees/${currentEmployee.id}`
      : 'http://localhost:5000/api/employees';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentEmployee)
      });
      setIsEditingEmployee(false);
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditEmployee = (employee) => {
    setCurrentEmployee(employee);
    setIsEditingEmployee(true);
  };

  return (
    <div className="admin-dashboard container" style={{ paddingTop: '120px', minHeight: '100vh' }}>
      <div className="admin-header">
        <h2>Bảng Điều Khiển <span>Quản Trị Viên</span></h2>
        <div className="admin-tabs">
          <button className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>Sản Phẩm</button>
          <button className={`tab-btn ${activeTab === 'employees' ? 'active' : ''}`} onClick={() => setActiveTab('employees')}>Nhân Viên</button>
        </div>
        {activeTab === 'products' ? (
          <button className="btn btn-primary" onClick={() => openEdit(emptyProduct)}>
            <Plus size={20} /> Thêm Sản Phẩm
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => openEditEmployee(emptyEmployee)}>
            <Plus size={20} /> Thêm Nhân Viên
          </button>
        )}
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Tổng Doanh Thu</h3>
          <p>${Number(stats.totalRevenue).toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Số Sản Phẩm Đã Bán</h3>
          <p>{stats.totalProductsSold}</p>
        </div>
      </div>

      {activeTab === 'products' ? (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ảnh</th>
                <th>Tên Sản Phẩm</th>
                <th>Danh Mục</th>
                <th>Giá ($)</th>
                <th>Trạng Thái</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    <img src={p.image} alt={p.name} className="admin-product-img" />
                  </td>
                  <td className="font-medium">{p.name}</td>
                  <td>{p.category}</td>
                  <td>${Number(p.price).toFixed(2)}</td>
                  <td>{p.isNew ? <span className="badge badge-new">Mới</span> : ''}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-btn edit-btn" onClick={() => openEdit(p)} title="Sửa"><Pencil size={18} /></button>
                      <button className="icon-btn delete-btn" onClick={() => handleDelete(p.id)} title="Xóa"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên Nhân Viên</th>
                <th>Chức Vụ</th>
                <th>Email</th>
                <th>Số Điện Thoại</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td className="font-medium">{emp.name}</td>
                  <td>{emp.position}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-btn edit-btn" onClick={() => openEditEmployee(emp)} title="Sửa"><Pencil size={18} /></button>
                      <button className="icon-btn delete-btn" onClick={() => handleDeleteEmployee(emp.id)} title="Xóa"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isEditing && (
        <div className="modal-overlay">
          <div className="admin-modal">
            <h3>{currentProduct.id ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h3>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Tên Sản Phẩm</label>
                <input required type="text" value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Danh Mục</label>
                <input required type="text" value={currentProduct.category} onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Giá Bán ($)</label>
                <input required type="number" step="0.01" value={currentProduct.price} onChange={e => setCurrentProduct({...currentProduct, price: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Link Ảnh (URL)</label>
                <div className="img-input-wrap">
                  <ImageIcon size={20} className="input-icon" />
                  <input required type="url" value={currentProduct.image} onChange={e => setCurrentProduct({...currentProduct, image: e.target.value})} />
                </div>
              </div>
              <div className="form-checkbox">
                <input type="checkbox" id="isNew" checked={currentProduct.isNew} onChange={e => setCurrentProduct({...currentProduct, isNew: e.target.checked})} />
                <label htmlFor="isNew">Đánh dấu là Sản phẩm mới</label>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu Thay Đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditingEmployee && (
        <div className="modal-overlay">
          <div className="admin-modal">
            <h3>{currentEmployee.id ? 'Sửa Nhân Viên' : 'Thêm Nhân Viên Mới'}</h3>
            <form onSubmit={handleSaveEmployee}>
              <div className="form-group">
                <label>Tên Nhân Viên</label>
                <input required type="text" value={currentEmployee.name} onChange={e => setCurrentEmployee({...currentEmployee, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Chức Vụ</label>
                <input required type="text" value={currentEmployee.position} onChange={e => setCurrentEmployee({...currentEmployee, position: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={currentEmployee.email} onChange={e => setCurrentEmployee({...currentEmployee, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Số Điện Thoại</label>
                <input type="text" value={currentEmployee.phone} onChange={e => setCurrentEmployee({...currentEmployee, phone: e.target.value})} />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setIsEditingEmployee(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">Lưu Thay Đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
