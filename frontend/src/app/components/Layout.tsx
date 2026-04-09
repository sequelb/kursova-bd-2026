import {
  Search,
  User as UserIcon,
  BookOpen,
  GraduationCap,
  DollarSign,
  MessageSquare,
  FileEdit,
  BarChart3,
  Users,
  LogOut,
  IdCard,
} from 'lucide-react'
import { Link, useLocation, Outlet, useNavigate } from 'react-router'
import { useState } from 'react'
import { useAuth } from '../../lib/auth'
import type { Role } from '../../lib/api'

const studentNavItems = [
  { path: '/my-learning', label: 'My Learning', icon: GraduationCap },
  { path: '/catalog', label: 'Catalog', icon: BookOpen },
]

const teacherNavItems = [
  { path: '/teacher/courses', label: 'My Courses', icon: FileEdit },
  { path: '/teacher/reviews', label: 'Student Reviews', icon: MessageSquare },
  { path: '/teacher/earnings', label: 'Earnings & Payouts', icon: DollarSign },
  { path: '/teacher/profile', label: 'My Profile', icon: IdCard },
]

const adminNavItems = [
  { path: '/admin/overview', label: 'Financial Dashboard', icon: BarChart3 },
  { path: '/admin/payments', label: 'Student Payments', icon: DollarSign },
  { path: '/admin/payouts', label: 'Teacher Payouts', icon: DollarSign },
  { path: '/admin/users', label: 'Users', icon: Users },
]

function navItemsForRole(role: Role) {
  switch (role) {
    case 'Student':
      return studentNavItems
    case 'Teacher':
      return teacherNavItems
    case 'Admin':
      return adminNavItems
  }
}

function portalTitleForRole(role: Role) {
  switch (role) {
    case 'Student':
      return 'Student Portal'
    case 'Teacher':
      return 'Teacher Portal'
    case 'Admin':
      return 'Admin Portal'
  }
}

export function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  if (!user) return null // RequireAuth handles this, but TS narrowing

  const navItems = navItemsForRole(user.role)
  const portalTitle = portalTitleForRole(user.role)
  const [searchValue, setSearchValue] = useState('')

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = searchValue.trim()
    navigate(trimmed ? `/catalog?q=${encodeURIComponent(trimmed)}` : '/catalog')
  }

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-64 border-r-2 border-gray-800 bg-gray-100 p-6 overflow-y-auto">
        <div className="mb-8">
          <div className="text-xl font-bold text-gray-900">{portalTitle}</div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 border-2 transition-colors ${
                  isActive
                    ? 'border-gray-800 bg-gray-900 text-white'
                    : 'border-gray-400 bg-white text-gray-900 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="border-b-2 border-gray-800 bg-gray-100 p-4">
          <div className="flex items-center gap-4">
            {user.role !== 'Admin' && (
              <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-800 bg-white"
                />
              </form>
            )}
            {user.role === 'Admin' && <div className="flex-1" />}

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 h-10 border-2 border-gray-800 bg-gray-300 hover:bg-gray-400 transition-colors cursor-pointer"
              >
                <UserIcon className="w-5 h-5 text-gray-700" />
                <span className="text-sm font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 border-2 border-gray-800 bg-white shadow-lg z-50">
                  <div className="p-3 border-b-2 border-gray-400 bg-gray-100">
                    <div className="text-sm font-bold text-gray-900">{user.email}</div>
                    <div className="text-xs text-gray-600">{user.role}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-left px-4 py-3 hover:bg-gray-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
