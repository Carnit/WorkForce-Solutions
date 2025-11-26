import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { networkAPI } from '../../services/api';
import FilterButton from '../common/FilterButton';
import UserCard from './UserCard';
import type { User } from '../../types';

export default function NetworkDirectory() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      const params = filter === 'all' ? {} : { mode: filter };
      const data = await networkAPI.getUsers(params);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Network Directory</h1>
        <p className="text-slate-600">Connect with builders and hustlers in your community</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="All Members" />
        <FilterButton active={filter === 'builder'} onClick={() => setFilter('builder')} label="🔨 Builders" />
        <FilterButton active={filter === 'hustler'} onClick={() => setFilter('hustler')} label="⚡ Hustlers" />
      </div>

      {loading ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-slate-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {users.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No users found</p>
            </div>
          ) : (
            users.map(u => <UserCard key={u.id} user={u} />)
          )}
        </div>
      )}
    </div>
  );
}