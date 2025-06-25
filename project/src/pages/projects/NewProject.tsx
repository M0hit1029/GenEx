import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';
import { useUser } from '../../context/userDataContext';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../../context/projectContext';

const NewProject = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate();
  const { setProjectName } = useProject();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    console.log('Submitting form with name:', name);
    const token = localStorage.getItem('token'); // assumes token is stored in localStorage as 'token'

    try {
      console.log("IN the context axiosudhshyd");
      const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/projects/createProject`,
        {
          name,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // send token in headers
          },
        }
      );
      if (response.status === 200) {
        setProjectName(name);
        localStorage.setItem('projectname',name);
        console.log("Mohit",name); // Set the project name in context
        setSuccess('✅ Project created successfully');
      }
      setProjectName(name);
      //console.log(name); // Set the project name in context
      setName('');
      setDescription('');
    } catch (err) {
      console.log(err);
      setSuccess(' Something went wrong');
    } finally {

      setLoading(false);
      setProjectName(name);
      //console.log('hello',name);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 text-white flex items-center justify-center">
      <div className="w-full max-w-2xl p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <Plus className="text-blue-500 w-6 h-6" />
          <h1 className="text-3xl font-bold">Create New Project</h1>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="peer w-full bg-transparent border border-gray-700 text-white placeholder-transparent rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder=""
            />
            <label className="absolute left-4 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-400">
              Project Name
            </label>
          </div>

          <div className="relative">
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="peer w-full bg-transparent border border-gray-700 text-white placeholder-transparent rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder=""
            />
            <label className="absolute left-4 top-3 text-gray-400 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-400">
              Description (optional)
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition rounded-xl font-semibold text-white shadow-md hover:shadow-lg"
          >
            {loading ? 'Creating...' : ' Create Project'}
          </button>

          {success && (
            <p className={`text-sm mt-2 ${success.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
              {success}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default NewProject;
