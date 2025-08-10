// src/app/content/new/page.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { createClient } from '../../../../utils/supabase/client'
import styles from './NewPostPage.module.css'
import { withAuthProtection } from '../../../../utils/withAuthProtection'

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

const supabase = createClient()

function NewPostPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState<string | undefined>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (status: 'draft' | 'published') => {
    setError(null)

    const wordCount = title.trim().split(/\s+/).length
    if (!title.trim() || !content?.trim()) {
      setError('Title and content cannot be empty.')
      return
    }
    if (wordCount > 20) {
      setError('Title cannot exceed 20 words.')
      return
    }

    setLoading(true)

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      setError('You must be logged in to create a post.')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase.from('posts').insert({
      user_id: user.id,
      title,
      content,
      status,
    })

    if (insertError) {
      console.error(insertError)
      setError('Failed to create post.')
    } else {
      router.push('/')
    }

    setLoading(false)
  }

  return (
    <main className={styles.container}>
      <div className={styles.editor}>
        <h1 className={styles.header}>✍️ New Post</h1>

        {error && <div className={styles.error}>{error}</div>}

        <input
          type="text"
          placeholder="Enter a title (max 20 words)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.titleInput}
        />

        <div data-color-mode="light" className={styles.mdEditor}>
          <MDEditor
            value={content}
            onChange={setContent}
            height={400}
            preview="edit"
          />
        </div>

        <div className={styles.buttonRow}>
          <button
            onClick={() => handleSubmit('draft')}
            className={styles.button}
            disabled={loading}
          >
            {loading ? 'Saving...' : '💾 Save Draft'}
          </button>
          <button
            onClick={() => handleSubmit('published')}
            className={`${styles.button} ${styles.publishButton}`}
            disabled={loading}
          >
            {loading ? 'Publishing...' : '🚀 Publish'}
          </button>
        </div>
      </div>
    </main>
  )
}

export default withAuthProtection(NewPostPage)


/*

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { createClient } from '../../../../utils/supabase/client'
import styles from './NewPostPage.module.css'
import { withAuthProtection } from '../../../../utils/withAuthProtection'

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

const supabase = createClient()

function NewPostPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState<string | undefined>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (status: 'draft' | 'published') => {
    setError(null)

    const wordCount = title.trim().split(/\s+/).length
    if (!title.trim() || !content?.trim()) {
      setError('Title and content cannot be empty.')
      return
    }
    if (wordCount > 20) {
      setError('Title cannot exceed 20 words.')
      return
    }

    setLoading(true)

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      setError('You must be logged in to create a post.')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase.from('posts').insert({
      user_id: user.id,
      title,
      content,
      status,
    })

    if (insertError) {
      console.error(insertError)
      setError('Failed to create post.')
    } else {
      router.push('/')
    }

    setLoading(false)
  }

  return (
    <main className={styles.container}>
      <div className={styles.editor}>
        <h1 className={styles.header}>✍️ New Post</h1>

        {error && <div className={styles.error}>{error}</div>}

        <input
          type="text"
          placeholder="Enter a title (max 20 words)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.titleInput}
        />

        <div data-color-mode="light" className={styles.mdEditor}>
          <MDEditor
            value={content}
            onChange={setContent}
            height={400}
            preview="edit"
          />
        </div>

        <div className={styles.buttonRow}>
          <button
            onClick={() => handleSubmit('draft')}
            className={styles.button}
            disabled={loading}
          >
            {loading ? 'Saving...' : '💾 Save Draft'}
          </button>
          <button
            onClick={() => handleSubmit('published')}
            className={`${styles.button} ${styles.publishButton}`}
            disabled={loading}
          >
            {loading ? 'Publishing...' : '🚀 Publish'}
          </button>
        </div>
      </div>
    </main>
  )
}

export default withAuthProtection(NewPostPage)

*/

/*

'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../../utils/supabase/client'
import styles from './NewPostPage.module.css'
import { withAuthProtection } from '../../../../utils/withAuthProtection'

const supabase = createClient()

function NewPostPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = 'auto'
      contentRef.current.style.height = `${contentRef.current.scrollHeight}px`
    }
  }, [content])

  const handleSubmit = async (status: 'draft' | 'published') => {
    setError(null)

    const wordCount = title.trim().split(/\s+/).length
    if (!title.trim() || !content.trim()) {
      setError('Title and content cannot be empty.')
      return
    }
    if (wordCount > 20) {
      setError('Title cannot exceed 20 words.')
      return
    }

    setLoading(true)

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      setError('You must be logged in to create a post.')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase.from('posts').insert({
      user_id: user.id,
      title,
      content,
      status,
    })

    if (insertError) {
      console.error(insertError)
      setError('Failed to create post.')
    } else {
      //router.push('/dashboard')
       router.push('/')
    }

    setLoading(false)
  }

  return (
    <main className={styles.container}>
      <div className={styles.editor}>
        <h1 className={styles.header}>✍️ New Post</h1>

        {error && <div className={styles.error}>{error}</div>}

        <input
          type="text"
          placeholder="Enter a title (max 20 words)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.titleInput}
        />

        <textarea
          ref={contentRef}
          placeholder="Start writing your content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.contentInput}
          rows={10}
        />

        <div className={styles.buttonRow}>
          <button
            onClick={() => handleSubmit('draft')}
            className={styles.button}
            disabled={loading}
          >
            {loading ? 'Saving...' : '💾 Save Draft'}
          </button>
          <button
            onClick={() => handleSubmit('published')}
            className={`${styles.button} ${styles.publishButton}`}
            disabled={loading}
          >
            {loading ? 'Publishing...' : '🚀 Publish'}
          </button>
        </div>
      </div>
    </main>
  )
}

export default withAuthProtection(NewPostPage)

*/