// src/app/content/[id]/page.tsx



'use client'

export const runtime = 'edge';

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '../../../../utils/supabase/client'
import { withAuthProtection } from '../../../../utils/withAuthProtection'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import styles from './ViewPostPage.module.css'

import 'highlight.js/styles/github.css'

const supabase = createClient()

type Post = {
  id: string
  title: string
  content: string
  created_at: string
  status: 'draft' | 'published'
}

function ViewPostPage() {
  const params = useParams()
  const router = useRouter()
  const id = typeof params.id === 'string' ? params.id : ''

  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        setError('Post not found or there was an error fetching it.')
        console.error(error)
      } else {
        setPost(data)
      }

      setLoading(false)
    }

    if (id) fetchPost()
  }, [id])

  const handlePublish = async () => {
    if (!post) return
    setPublishing(true)

    const { error } = await supabase
      .from('posts')
      .update({ status: 'published' })
      .eq('id', post.id)

    if (error) {
      console.error(error)
      setError('Failed to publish post.')
    } else {
      setPost({ ...post, status: 'published' })
      router.push('/') 
    }

    setPublishing(false)
  }

  return (
    <main className={styles.container}>
      <div className={styles.post}>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : post ? (
          <>
            <h1 className={styles.title}>{post.title}</h1>
            <p className={styles.meta}>
              {new Date(post.created_at).toLocaleString()} — {post.status}
            </p>

            <article className={`${styles.content} prose prose-lg max-w-none prose-pre:bg-gray-100 prose-pre:p-4`}>
              <ReactMarkdown
                remarkPlugins={[[remarkGfm, { breaks: true }]]}
                rehypePlugins={[rehypeHighlight]}
              >
                {post.content}
              </ReactMarkdown>
            </article>

            {post.status === 'draft' ? (
              <button
                onClick={handlePublish}
                disabled={publishing}
                className={`${styles.button} ${styles.publishButton}`}
              >
                {publishing ? 'Publishing...' : 'Publish'}
              </button>
            ) : (
              <button className={styles.button} disabled>
                ✅ Published
              </button>
            )}
          </>
        ) : (
          <p>No post found.</p>
        )}
      </div>
    </main>
  )
}

export default withAuthProtection(ViewPostPage)




/*

//latest working
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '../../../../utils/supabase/client'
import { withAuthProtection } from '../../../../utils/withAuthProtection'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

import 'highlight.js/styles/github.css'

const supabase = createClient()

type Post = {
  id: string
  title: string
  content: string
  created_at: string
  status: 'draft' | 'published'
}

function ViewPostPage() {
  const params = useParams()
  const router = useRouter()
  const id = typeof params.id === 'string' ? params.id : ''

  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        setError('Post not found or there was an error fetching it.')
        console.error(error)
      } else {
        setPost(data)
      }

      setLoading(false)
    }

    if (id) fetchPost()
  }, [id])

  const handlePublish = async () => {
    if (!post) return
    setPublishing(true)

    const { error } = await supabase
      .from('posts')
      .update({ status: 'published' })
      .eq('id', post.id)

    if (error) {
      console.error(error)
      setError('Failed to publish post.')
    } else {
      // Refresh the page to show updated status
      router.refresh()
    }

    setPublishing(false)
  }

  return (
    <main className="p-8 max-w-2xl mx-auto">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : post ? (
        <>
          <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
          <p className="text-sm text-gray-500 mb-4">
            {new Date(post.created_at).toLocaleString()} — {post.status}
          </p>

          {post.status === 'draft' && (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="mb-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {publishing ? 'Publishing...' : '🚀 Publish'}
            </button>
          )}

          <article className="prose prose-lg max-w-none prose-pre:bg-gray-100 prose-pre:p-4">
            <ReactMarkdown
              remarkPlugins={[[remarkGfm, { breaks: true }]]}
              rehypePlugins={[rehypeHighlight]}
            >
              {post.content}
            </ReactMarkdown>
          </article>
        </>
      ) : (
        <p>No post found.</p>
      )}
    </main>
  )
}

export default withAuthProtection(ViewPostPage)

*/

/*** 

'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '../../../../utils/supabase/client'
import { withAuthProtection } from '../../../../utils/withAuthProtection'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

import 'highlight.js/styles/github.css' // Optional: highlight.js theme

const supabase = createClient()

type Post = {
  id: string
  title: string
  content: string
  created_at: string
}

function ViewPostPage() {
  const params = useParams()
  const id = typeof params.id === 'string' ? params.id : ''

  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        setError('Post not found or there was an error fetching it.')
        console.error(error)
      } else {
        setPost(data)
      }

      setLoading(false)
    }

    if (id) fetchPost()
  }, [id])

  return (
    <main className="p-8 max-w-2xl mx-auto">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : post ? (
        <>
          <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
          <p className="text-sm text-gray-500 mb-4">
            {new Date(post.created_at).toLocaleString()}
          </p>
         <article className="prose prose-lg max-w-none prose-pre:bg-gray-100 prose-pre:p-4">
           <ReactMarkdown
             remarkPlugins={[[remarkGfm, { breaks: true }]]}
             rehypePlugins={[rehypeHighlight]}
           >
              {post.content}
            </ReactMarkdown>
          </article>
        </>
      ) : (
        <p>No post found.</p>
      )}
    </main>
  )
}

export default withAuthProtection(ViewPostPage)

*****/


/*

'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '../../../../utils/supabase/client'
import { withAuthProtection } from '../../../../utils/withAuthProtection'

const supabase = createClient()

type Post = {
  id: string
  title: string
  content: string
  created_at: string
}

function ViewPostPage() {
  const params = useParams()
  const id = typeof params.id === 'string' ? params.id : ''

  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        setError('Post not found or there was an error fetching it.')
        console.error(error)
      } else {
        setPost(data)
      }

      setLoading(false)
    }

    if (id) fetchPost()
  }, [id])

 
 return (
  <main className="p-8 max-w-2xl mx-auto">
    {loading ? (
      <p>Loading...</p>
    ) : error ? (
      <p className="text-red-600">{error}</p>
    ) : post ? (
      <>
        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-4">
          {new Date(post.created_at).toLocaleString()}
        </p>
        <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }} className="prose">
          {post.content}
        </div>
      </>
    ) : (
      <p>No post found.</p>
    )}
  </main>
)
}

export default withAuthProtection(ViewPostPage)

*/



 /*
  return (
    <main className="p-8 max-w-2xl mx-auto">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : post ? (
        <>
          <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
          <p className="text-sm text-gray-500 mb-4">
            {new Date(post.created_at).toLocaleString()}
          </p>
          <article className="prose">{post.content}</article>
        </>
      ) : (
        <p>No post found.</p>
      )}
    </main>
  )
  */