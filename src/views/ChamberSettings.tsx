import { useEffect, useState, type FormEvent } from 'react'
import { Buildings, UploadSimple } from 'phosphor-react'
import { toast } from 'react-toastify'
import { chamberService } from '../services/chamberService'

export function ChamberSettings() {
    const [name, setName] = useState('')
    const [coat, setCoat] = useState<string | null>(null)
    const [file, setFile] = useState<File>()
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        chamberService.get().then(chamber => {
            setName(chamber.name)
            setCoat(chamber.coat_of_arms)
        }).catch(error => toast.error(error instanceof Error ? error.message : 'Não foi possível carregar os dados da Câmara.'))
    }, [])

    async function submit(event: FormEvent) {
        event.preventDefault()
        try {
            setSaving(true)
            const chamber = await chamberService.update(name, file)
            setName(chamber.name)
            setCoat(chamber.coat_of_arms)
            setFile(undefined)
            toast.success('Dados da Câmara atualizados.')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Não foi possível atualizar a Câmara.')
        } finally {
            setSaving(false)
        }
    }

    return <main className="min-h-full bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex items-center gap-3"><Buildings size={34} className="text-blue-600" /><div><h1 className="text-3xl font-bold text-gray-900">Dados da Câmara</h1><p className="text-gray-600">Essas informações aparecem no cabeçalho das atas em PDF.</p></div></div>
            <form onSubmit={submit} className="rounded-lg bg-white p-6 shadow">
                <label className="block text-sm font-semibold text-gray-700">Nome da Câmara</label>
                <input value={name} onChange={event => setName(event.target.value)} required maxLength={255} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />

                <label className="mt-6 block text-sm font-semibold text-gray-700">Brasão</label>
                {coat && <img src={coat} alt="Brasão atual" className="my-3 h-32 w-32 rounded-md border border-gray-200 object-contain p-2" />}
                <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 bg-gray-50 px-4 py-5 font-semibold text-gray-600 hover:bg-gray-100">
                    <UploadSimple size={22} /> {file ? file.name : 'Selecionar brasão'}
                    <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={event => setFile(event.target.files?.[0])} />
                </label>
                <p className="mt-2 text-xs text-gray-500">JPG, PNG ou WEBP, com até 4MB.</p>

                <div className="mt-7 flex justify-end"><button disabled={saving} className="rounded-md bg-blue-600 px-5 py-2.5 font-bold text-white hover:bg-blue-700 disabled:opacity-60">{saving ? 'Salvando...' : 'Salvar dados'}</button></div>
            </form>
        </div>
    </main>
}
