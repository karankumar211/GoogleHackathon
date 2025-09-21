import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../utils/api';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ monthlyBudget: '', profilePic: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const backendUrl = 'http://localhost:8000/';

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await getUserProfile();
                setUser(data.data);
                setFormData({ monthlyBudget: data.data.monthlyBudget });
            } catch (err) {
                setError('Failed to fetch profile data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, profilePic: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        const updatePayload = new FormData();
        updatePayload.append('monthlyBudget', formData.monthlyBudget);
        if (formData.profilePic) {
            updatePayload.append('profilePic', formData.profilePic);
        }

        try {
            const { data } = await updateUserProfile(updatePayload);
            setUser(data.data);
            setIsEditing(false);
        } catch (err) {
            setError('Failed to update profile.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    if (loading && !user) return <p className="p-6">Loading profile...</p>;
    if (error) return <p className="p-6 text-red-500">{error}</p>;
    if (!user) return <p className="p-6">Could not load user profile.</p>;

    const profilePicUrl = user.profilePic ? `${backendUrl}${user.profilePic.replace(/\\/g, '/')}` : 'https://placehold.co/128x128/E0E0E0/4A4A4A?text=No+Image';


    return (
        <div className="p-6 bg-gray-50 min-h-full">
            <h1 className="text-3xl font-bold text-gray-800">Profile & Settings</h1>
            <p className="text-gray-600 mb-8">Manage your account settings and preferences.</p>

            <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center space-x-4">
                        <img 
                            src={profilePicUrl}
                            alt="Profile" 
                            className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/128x128/E0E0E0/4A4A4A?text=Error'; }}
                        />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
                            <p className="text-gray-500">{user.email}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
                    >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Budget</label>
                                <input 
                                    type="number"
                                    name="monthlyBudget"
                                    value={formData.monthlyBudget}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                                <input 
                                    type="file"
                                    name="profilePic"
                                    onChange={handleFileChange}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Personal Information</h3>
                            <p><strong>Username:</strong> {user.username}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Financial Information</h3>
                            <p><strong>Annual Income / Monthly Budget:</strong> ${user.monthlyBudget.toLocaleString()}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
