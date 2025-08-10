//frontend/src/app/dashboard/page.tsx


'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { withAuthProtection } from '../../../utils/withAuthProtection'
import { useSupabase } from '../../../context/SupabaseProvider'

type Post = {
  id: string
  title: string
  status: string
  user_id: string
  created_at: string
}

function DashboardPage() {
  const { supabase, user } = useSupabase()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null)

  useEffect(() => {
    const fetchMyPosts = async () => {
      setLoading(true)
      setError(null)

      if (!user) {
        setError('You must be logged in to view your dashboard.')
        setPosts([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        setError('Failed to load posts.')
        console.error(error)
      } else {
        setPosts(data || [])
      }

      setLoading(false)
    }

    fetchMyPosts()
  }, [user, supabase])

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    setDeletingPostId(postId)
    setError(null)

    const { error } = await supabase.from('posts').delete().eq('id', postId).eq('user_id', user?.id)

    if (error) {
      setError('Failed to delete the post.')
      console.error(error)
      setDeletingPostId(null)
      return
    }

    // Remove the deleted post from the local state
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId))
    setDeletingPostId(null)
  }

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-2">📂</span> My Dashboard
      </h1>

      <Link href="/content/new" className="btn inline-block">
        + New Post
      </Link>

      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">My Posts</h2>

      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && <p className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <p className="text-gray-500 bg-white p-4 rounded-lg shadow-sm">
          You haven’t created any posts yet.
        </p>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200"
          >
            <Link href={`/content/${post.id}`} className="flex-1">
              <h3 className="font-semibold text-lg text-gray-800">{post.title}</h3>
              <p className="text-sm text-gray-500">Status: {post.status}</p>
            </Link>


<button
  onClick={() => handleDelete(post.id)}
  disabled={deletingPostId === post.id}
  aria-label={`Delete post titled ${post.title}`}
  className="ml-4 text-red-600 hover:text-red-800 focus:outline-none flex items-center justify-center"
  style={{ width: 32, height: 32 }} // enforce size
>
  {deletingPostId === post.id ? (
    <svg
      className="animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      width="24"
      height="24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        strokeWidth="4"
        stroke="currentColor"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      width="24"
      height="24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
        stroke="currentColor"
      />
    </svg>
  )}
</button>

            
          </div>
        ))}
      </div>
    </main>
  )
}

export default withAuthProtection(DashboardPage)


/*

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { withAuthProtection } from '../../../utils/withAuthProtection'
import { useSupabase } from '../../../context/SupabaseProvider'

type Post = {
  id: string
  title: string
  status: string
  user_id: string
  created_at: string
}

function DashboardPage() {
  const { supabase, user } = useSupabase()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMyPosts = async () => {
      setLoading(true)
      setError(null)

      if (!user) {
        setError('You must be logged in to view your dashboard.')
        setPosts([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        setError('Failed to load posts.')
        console.error(error)
      } else {
        setPosts(data || [])
      }

      setLoading(false)
    }

    fetchMyPosts()
  }, [user, supabase])

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-2">📂</span> My Dashboard
      </h1>

      <Link href="/content/new" className="btn inline-block">
        + New Post
      </Link>

      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">My Posts</h2>

      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && <p className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <p className="text-gray-500 bg-white p-4 rounded-lg shadow-sm">
          You haven’t created any posts yet.
        </p>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/content/${post.id}`}
            className="block bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200"
          >
            <h3 className="font-semibold text-lg text-gray-800">{post.title}</h3>
            <p className="text-sm text-gray-500">Status: {post.status}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}

export default withAuthProtection(DashboardPage)


*/
/*
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { withAuthProtection } from '../../../utils/withAuthProtection'
import { useSupabase } from '../../../context/SupabaseProvider'

type Post = {
  id: string
  title: string
  status: string
  user_id: string
  created_at: string
}

function DashboardPage() {
  const { supabase, user } = useSupabase()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null)

  useEffect(() => {
    const fetchMyPosts = async () => {
      setLoading(true)
      setError(null)

      if (!user) {
        setError('You must be logged in to view your dashboard.')
        setPosts([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        setError('Failed to load posts.')
        console.error(error)
      } else {
        setPosts(data || [])
      }

      setLoading(false)
    }

    fetchMyPosts()
  }, [user, supabase])

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    setDeletingPostId(postId)
    setError(null)

    const { error } = await supabase.from('posts').delete().eq('id', postId).eq('user_id', user?.id)

    if (error) {
      setError('Failed to delete the post.')
      console.error(error)
      setDeletingPostId(null)
      return
    }

    // Remove the deleted post from the local state
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId))
    setDeletingPostId(null)
  }

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-2">📂</span> My Dashboard
      </h1>

      <Link href="/content/new" className="btn inline-block">
        + New Post
      </Link>

      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">My Posts</h2>

      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && <p className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <p className="text-gray-500 bg-white p-4 rounded-lg shadow-sm">
          You haven’t created any posts yet.
        </p>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200"
          >
            <Link href={`/content/${post.id}`} className="flex-1">
              <h3 className="font-semibold text-lg text-gray-800">{post.title}</h3>
              <p className="text-sm text-gray-500">Status: {post.status}</p>
            </Link>
            <button
              onClick={() => handleDelete(post.id)}
              disabled={deletingPostId === post.id}
              aria-label={`Delete post titled ${post.title}`}
              className="ml-4 text-red-600 hover:text-red-800 focus:outline-none"
            >
              {deletingPostId === post.id ? (
                <svg
                  className="animate-spin h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
                  />
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}

export default withAuthProtection(DashboardPage)
*/