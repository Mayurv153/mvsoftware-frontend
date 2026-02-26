const rawApiBase = process.env.NEXT_PUBLIC_API_URL || 'https://mvsoftware-backend.onrender.com';
const API_BASE_URL = rawApiBase
    .replace(/\r|\n/g, '')
    .trim()
    .replace(/^['"]+|['"]+$/g, '')
    .replace(/\/+$/, '')
    .replace(/\/api$/i, '');

function buildApiUrl(endpoint) {
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_BASE_URL}${normalizedEndpoint}`;
}

async function fetchAPI(endpoint, options = {}) {
    const url = buildApiUrl(endpoint);
    const config = {
        ...options,
        headers: { 'Content-Type': 'application/json', ...options.headers },
    };

    const res = await fetch(url, config);
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'API request failed');
    }

    return data;
}

// ─── Public Data ──────────────────────────────
// These functions fetch live data from the backend (admin-editable).
// They fall back to static defaults if the API is unavailable.

const STATIC_PLANS = [
    {
        slug: 'starter', name: 'Starter', displayPrice: '₹3,999', priceInr: 399900,
        deliveryDays: 3, popular: false,
        features: ['1-page landing website', 'Mobile responsive', 'WhatsApp button', 'Contact form', '3-day delivery'],
    },
    {
        slug: 'growth', name: 'Growth', displayPrice: '₹9,999', priceInr: 999900,
        deliveryDays: 7, popular: true,
        features: ['5-page website', 'Basic SEO', 'WhatsApp + contact form', '7-day delivery'],
    },
    {
        slug: 'pro', name: 'Pro', displayPrice: '₹19,999', priceInr: 1999900,
        deliveryDays: 14, popular: false,
        features: ['Full custom website (8–10 pages)', 'Admin dashboard for leads', 'Razorpay integration', 'SEO setup', 'Performance optimization', '14-day delivery'],
    },
    {
        slug: 'custom', name: 'Custom', displayPrice: 'Contact Us', priceInr: 0,
        deliveryDays: 30, popular: false,
        features: ['Web apps & SaaS', 'Dashboards', 'AI integrations', 'Ongoing maintenance'],
    },
];

export async function getPlans() {
    try {
        const res = await fetchAPI('/api/public/plans', { next: { revalidate: 0 }, cache: 'no-store' });
        if (res?.data?.plans?.length > 0) return res.data.plans;
    } catch (err) {
        console.warn('Failed to fetch plans from API, using fallback:', err.message);
    }
    return STATIC_PLANS;
}

export async function getTestimonials() {
    try {
        const res = await fetchAPI('/api/public/testimonials', { next: { revalidate: 0 }, cache: 'no-store' });
        return res?.data?.testimonials || [];
    } catch (err) {
        console.warn('Failed to fetch testimonials from API:', err.message);
        return [];
    }
}

export async function getPortfolioProjects() {
    try {
        const res = await fetchAPI('/api/public/portfolio', { next: { revalidate: 0 }, cache: 'no-store' });
        return res?.data?.projects || [];
    } catch (err) {
        console.warn('Failed to fetch portfolio from API:', err.message);
        return [];
    }
}

// ─── Service Requests ─────────────────────────
export async function submitServiceRequest(data) {
    return fetchAPI('/api/service-requests', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// ─── Payments ─────────────────────────────────
export async function createPaymentOrder(token, planSlug) {
    return fetchAPI('/api/payments/create-order', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Idempotency-Key': `pay_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
        },
        body: JSON.stringify({ plan_slug: planSlug }),
    });
}

export async function verifyPayment(token, payload) {
    return fetchAPI('/api/payments/verify', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
    });
}

// ─── Admin: Dashboard ───────────────────────
export async function getAdminRequests(token) {
    return fetchAPI('/api/admin/requests', {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function getAdminMetrics(token) {
    return fetchAPI('/api/admin/metrics', {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function getAdminProjects(token) {
    return fetchAPI('/api/admin/projects', {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function getAdminTasks(token) {
    return fetchAPI('/api/admin/tasks', {
        headers: { Authorization: `Bearer ${token}` },
    });
}

// ─── Admin: Update Service Request ──────────
export async function updateAdminRequest(token, id, data) {
    return fetchAPI(`/api/admin/requests/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
    });
}

export async function deleteAdminRequest(token, id) {
    return fetchAPI(`/api/admin/requests/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
}

// ─── Admin: Payments ────────────────────────
export async function getAdminPayments(token, params = {}) {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/api/admin/payments${query ? `?${query}` : ''}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
}

// ─── Admin: Plans ───────────────────────────
export async function getAdminPlans(token) {
    return fetchAPI('/api/admin/plans', {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function updateAdminPlan(token, id, data) {
    return fetchAPI(`/api/admin/plans/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
    });
}

// ─── Admin: Testimonials ────────────────────
export async function getAdminTestimonials(token) {
    return fetchAPI('/api/admin/testimonials', {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function createAdminTestimonial(token, data) {
    return fetchAPI('/api/admin/testimonials', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
    });
}

export async function updateAdminTestimonial(token, id, data) {
    return fetchAPI(`/api/admin/testimonials/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
    });
}

export async function deleteAdminTestimonial(token, id) {
    return fetchAPI(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
}

// ─── Admin: Update Project ──────────────────
export async function updateAdminProject(token, id, data) {
    return fetchAPI(`/api/admin/projects/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
    });
}

// ─── Admin: Portfolio (public showcase) ──────
export async function getAdminPortfolio(token) {
    return fetchAPI('/api/admin/portfolio', {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function createAdminPortfolio(token, data) {
    return fetchAPI('/api/admin/portfolio', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
    });
}

export async function updateAdminPortfolio(token, id, data) {
    return fetchAPI(`/api/admin/portfolio/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
    });
}

export async function deleteAdminPortfolio(token, id) {
    return fetchAPI(`/api/admin/portfolio/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
}

// ─── Public: Blogs ──────────────────────────
export async function getPublicBlogs() {
    try {
        const res = await fetchAPI('/api/public/blogs', { next: { revalidate: 0 }, cache: 'no-store' });
        return res?.data?.posts || [];
    } catch (err) {
        console.warn('Failed to fetch blogs from API:', err.message);
        return [];
    }
}

export async function getPublicBlogBySlug(slug) {
    try {
        const res = await fetchAPI(`/api/public/blogs/${slug}`, { next: { revalidate: 0 }, cache: 'no-store' });
        return res?.data?.post || null;
    } catch (err) {
        console.warn('Failed to fetch blog post from API:', err.message);
        return null;
    }
}

export async function toggleBlogLike(slug, userId) {
    return fetchAPI(`/api/public/blogs/${slug}/like`, {
        method: 'POST',
        body: JSON.stringify({ user_id: userId }),
    });
}

export async function addBlogComment(slug, data) {
    return fetchAPI(`/api/public/blogs/${slug}/comments`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// ─── Public: Case Studies ───────────────────
export async function getPublicCaseStudies() {
    try {
        const res = await fetchAPI('/api/public/case-studies', { next: { revalidate: 0 }, cache: 'no-store' });
        return res?.data?.caseStudies || [];
    } catch (err) {
        console.warn('Failed to fetch case studies from API:', err.message);
        return [];
    }
}

export async function getPublicCaseStudyBySlug(slug) {
    try {
        const res = await fetchAPI(`/api/public/case-studies/${slug}`, { next: { revalidate: 0 }, cache: 'no-store' });
        return res?.data?.caseStudy || null;
    } catch (err) {
        console.warn('Failed to fetch case study from API:', err.message);
        return null;
    }
}

// ─── Admin: Blog Posts ──────────────────────
export async function getAdminBlogs(token) {
    return fetchAPI('/api/admin/blogs', {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function createAdminBlog(token, data) {
    return fetchAPI('/api/admin/blogs', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
    });
}

export async function updateAdminBlog(token, id, data) {
    return fetchAPI(`/api/admin/blogs/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
    });
}

export async function deleteAdminBlog(token, id) {
    return fetchAPI(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
}

// ─── Admin: Case Studies ────────────────────
export async function getAdminCaseStudies(token) {
    return fetchAPI('/api/admin/case-studies', {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function createAdminCaseStudy(token, data) {
    return fetchAPI('/api/admin/case-studies', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
    });
}

export async function updateAdminCaseStudy(token, id, data) {
    return fetchAPI(`/api/admin/case-studies/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
    });
}

export async function deleteAdminCaseStudy(token, id) {
    return fetchAPI(`/api/admin/case-studies/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
}

// ─── Admin: Blog Comments ───────────────────
export async function getAdminBlogComments(token) {
    return fetchAPI('/api/admin/blog-comments', {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export async function replyAdminComment(token, id, adminReply) {
    return fetchAPI(`/api/admin/blog-comments/${id}/reply`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ admin_reply: adminReply }),
    });
}

export async function approveAdminComment(token, id, isApproved) {
    return fetchAPI(`/api/admin/blog-comments/${id}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ is_approved: isApproved }),
    });
}

export async function deleteAdminComment(token, id) {
    return fetchAPI(`/api/admin/blog-comments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });
}

