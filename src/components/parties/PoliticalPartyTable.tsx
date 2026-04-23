import type { PoliticalParty } from '../../types/PoliticalParty'

type PoliticalPartyTableProps = {
    parties: PoliticalParty[]
    loading?: boolean
}

export function PoliticalPartyTable({ parties, loading }: PoliticalPartyTableProps) {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <p className="text-gray-500">Carregando partidos políticos...</p>
            </div>
        )
    }

    if (parties.length === 0) {
        return (
            <div className="flex justify-center items-center py-8">
                <p className="text-gray-500">Nenhum partido político encontrado</p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                <thead className="bg-gray-100 border-b border-gray-300">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Logo</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Sigla</th>
                    </tr>
                </thead>
                <tbody>
                    {parties.map((party) => (
                        <tr key={party.id} className="border-b border-gray-300 hover:bg-gray-50">
                            <td className="px-6 py-3 text-sm">
                                {party.logo ? (
                                    <img
                                        src={party.logo}
                                        alt={`${party.name} logo`}
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-xs text-gray-500">Sem logo</span>
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-3 text-sm text-gray-900">{party.name}</td>
                            <td className="px-6 py-3 text-sm text-gray-900">{party.acronym}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}