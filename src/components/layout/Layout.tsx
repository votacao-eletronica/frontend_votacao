import { isCouncilMember as hasCouncilRole, isStaff } from '../../utils/access'
import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'
import { Users, Flag, Lightbulb, Clock, SignOut, House, ClockCounterClockwise, Buildings, List, X, Checks } from 'phosphor-react'
import { useAuth } from '../../hooks/auth/context'

export function Layout() {
    const { logout, user } = useAuth()
    const [menuOpen, setMenuOpen] = useState(false)
    const location = useLocation()
    const isCouncilMember = hasCouncilRole(user)
    const isAdmin = user?.roles.some(role => role.name === 'admin') ?? false
    if (location.pathname.startsWith('/council/sessions/')) return <Outlet />
    const links = isCouncilMember ? [
        { to: '/council', label: 'Sessões abertas', icon: House, end: true },
        { to: '/council/history', label: 'Histórico de sessões', icon: ClockCounterClockwise, end: false },
    ] : isStaff(user) ? [
        ...(isAdmin ? [{ to: '/chamber', label: 'Dados da Câmara', icon: Buildings, end: false }] : []),
        { to: '/users', label: 'Usuários', icon: Users, end: false },
        { to: '/parties', label: 'Partidos políticos', icon: Flag, end: false },
        { to: '/proposals', label: 'Propostas', icon: Lightbulb, end: false },
        { to: '/sessions', label: 'Sessões', icon: Clock, end: false },
    ] : []
    const currentPage = links.find(link => link.end ? location.pathname === link.to : location.pathname.startsWith(link.to))?.label ?? 'Painel'
    return (
        <div className="app-shell">
            {menuOpen && <button className="sidebar-overlay" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />}
            <aside className={`app-sidebar ${menuOpen ? 'is-open' : ''}`} aria-label="Menu principal">
                <div className="sidebar-brand">
                    <span className="brand-symbol"><Checks size={26} weight="bold" /></span>
                    <div><strong>Votação Eletrônica</strong><span>Gestão legislativa</span></div>
                    <button className="mobile-close" aria-label="Fechar menu" onClick={() => setMenuOpen(false)}><X size={22} /></button>
                </div>
                <nav className="sidebar-nav">
                    <p className="sidebar-label">{isCouncilMember ? 'Área do vereador' : 'Administração'}</p>
                    {links.map(({ to, label, icon: Icon, end }) => (
                        <NavLink key={to} to={to} end={end} onClick={() => setMenuOpen(false)} className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`}>
                            <Icon size={21} /><span>{label}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <div className="sidebar-account"><span className="account-avatar">{user?.name?.charAt(0).toUpperCase() || 'U'}</span><div><strong>{user?.name || 'Minha conta'}</strong><span>{user?.roles.map(role => role.name).join(' · ') || 'Usuário'}</span></div></div>
                    <button onClick={logout} className="sidebar-logout"><SignOut size={19} /> Sair da conta</button>
                </div>
            </aside>
            <div className="app-workspace">
                <header className="workspace-header">
                    <div className="workspace-breadcrumb"><button className="mobile-menu" aria-label="Abrir menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><List size={24} /></button><Buildings size={18} /><span>Painel legislativo</span><span className="breadcrumb-divider">/</span><strong>{currentPage}</strong></div>
                    <span className="workspace-context">Votação Eletrônica</span>
                </header>
                <main className="workspace-content"><Outlet /></main>
            </div>
        </div>
    )
}
