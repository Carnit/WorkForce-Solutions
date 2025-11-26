import { useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';

interface Post {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
}

export default function Posts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: 'John Doe',
      content: 'Just finished an amazing project with React and TypeScript. The learning curve was worth it!',
      timestamp: '2 hours ago',
      likes: 24,
      comments: 5
    },
    {
      id: 2,
      author: 'Jane Smith',
      content: 'Looking for collaborators for a web3 project. Interested in blockchain development!',
      timestamp: '4 hours ago',
      likes: 45,
      comments: 12
    }
  ]);
  const [newPost, setNewPost] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleCreatePost = () => {
    if (newPost.trim()) {
      const post: Post = {
        id: posts.length + 1,
        author: user?.full_name || 'Anonymous',
        content: newPost,
        timestamp: 'just now',
        likes: 0,
        comments: 0
      };
      setPosts([post, ...posts]);
      setNewPost('');
      setShowCreatePost(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Post Section */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        {!showCreatePost ? (
          <button
            onClick={() => setShowCreatePost(true)}
            className="w-full text-left px-4 py-3 bg-slate-50 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            What's on your mind?
          </button>
        ) : (
          <div className="space-y-4">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share something with the community..."
              rows={4}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreatePost(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                disabled={!newPost.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="mb-4">
              <h3 className="font-semibold text-slate-900">{post.author}</h3>
              <p className="text-sm text-slate-500">{post.timestamp}</p>
            </div>
            <p className="text-slate-700 mb-4">{post.content}</p>
            <div className="flex gap-6 text-slate-600 text-sm">
              <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Heart className="w-4 h-4" />
                {post.likes}
              </button>
              <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <MessageCircle className="w-4 h-4" />
                {post.comments}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
