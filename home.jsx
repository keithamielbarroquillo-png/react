import React, { useState } from 'react';
import axiosclient from '../../services/axiosclient';
import Swal from 'sweetalert2';

function Home() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await axiosclient.post("registration.php", { username, password });

      console.log("Server response:", response.data);

      if (
        response.data.status === 'success' ||
        response.data.status === true ||
        response.data.message?.toLowerCase().includes('success')
      ) {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: response.data.message || 'User registered successfully',
          confirmButtonColor: '#0d6efd'
        });

        setUsername('');
        setPassword('');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: response.data.message || 'Something went wrong',
        });
      }

    } catch (error) {
      console.error('Error during registration:', error);

      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Please try again later.',
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="col-md-6 col-lg-5">
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
          
          <div className="card-header bg-primary bg-gradient py-4 border-0">
            <h4 className="card-title mb-0 text-white text-uppercase text-center fw-bold">
              Registration
            </h4>
          </div>

          <div className="card-body p-4 p-md-5">
            <form onSubmit={handleRegister}>
              
              <div className="form-floating mb-3">
                <input
                  required
                  type="text"
                  className="form-control border-0 bg-light rounded-3"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label>Username</label>
              </div>

              <div className="form-floating mb-4">
                <input
                  required
                  type="password"
                  className="form-control border-0 bg-light rounded-3"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label>Password</label>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 rounded-3 shadow-sm fw-bold py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <div className="spinner-border spinner-border-sm"></div>
                    <span>Processing...</span>
                  </div>
                ) : 'Create Account'}
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;