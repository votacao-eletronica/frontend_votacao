import { useEffect, useState } from 'react'
import { ArrowsOut, ArrowsIn } from 'phosphor-react'
import { toast } from 'react-toastify'
export function FullscreenButton() {
    const [fullscreen, setFullscreen] = useState(!!document.fullscreenElement)
    useEffect(() => {
        const update = () => setFullscreen(!!document.fullscreenElement)
        document.addEventListener('fullscreenchange', update)
        return () => document.removeEventListener('fullscreenchange', update)
    }, [])
    if (!document.fullscreenEnabled) return null
    async function toggle() {
        try {
            if (document.fullscreenElement) await document.exitFullscreen()
            else await document.documentElement.requestFullscreen()
        } catch { toast.error('Não foi possível ativar a tela cheia. Tente novamente.') }
    }
    const label = fullscreen ? 'Sair da tela cheia' : 'Entrar em tela cheia'
    return <button type="button" onClick={toggle} className="icon-action" title={label} aria-label={label} aria-pressed={fullscreen}>{fullscreen ? <ArrowsIn size={21} /> : <ArrowsOut size={21} />}</button>
}
