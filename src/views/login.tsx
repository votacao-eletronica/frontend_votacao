import { chamberService } from '../services/chamberService'
import type { Chamber } from '../types/Chamber'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, Buildings, Checks, Eye, EyeSlash, ShieldCheck } from 'phosphor-react'
import { Button } from '../components/form/button'
import { Input } from '../components/form/input'
import { useLogin } from '../hooks/auth/useLogin'

const loginSchema = z.object({
    email: z.email('Informe um email válido'),
    password: z.string().min(1, 'Informe sua senha'),
})
type LoginForm = z.infer<typeof loginSchema>

const Login = () => {
    const [chamber, setChamber] = useState<Pick<Chamber, 'name' | 'coat_of_arms'> | null>(null)
    const [logoFailed, setLogoFailed] = useState(false)
    useEffect(() => {
        let active = true
        chamberService.branding().then(data => { if (active) setChamber(data) }).catch(() => {})
        return () => { active = false }
    }, [])
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const { login } = useLogin()
    const form = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })
    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true)
        try { await login(data) } finally { setIsLoading(false) }
    }
    return (
        <main className="login-page">
            <section className="login-story" aria-label="Votação Eletrônica">
                <div className="login-brand"><span className="brand-symbol"><Checks size={26} weight="bold" /></span><div><strong>Votação Eletrônica</strong><span>Gestão legislativa</span></div></div>
                <div className="login-story-content">
                    <span className="login-kicker">Tecnologia a serviço da Câmara</span>
                    <h1>Mais organização.<br />Mais participação.<br /><span>Decisões que avançam.</span></h1>
                    <p>Um espaço para conectar pessoas, organizar sessões e acompanhar cada etapa do trabalho legislativo.</p>
                    <div className="login-feature"><Buildings size={22} /><div><strong>A rotina legislativa em um só lugar</strong><span>Usuários, propostas, sessões e votações.</span></div></div>
                </div>
                <div className="login-story-footer"><ShieldCheck size={18} /><span>Acesso exclusivo para usuários autorizados</span></div>
            </section>
            <section className="login-access" aria-labelledby="login-title">
                <div className="login-form-wrap">
                    <div className="login-mobile-brand"><Checks size={24} weight="bold" /> Votação Eletrônica</div>
                    <div className="login-chamber-brand">{chamber?.coat_of_arms && !logoFailed ? <img className="login-chamber-logo" src={chamber.coat_of_arms} alt={`Logo de ${chamber.name}`} onError={() => setLogoFailed(true)} /> : <span className="login-form-icon"><Buildings size={25} /></span>}{chamber && <p className="login-chamber-name">{chamber.name}</p>}</div>
                    <p className="page-eyebrow">Bem-vindo de volta</p>
                    <h2 id="login-title">Acesse sua conta</h2>
                    <p className="login-intro">Entre com suas credenciais para acessar o painel.</p>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="login-form" noValidate>
                        <Input name="email" label="Email" type="email" placeholder="nome@exemplo.com" autoComplete="username" caption={form.formState.errors.email?.message} formRegister={form.register('email')} />
                        <div className="login-password">
                            <Input name="password" label="Senha" type={showPassword ? 'text' : 'password'} placeholder="Digite sua senha" autoComplete="current-password" caption={form.formState.errors.password?.message} formRegister={form.register('password')} />
                            <button type="button" className="password-toggle" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} aria-pressed={showPassword}>{showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}</button>
                        </div>
                        <Button text="Entrar no painel" icon={<ArrowRight size={18} />} type="submit" fullWidth isLoading={isLoading} />
                    </form>
                    <p className="login-help">Precisa de acesso? Entre em contato com a administração da Câmara.</p>
                </div>
                <p className="login-copyright">Votação Eletrônica · Gestão legislativa</p>
            </section>
        </main>
    )
}
export default Login
