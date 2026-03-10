import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { User, Phone, Search, ChevronRight, FolderOpen, Trash2, Edit2, X, Save, Mail } from 'lucide-react';

interface Patient {
    id: number;
    child_name: string;
    parent_name: string;
    phone: string;
    email: string;
    created_at: string;
    status: string;
}

interface AdminPatientsProps {
    onSelectPatient: (patientId: number) => void;
}

export const AdminPatients: React.FC<AdminPatientsProps> = ({ onSelectPatient }) => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

    useEffect(() => {
        fetchPatients();

        const channel = supabase
            .channel('patients-list-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'patients' },
                () => {
                    fetchPatients();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('patients')
                .select('*')
                .neq('status', 'prospect')
                .order('child_name', { ascending: true });

            if (error) throw error;
            if (data) setPatients(data);
        } catch (error) {
            console.error('Error fetching patients:', error);
            alert('Erro ao carregar lista de pacientes');
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = patients.filter(p =>
        p.child_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.parent_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeletePatient = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('Tem certeza que deseja excluir ESTE PACIENTE permanentemente? Todos os agendamentos, fichas de triagem e prontuários vinculados serão perdidos!')) return;

        try {
            const { error } = await supabase
                .from('patients')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting patient:', error);
            alert('Erro ao excluir paciente. Verifique as permissões.');
        }
    };

    const handleEditClick = (patient: Patient, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingPatient({ ...patient });
        setIsEditModalOpen(true);
    };

    const handleSavePatient = async () => {
        if (!editingPatient) return;

        try {
            const { error } = await supabase
                .from('patients')
                .update({
                    child_name: editingPatient.child_name,
                    parent_name: editingPatient.parent_name,
                    phone: editingPatient.phone,
                    email: editingPatient.email,
                })
                .eq('id', editingPatient.id);

            if (error) throw error;
            setIsEditModalOpen(false);
            setEditingPatient(null);
        } catch (error) {
            console.error('Error updating patient:', error);
            alert('Erro ao atualizar dados do paciente.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-20">
                <div className="animate-spin w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Meus Atendimentos</h2>
                    <p className="text-slate-500">Gerencie os prontuários e documentos de seus pacientes.</p>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar paciente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                    />
                </div>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {filteredPatients.length === 0 ? (
                    <div className="text-center py-20">
                        <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">Nenhum paciente encontrado.</p>
                        <p className="text-slate-400 text-sm mt-1">Conclua um agendamento para gerar um novo paciente cadastrado.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-slate-600 text-xs uppercase tracking-wider">Paciente</th>
                                    <th className="px-6 py-4 font-bold text-slate-600 text-xs uppercase tracking-wider">Responsável</th>
                                    <th className="px-6 py-4 font-bold text-slate-600 text-xs uppercase tracking-wider">Contato</th>
                                    <th className="px-6 py-4 font-bold text-slate-600 text-xs uppercase tracking-wider text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredPatients.map((patient) => (
                                    <tr
                                        key={patient.id}
                                        onClick={() => onSelectPatient(patient.id)}
                                        className="hover:bg-sky-50 transition-colors cursor-pointer group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center font-bold text-sm">
                                                    {patient.child_name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-slate-800">{patient.child_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-slate-600">{patient.parent_name}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                    <Phone size={14} className="text-slate-400" />
                                                    {patient.phone}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                    <span className="text-xs text-slate-400 px-1.5 py-0.5 bg-slate-100 rounded">Email</span>
                                                    {patient.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={(e) => handleEditClick(patient, e)}
                                                    className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeletePatient(patient.id, e)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-100 rounded-lg transition-colors">
                                                    <ChevronRight size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && editingPatient && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 bg-sky-50 flex justify-between items-center">
                            <h3 className="font-bold text-sky-900 text-lg flex items-center gap-2">
                                <Edit2 size={20} className="text-sky-600" />
                                Editar Paciente
                            </h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-sky-100 rounded-full text-sky-700 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Nome do Paciente</label>
                                <input
                                    type="text"
                                    value={editingPatient.child_name}
                                    onChange={(e) => setEditingPatient({ ...editingPatient, child_name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Nome do Responsável</label>
                                <input
                                    type="text"
                                    value={editingPatient.parent_name}
                                    onChange={(e) => setEditingPatient({ ...editingPatient, parent_name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Telefone</label>
                                    <input
                                        type="text"
                                        value={editingPatient.phone || ''}
                                        onChange={(e) => setEditingPatient({ ...editingPatient, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">E-mail</label>
                                    <input
                                        type="email"
                                        value={editingPatient.email || ''}
                                        onChange={(e) => setEditingPatient({ ...editingPatient, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button onClick={() => setIsEditModalOpen(false)} className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors">
                                Cancelar
                            </button>
                            <button onClick={handleSavePatient} className="px-6 py-2 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-colors flex items-center gap-2">
                                <Save size={20} />
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
