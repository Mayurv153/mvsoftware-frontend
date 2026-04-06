import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = {
    title: 'Admin Dashboard | MV Webservice',
    robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
    return (
        <AdminGuard>
            <div className="admin-shell min-h-screen">
                <AdminSidebar />
                <main className="flex-1 overflow-auto min-h-0 bg-slate-50">
                    <div className="p-4 lg:p-8 pt-16 lg:pt-8 max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </AdminGuard>
    );
}
