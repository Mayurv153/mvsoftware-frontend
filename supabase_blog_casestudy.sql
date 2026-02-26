-- ═══════════════════════════════════════════════════════════════
--  Blog Posts, Comments, Likes & Case Studies Tables
--  Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- 1) Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT DEFAULT '',
    category TEXT DEFAULT '',
    content TEXT[] DEFAULT '{}',
    read_time TEXT DEFAULT '5 min read',
    keywords TEXT[] DEFAULT '{}',
    cover_image_url TEXT DEFAULT '',
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2) Blog Comments
CREATE TABLE IF NOT EXISTS blog_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_email TEXT DEFAULT '',
    content TEXT NOT NULL,
    admin_reply TEXT DEFAULT '',
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3) Blog Likes
CREATE TABLE IF NOT EXISTS blog_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(post_id, user_id)
);

-- 4) Case Studies
CREATE TABLE IF NOT EXISTS case_studies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    client TEXT DEFAULT '',
    industry TEXT DEFAULT '',
    timeline TEXT DEFAULT '',
    services TEXT[] DEFAULT '{}',
    tech TEXT[] DEFAULT '{}',
    hero_image_url TEXT DEFAULT '',
    challenge TEXT DEFAULT '',
    solution TEXT DEFAULT '',
    outcome TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_post_id ON blog_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_published ON case_studies(is_published);
