'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../utils/supabase/client'
import Link from 'next/link'
import styles from './HomePage.module.css'

const supabase = createClient()

interface Post {
  id: string
  title: string
  content: string
  created_at: string
  user_id: string
  profiles?: {
    username: string | null
  } | null
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
   const fetchPosts = async () => {
  try {
    // Fetch posts
    const { data: postsData, error: postsError } = await supabase
      .from('posts')
      .select('id, title, content, created_at, user_id')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (postsError) {
      console.error('Error fetching posts:', postsError)
      setPosts([])
      return
    }

    // Fetch usernames for all user_ids
    const userIds = (postsData || []).map((post: Post) => post.user_id)
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', userIds)

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
    }

    // Define Profile interface
    interface Profile {
      id: string
      username: string | null
    }

    // Map posts with usernames
    const profilesMap = new Map(
      (profilesData as Profile[] | undefined)?.map((p) => [p.id, p.username]) || []
    )
    const mapped = (postsData || []).map((post: Post) => ({
      ...post,
      profiles: { username: profilesMap.get(post.user_id) || null },
    }))
    setPosts(mapped)
  } catch (error) {
    console.error('Unexpected error:', error)
    setPosts([])
  } finally {
    setLoading(false)
  }
}
    fetchPosts()
  }, [])

  const formatDate = (isoString: string) =>
    new Date(isoString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

  return (
    <main className={styles.container}>
      <h1 className={styles.header}>📰 Recent Posts</h1>
      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post) => (
          <Link href={`/content/${post.id}`} key={post.id} className={styles.postCard}>
            <div>
              <div className={styles.userInfo}>
                <div className={styles.username}>{post.profiles?.username || 'Anonymous'}</div>
                <div className={styles.date}>{formatDate(post.created_at)}</div>
              </div>
              <div className={styles.postContent}>
                <h2 className={styles.title}>{post.title}</h2>
                <p className={styles.preview}>
                  {post.content.slice(0, 160)}
                  {post.content.length > 160 ? '...' : ''}
                </p>
              </div>
            </div>
          </Link>
        ))
      )}
    </main>
  )
}






