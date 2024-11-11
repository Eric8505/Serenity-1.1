import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { FileText } from 'lucide-react';
import { UserRole } from '../types/auth';

// Demo credentials - in a real app, these would be in a secure backend
const DEMO_USERS = {
  admin: {
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin' as UserRole,
    name: 'Admin User'
  },
  staff: {
    email: 'staff@example.com',
    password: 'staff123',
    role: 'staff' as UserRole,
    name: 'Staff User'
  },
  client: {
    email: 'client@example.com',
    password: 'client123',
    role: 'client' as UserRole,
    name: 'Client User'
  }
};

const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (data: { email: string; password: string; name?: string }) => {
    setError('');

    // Find user by email
    const matchedUser = Object.values(DEMO_USERS).find(u => u.email === data.email);
    
    if (matchedUser && data.password === matchedUser.password) {
      const authUser = {
        id: crypto.randomUUID(),
        email: matchedUser.email,
        name: matchedUser.name,
        role: matchedUser.role
      };
      
      // Store auth user in localStorage
      localStorage.setItem('authUser', JSON.stringify(authUser));
      
      // Redirect based on role
      switch (matchedUser.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'staff':
          navigate('/clients');
          break;
        case 'client':
          navigate('/documents');
          break;
      }
      
      // Force page reload to update auth state
      window.location.reload();
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-blue-100 p-3">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isSignUp ? 'Create your account' : 'Sign in to your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
        
        {/* Demo credentials info */}
        <div className="mt-4 text-center text-sm text-gray-600">
          <p className="font-medium">Demo Credentials:</p>
          <p>Admin: admin@example.com / admin123</p>
          <p>Staff: staff@example.com / staff123</p>
          <p>Client: client@example.com / client123</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          <AuthForm
            type={isSignUp ? 'signup' : 'signin'}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;