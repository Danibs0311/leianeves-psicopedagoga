import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, User, Phone, Mail, FileText, Upload, Trash2, Clock, FilePlus, Save, Eye, X, Plus, ChevronDown, Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import Editor from 'react-simple-wysiwyg';

interface Patient {
    id: number;
    child_name: string;
    parent_name: string;
    cpf?: string;
    phone: string;
    email: string;
    notes: string;
    birth_date: string;
    created_at: string;
}

interface PatientDocument {
    id: number;
    title: string;
    description: string;
    file_url: string;
    file_type: string;
    created_at: string;
}

interface DocumentTemplate {
    id: number;
    title: string;
    category: string;
    content: string;
}

interface ClinicalRecord {
    id: number;
    title: string;
    content: string;
    date: string;
    created_at: string;
}

interface AdminPatientDetailProps {
    patientId: number;
    onBack: () => void;
}

const SIGNATURE = `
<div style="margin-top: 48px; text-align: center;">
    <div style="border-top: 1px solid #cbd5e1; width: 250px; margin: 0 auto 8px auto;"></div>
    <p style="font-weight: bold; color: #334155; margin: 0;">Léia Neves</p>
    <p style="color: #64748b; font-size: 0.875rem; margin: 0;">Psicopedagoga Especializada</p>
</div>
`;

const HEADER = `
<div style="text-align: center; margin-bottom: 32px;">
    <h3 style="font-weight: bold; font-size: 1.25rem; color: #1e293b; margin: 0;">Léia Neves</h3>
    <p style="color: #64748b; font-size: 0.875rem; margin: 0;">Psicopedagoga Especializada</p>
</div>
`;

const DEFAULT_TEMPLATES: DocumentTemplate[] = [
    {
        id: -1,
        title: 'Informe de Acompanhamento',
        category: 'Relatórios',
        content: `
${HEADER}
<h2 style="text-align: center; font-weight: bold; color: #1e293b; font-size: 1.125rem; margin-bottom: 24px;">INFORME DE ACOMPANHAMENTO</h2>
<p style="margin-bottom: 16px;">Informamos à (instituição, responsável ou interessado) que o paciente (aluno) <strong>[Nome do Paciente]</strong> está recebendo acompanhamento psicopedagógico especializado desde [Data], para avaliação e diagnóstico psicopedagógico.</p>
<p style="margin-bottom: 16px;">Este acompanhamento tem como objetivo investigar as dificuldades de aprendizagem e intervir de forma adequada para o desenvolvimento do paciente.</p>
<p style="margin-bottom: 16px;">Estamos à disposição para qualquer esclarecimento.</p>
<p style="margin-bottom: 32px;">Atenciosamente,</p>
<p style="margin-bottom: 16px;">[Local e Data]</p>
${SIGNATURE}
`
    },
    {
        id: -2,
        title: 'Ficha de Encaminhamento',
        category: 'Encaminhamentos',
        content: `
${HEADER}
<h2 style="text-align: center; font-weight: bold; color: #1e293b; font-size: 1.125rem; margin-bottom: 24px;">ENCAMINHAMENTO</h2>
<p style="margin-bottom: 16px;"><strong>Ao(À) Dr(a):</strong> [Nome do Profissional]</p>
<p style="margin-bottom: 16px;">Encaminho o(a) paciente/aprendente <strong>[Nome do Paciente]</strong>, que apresenta os seguintes dados subjetivos e objetivos mais relevantes ao motivo do encaminhamento:</p>
<div style="padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; margin-bottom: 16px; min-height: 100px;">(Descreva aqui as observações, sinais de alerta e condições especiais...)</div>
<p style="margin-bottom: 16px;">Estamos à disposição para qualquer esclarecimento.</p>
<p style="margin-bottom: 32px;">Atenciosamente,</p>
<p style="margin-bottom: 16px;">[Local e Data]</p>
${SIGNATURE}
`
    },
    {
        id: -3,
        title: 'Declaração de Acompanhamento',
        category: 'Declarações',
        content: `
${HEADER}
<h2 style="text-align: center; font-weight: bold; color: #1e293b; font-size: 1.125rem; margin-bottom: 24px;">DECLARAÇÃO DE ACOMPANHAMENTO</h2>
<p style="margin-bottom: 16px;">Declaro para os devidos fins que <strong>[Nome do Paciente]</strong>, aluno da instituição [Nome da Escola], está passando por processo de Acompanhamento Psicopedagógico neste estabelecimento, desde [Data de Início] às [Horário], para Avaliação e Prognóstico Psicopedagógico com suspeita de [Suspeita].</p>
<p style="margin-bottom: 16px;">Para melhor desempenho do mesmo, necessitamos do afastamento do Projeto/Atividade [Nome da Atividade] visto que tal ação demandará de habilidades as quais o referido acima não está apto para desenvolver até o devido momento.</p>
<p style="margin-bottom: 16px;">Certa de poder contar com vossa compreensão desde já agradeço. Por ser verdade, firmo o presente.</p>
<p style="margin-bottom: 32px;">Atenciosamente,</p>
<p style="margin-bottom: 16px;">[Local e Data]</p>
${SIGNATURE}
`
    },
    {
        id: -4,
        title: 'Relatório Psicopedagógico',
        category: 'Relatórios',
        content: `
${HEADER}
<h2 style="text-align: center; font-weight: bold; color: #1e293b; font-size: 1.125rem; margin-bottom: 24px;">RELATÓRIO PSICOPEDAGÓGICO</h2>
<p style="margin-bottom: 8px;"><strong>Paciente/Aprendente:</strong> [Nome]</p>
<p style="margin-bottom: 8px;"><strong>Responsável:</strong> [Nome do Responsável]</p>
<p style="margin-bottom: 16px;"><strong>Nascimento:</strong> [Data] | <strong>Escola:</strong> [Escola]</p>

<h3 style="font-weight: bold; color: #334155; margin-top: 24px; margin-bottom: 8px;">Objetivo</h3>
<p style="margin-bottom: 16px;">O presente relatório tem por objetivo atender pedido de [Solicitante], através do qual solicita diagnóstico para [Nome do Paciente].</p>

<h3 style="font-weight: bold; color: #334155; margin-top: 24px; margin-bottom: 8px;">Avaliação Diagnóstica</h3>
<p style="margin-bottom: 16px;">O paciente foi diagnosticado em [Data] pela psicopedagoga [Nome] através dos testes [Testes utilizados].</p>
<div style="padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; margin-bottom: 16px;">(Descreva os resultados dos testes e da observação comportamental...)</div>

<h3 style="font-weight: bold; color: #334155; margin-top: 24px; margin-bottom: 8px;">Conclusão</h3>
<div style="padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; margin-bottom: 16px;">(Descreva a conclusão da avaliação...)</div>

<p style="margin-bottom: 32px;">Atenciosamente,</p>
<p style="margin-bottom: 16px;">[Local e Data]</p>
${SIGNATURE}
`
    },
    {
        id: -5,
        title: 'Laudo Psicopedagógico',
        category: 'Laudos',
        content: `
${HEADER}
<h2 style="text-align: center; font-weight: bold; color: #1e293b; font-size: 1.125rem; margin-bottom: 24px;">LAUDO PSICOPEDAGÓGICO</h2>

<h3 style="font-weight: bold; color: #334155; margin-top: 24px; margin-bottom: 8px;">Descrição da Demanda</h3>
<div style="margin-bottom: 16px;">Em decorrência de...</div>

<h3 style="font-weight: bold; color: #334155; margin-top: 24px; margin-bottom: 8px;">Procedimento</h3>
<div style="margin-bottom: 16px;">Foram realizados entrevistas e aplicação de testes psicopedagógicos em [Nº] encontros de [Duração] hora de duração em dias alternados.</div>

<h3 style="font-weight: bold; color: #334155; margin-top: 24px; margin-bottom: 8px;">Análise</h3>
<div style="margin-bottom: 16px;">Nas primeiras sessões de avaliação, o(a) paciente/aprendente demonstrou...</div>

<h3 style="font-weight: bold; color: #334155; margin-top: 24px; margin-bottom: 8px;">Conclusão / Diagnóstico</h3>
<div style="padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; margin-bottom: 16px;">
    <p><strong>Diagnóstico:</strong> O paciente apresenta [Diagnóstico], CID-10: [Código].</p>
    <p><strong>Encaminhamentos:</strong> Encaminhado para tratamento [Tratamento] e acompanhamento [Acompanhamento].</p>
</div>

<p style="margin-bottom: 32px;">Atenciosamente,</p>
<p style="margin-bottom: 16px;">[Local e Data]</p>
${SIGNATURE}
`
    },
    {
        id: -6,
        title: 'História de Vida',
        category: 'Anamnese',
        content: `
${HEADER}
<h2 style="text-align: center; font-weight: bold; color: #1e293b; font-size: 1.125rem; margin-bottom: 24px;">HISTÓRIA DE VIDA</h2>
<p style="margin-bottom: 16px;"><strong>Data:</strong> [Data] | <strong>Nome do Paciente:</strong> [Nome] | <strong>Idade:</strong> [Idade]</p>

<h3 style="font-weight: bold; color: #334155; margin-top: 24px; margin-bottom: 8px;">Concepção e Gravidez</h3>
<div style="margin-bottom: 16px;">
    <p>Como era a família na época? [Resposta]</p>
    <p>Gravidez planejada? [Resposta]</p>
</div>

<h3 style="font-weight: bold; color: #334155; margin-top: 24px; margin-bottom: 8px;">Parto e Desenvolvimento</h3>
<div style="margin-bottom: 16px;">
    <p>Tipo de parto: [Normal/Cesárea]</p>
    <p>Desenvolvimento motor (sentou, andou): [Resposta]</p>
</div>

<h3 style="font-weight: bold; color: #334155; margin-top: 24px; margin-bottom: 8px;">Escolaridade</h3>
<div style="margin-bottom: 16px;">
    <p>Idade de entrada na escola: [Idade]</p>
    <p>Adaptação: [Resposta]</p>
</div>

${SIGNATURE}
`
    },
    {
        id: -8,
        title: 'EOCA (Entrevista Operativa)',
        category: 'Avaliação',
        content: `
${HEADER}
<h2 style="text-align: center; font-weight: bold; color: #1e293b; font-size: 1.125rem; margin-bottom: 24px;">EOCA</h2>
<p style="margin-bottom: 16px;"><strong>Nome:</strong> [Nome] | <strong>Idade:</strong> [Idade] | <strong>Data:</strong> [Data]</p>

<h3 style="font-weight: bold; color: #334155; margin-top: 24px; margin-bottom: 8px;">Consigna Inicial</h3>
<p style="font-style: italic; margin-bottom: 16px;">"Gostaria que você me mostrasse o que sabe fazer, o que lhe ensinaram e o que você aprendeu. Use este material como quiser."</p>

<h3 style="font-weight: bold; color: #334155; margin-top: 24px; margin-bottom: 8px;">Roteiro de Observação</h3>
<ul style="margin-bottom: 16px;">
    <li><strong>Temática:</strong> Fala muito/pouco, coerência...</li>
    <li><strong>Dinâmica:</strong> Tom de voz, atenção, organização...</li>
</ul>

<h3 style="font-weight: bold; color: #334155; margin-top: 24px; margin-bottom: 8px;">Observações Detalhadas</h3>
<div style="padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; margin-bottom: 16px; min-height: 150px;">
    (Registre aqui as observações sobre a postura, produto e comportamento...)
</div>

${SIGNATURE}
`
    },
    {
        id: -9,
        title: 'Autorização de Intervenção',
        category: 'Autorizações',
        content: `
${HEADER}
<h2 style="text-align: center; font-weight: bold; color: #1e293b; font-size: 1.125rem; margin-bottom: 24px;">AUTORIZAÇÃO PARA INTERVENÇÃO</h2>
<p style="margin-bottom: 16px;"><strong>Exmo(a) Sr(a) Encarregado(a) de Educação/Responsável:</strong></p>
<p style="margin-bottom: 16px;">Venho por este meio solicitar a V. Exa. a autorização para a efetuação de uma Intervenção Psicopedagógica junto do seu educando <strong>[Nome do Paciente]</strong>.</p>
<p style="margin-bottom: 16px;">Será sempre respeitada a confidencialidade dos dados acerca do educando.</p>
<p style="margin-bottom: 32px;">Atenciosamente,</p>
${SIGNATURE}
`
    },
    {
        id: -10,
        title: 'Devolutiva',
        category: 'Relatórios',
        content: `
${HEADER}
<h2 style="text-align: center; font-weight: bold; color: #1e293b; font-size: 1.125rem; margin-bottom: 24px;">DEVOLUTIVA</h2>

<p style="margin-bottom: 16px;"><strong>Paciente:</strong> [Nome] | <strong>Data:</strong> [Data]</p>

<h3 style="font-weight: bold; color: #334155; margin-top: 24px; margin-bottom: 8px;">Resumo da Avaliação</h3>
<div style="margin-bottom: 16px;">O paciente foi encaminhado com a queixa: [Queixa].</div>

<h3 style="font-weight: bold; color: #334155; margin-top: 24px; margin-bottom: 8px;">Recomendações</h3>
<div style="margin-bottom: 16px;">
    <p><strong>À Escola:</strong> [Orientações]</p>
    <p><strong>À Família:</strong> [Orientações]</p>
</div>

<h3 style="font-weight: bold; color: #334155; margin-top: 24px; margin-bottom: 8px;">Conclusão</h3>
<p style="margin-bottom: 16px;">Conclui-se que o paciente necessita de [Reavaliação/Acompanhamento].</p>

<p style="margin-bottom: 32px;">Atenciosamente,</p>
${SIGNATURE}
`
    }
];

interface PatientAnamnesis {
    id: number;
    created_at: string;
    answers: Record<string, any>;
}

export const AdminPatientDetail: React.FC<AdminPatientDetailProps> = ({ patientId, onBack }) => {
    const [patient, setPatient] = useState<Patient | null>(null);
    const [documents, setDocuments] = useState<PatientDocument[]>([]);
    const [anamnesis, setAnamnesis] = useState<PatientAnamnesis | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'info' | 'anamnesis' | 'docs' | 'history'>('info');
    const [appointments, setAppointments] = useState<any[]>([]);
    const [templates, setTemplates] = useState<DocumentTemplate[]>(DEFAULT_TEMPLATES);
    const [clinicalRecords, setClinicalRecords] = useState<ClinicalRecord[]>([]);

    // Editor State
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
    const [editorContent, setEditorContent] = useState('');
    const [editorTitle, setEditorTitle] = useState('');
    const [editingRecordId, setEditingRecordId] = useState<number | null>(null);
    const editorRef = useRef<HTMLDivElement>(null);

    // UI State
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [notesValue, setNotesValue] = useState('');

    useEffect(() => {
        if (patientId) {
            fetchPatientData();
        }

        const channel = supabase
            .channel('patient-detail-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'clinical_records', filter: `patient_id=eq.${patientId}` },
                () => fetchPatientData()
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'patients', filter: `id=eq.${patientId}` },
                () => fetchPatientData()
            )
            .subscribe();

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        // Inject Global Print Styles
        const style = document.createElement('style');
        style.innerHTML = `
            @media print {
                body { background: white !important; margin: 0 !important; padding: 0 !important; }
                #root > div > div:not(.print-modal-container), 
                #root > div > main:not(.print-modal-container),
                .print\\:hidden { 
                    display: none !important; 
                }
                .print-modal-container { 
                    position: fixed !important; 
                    top: 0 !important; 
                    left: 0 !important; 
                    width: 100% !important; 
                    height: 100% !important; 
                    z-index: 99999 !important; 
                    background: white !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
            }
        `;
        document.head.appendChild(style);

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            supabase.removeChannel(channel);
            document.head.removeChild(style);
        };
    }, [patientId]);

    const fetchPatientData = async () => {
        setLoading(true);
        try {
            const { data: patientData, error: patientError } = await supabase
                .from('patients')
                .select('*')
                .eq('id', patientId)
                .single();

            if (patientError) throw patientError;
            setPatient(patientData);
            setNotesValue(patientData.notes || '');

            // Fetch Anamnesis
            const { data: anamnesisData } = await supabase
                .from('patient_anamnesis')
                .select('*')
                .eq('patient_id', patientId)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (anamnesisData) setAnamnesis(anamnesisData);

            const { data: docsData } = await supabase
                .from('patient_documents')
                .select('*')
                .eq('patient_id', patientId)
                .order('created_at', { ascending: false });

            if (docsData) setDocuments(docsData);

            const { data: recordsData } = await supabase
                .from('clinical_records')
                .select('*')
                .eq('patient_id', patientId)
                .order('created_at', { ascending: false });

            if (recordsData) setClinicalRecords(recordsData);

            let historyQuery = supabase
                .from('appointments')
                .select('*')
                .order('preferred_date', { ascending: false });

            if (patientData.cpf) {
                historyQuery = historyQuery.eq('cpf', patientData.cpf);
            } else {
                historyQuery = historyQuery
                    .eq('child_name', patientData.child_name)
                    .eq('parent_name', patientData.parent_name);
            }

            const { data: historyData } = await historyQuery;
            setAppointments(historyData || []);

        } catch (error) {
            console.error('Error loading patient data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenEditor = (template?: DocumentTemplate) => {
        setIsViewMode(false);
        setEditingRecordId(null);
        if (template) {
            setSelectedTemplate(template);
            setEditorTitle(template.title);
            setEditorContent(template.content);
        } else {
            setSelectedTemplate(null);
            setEditorTitle('');
            setEditorContent('');
        }
        setIsEditorOpen(true);
        setIsDropdownOpen(false);
    };

    const handleViewDocument = (record: ClinicalRecord) => {
        setIsViewMode(true);
        setEditingRecordId(null);
        setSelectedTemplate(null);
        setEditorTitle(record.title);
        setEditorContent(record.content);
        setIsEditorOpen(true);
    };

    const handleEditDocument = (record: ClinicalRecord) => {
        setIsViewMode(false);
        setEditingRecordId(record.id);
        setSelectedTemplate(null);
        setEditorTitle(record.title);
        setEditorContent(record.content);
        setIsEditorOpen(true);
    };

    const handleDeleteDocument = async (id: number) => {
        if (!window.confirm('Tem certeza que deseja excluir este documento permanentemente?')) return;

        // Atualização Otimista
        setClinicalRecords(prev => prev.filter(r => r.id !== id));

        try {
            const { error } = await supabase
                .from('clinical_records')
                .delete()
                .eq('id', id);

            if (error) {
                fetchPatientData(); // Reverter
                throw error;
            }
        } catch (error) {
            console.error('Error deleting document:', error);
            alert('Erro ao excluir documento. Verifique as permissões de deleção.');
            fetchPatientData();
        }
    };

    const handleSaveDocument = async () => {
        if (!patient) return;
        if (!editorTitle.trim()) {
            alert('Por favor, insira um título para o documento.');
            return;
        }

        try {
            if (!patient.id) throw new Error("Paciente inválido");

            if (editingRecordId) {
                const { error } = await supabase
                    .from('clinical_records')
                    .update({
                        title: editorTitle,
                        content: editorContent
                    })
                    .eq('id', editingRecordId);

                if (error) throw error;
                alert('Documento atualizado com sucesso!');
            } else {
                const { error } = await supabase
                    .from('clinical_records')
                    .insert({
                        patient_id: patient.id,
                        template_id: (selectedTemplate && selectedTemplate.id > 0) ? selectedTemplate.id : null,
                        title: editorTitle,
                        content: editorContent,
                        date: new Date().toISOString().split('T')[0]
                    });

                if (error) throw error;
                alert('Documento salvo com sucesso!');
            }

            // Forçar atualização dos dados para garantir que a UI reflita as mudanças
            await fetchPatientData();

            setIsEditorOpen(false);
            setEditingRecordId(null);

        } catch (error) {
            console.error('Error saving document:', error);
            alert('Erro ao salvar documento. Verifique a conexão ou se a tabela existe.');
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !patient) return;

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `patient-${patient.id}/${fileName}`;

            // 1. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('patient-documents')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('patient-documents')
                .getPublicUrl(filePath);

            // 3. Save reference in database
            const { error: dbError } = await supabase
                .from('patient_documents')
                .insert({
                    patient_id: patient.id,
                    title: file.name,
                    file_url: publicUrl,
                    file_type: file.type,
                    description: 'Documento enviado por upload'
                });

            if (dbError) throw dbError;

            alert('Arquivo enviado com sucesso!');
            fetchPatientData();
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Erro ao enviar arquivo. Certifique-se que o bucket "patient-documents" existe no Supabase e tem permissões públicas.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDeleteUploadedDoc = async (id: number, fileUrl: string) => {
        if (!window.confirm('Tem certeza que deseja excluir este anexo permanentemente?')) return;

        try {
            // Extair o path do Storage a partir da URL (simplificado)
            const urlParts = fileUrl.split('/');
            const fileName = urlParts[urlParts.length - 1];
            const folderName = urlParts[urlParts.length - 2];
            const filePath = `${folderName}/${fileName}`;

            // 1. Delete from Storage
            await supabase.storage
                .from('patient-documents')
                .remove([filePath]);

            // 2. Delete from Database
            const { error } = await supabase
                .from('patient_documents')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchPatientData();
        } catch (error) {
            console.error('Error deleting uploaded doc:', error);
            alert('Erro ao excluir documento.');
        }
    };

    const handleRenameUploadedDoc = async (id: number, currentTitle: string) => {
        const newTitle = window.prompt('Digite o novo nome para o documento:', currentTitle);
        if (!newTitle || newTitle === currentTitle) return;

        try {
            const { error } = await supabase
                .from('patient_documents')
                .update({ title: newTitle })
                .eq('id', id);

            if (error) throw error;
            fetchPatientData();
        } catch (error) {
            console.error('Error renaming doc:', error);
            alert('Erro ao renomear documento.');
        }
    };

    const handleSaveNotes = async () => {
        if (!patient) return;
        try {
            const { error } = await supabase
                .from('patients')
                .update({ notes: notesValue })
                .eq('id', patient.id);

            if (error) throw error;
            setPatient({ ...patient, notes: notesValue });
            setIsEditingNotes(false);
            alert('Anotações atualizadas!');
        } catch (error) {
            console.error('Error updating notes:', error);
            alert('Erro ao salvar anotações.');
        }
    };

    const handleExportPDF = (record?: ClinicalRecord) => {
        if (record) {
            setIsViewMode(true);
            setEditingRecordId(null);
            setSelectedTemplate(null);
            setEditorTitle(record.title);
            setEditorContent(record.content);
            setIsEditorOpen(true);
            // Delay print to allow modal to render
            setTimeout(() => {
                window.print();
            }, 500);
        } else {
            window.print();
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-20">
                <div className="animate-spin w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!patient) return null;

    if (isEditorOpen) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto print-modal-container">
                <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col h-[95vh] print:h-auto print:w-full print:max-w-none print:shadow-none print:rounded-none print:static">
                    {/* Modal Header */}
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-2xl flex-shrink-0 print:hidden">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Título do Documento</label>
                            {isViewMode ? (
                                <h2 className="text-xl font-bold text-slate-800">{editorTitle}</h2>
                            ) : (
                                <input
                                    type="text"
                                    value={editorTitle}
                                    onChange={(e) => setEditorTitle(e.target.value)}
                                    className="w-full text-xl font-bold bg-transparent border-none focus:ring-0 p-0 text-slate-800 placeholder-slate-400"
                                    placeholder="Nome do Documento"
                                />
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setIsEditorOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Modal Content - Editor */}
                    <div className="flex-1 overflow-y-auto bg-slate-100 flex justify-center p-8 print:p-0 print:bg-white print:overflow-visible">
                        <div className="bg-white shadow-lg min-h-[1123px] w-[794px] mx-auto rounded-sm border border-slate-200 flex flex-col relative prose max-w-none print:shadow-none print:border-none print:w-full print:min-h-0">
                            {isViewMode ? (
                                <div
                                    className="flex-1 p-12 outline-none"
                                    dangerouslySetInnerHTML={{ __html: editorContent }}
                                />
                            ) : (
                                <Editor
                                    value={editorContent}
                                    onChange={(e: any) => setEditorContent(e.target.value)}
                                    containerProps={{
                                        style: {
                                            minHeight: '1000px',
                                            padding: '24px',
                                            border: 'none',
                                            resize: 'none',
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="p-6 border-t border-slate-200 bg-white rounded-b-2xl flex justify-between items-center flex-shrink-0 print:hidden">
                        <p className="text-slate-500 text-sm">
                            {isViewMode ? 'Modo de Leitura (Não editável)' : editingRecordId ? 'Editando documento existente' : (selectedTemplate ? `Modelo: ${selectedTemplate.title}` : 'Novo documento')}
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsEditorOpen(false)} className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors">
                                Fechar
                            </button>
                            {!isViewMode && (
                                <button onClick={handleSaveDocument} className="px-6 py-2 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-colors flex items-center gap-2">
                                    <Save size={20} />
                                    Salvar Documento
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{patient.child_name}</h2>
                    <p className="text-slate-500 text-sm">
                        Prontuário Digital
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200 mb-6 overflow-x-auto pb-1">
                <button
                    onClick={() => setActiveTab('info')}
                    className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap
                    ${activeTab === 'info' ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                    Informações Gerais
                </button>
                <button
                    onClick={() => setActiveTab('anamnesis')}
                    className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap flex items-center gap-2
                    ${activeTab === 'anamnesis' ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                    <List size={16} /> Triagem / Anamnese
                    {anamnesis && <span className="bg-sky-100 text-sky-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">1</span>}
                </button>
                <button
                    onClick={() => setActiveTab('docs')}
                    className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap
                    ${activeTab === 'docs' ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                    Documentos
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap
                    ${activeTab === 'history' ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                    Histórico de Sessões
                </button>
            </div>

            {/* Content Info */}
            {activeTab === 'info' && (
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <User size={20} className="text-sky-600" />
                            Dados Pessoais
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Responsável</label>
                                <p className="text-slate-700 font-medium">{patient.parent_name}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">CPF (Responsável)</label>
                                <p className="text-slate-700 font-medium">{patient.cpf || 'Não informado'}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Data de Nascimento</label>
                                <p className="text-slate-700 font-medium">{patient.birth_date ? new Date(patient.birth_date).toLocaleDateString('pt-BR') : 'Não informada'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Phone size={20} className="text-sky-600" />
                            Contato
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Telefone / WhatsApp</label>
                                <p className="text-slate-700 font-medium flex items-center gap-2">
                                    <Phone size={14} />
                                    {patient.phone || 'Não informado'}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">E-mail</label>
                                <p className="text-slate-700 font-medium flex items-center gap-2">
                                    <Mail size={14} />
                                    {patient.email || 'Não informado'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-full bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800">Anotações Gerais</h3>
                            {!isEditingNotes ? (
                                <button
                                    onClick={() => setIsEditingNotes(true)}
                                    className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                                    title="Editar Anotações"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setIsEditingNotes(false);
                                            setNotesValue(patient.notes || '');
                                        }}
                                        className="px-3 py-1 text-slate-500 hover:bg-slate-100 rounded-lg text-sm font-bold transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSaveNotes}
                                        className="px-3 py-1 bg-sky-600 text-white hover:bg-sky-700 rounded-lg text-sm font-bold transition-colors flex items-center gap-1"
                                    >
                                        <Save size={14} />
                                        Salvar
                                    </button>
                                </div>
                            )}
                        </div>

                        {isEditingNotes ? (
                            <textarea
                                value={notesValue}
                                onChange={(e) => setNotesValue(e.target.value)}
                                className="w-full min-h-[150px] p-4 bg-white border border-sky-100 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent text-slate-700 leading-relaxed outline-none transition-all"
                                placeholder="Digite aqui observações gerais sobre o paciente..."
                            />
                        ) : (
                            <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 min-h-[100px] whitespace-pre-wrap">
                                {patient.notes || 'Nenhuma anotação registrada.'}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Content Anamnesis */}
            {activeTab === 'anamnesis' && (
                <div className="space-y-6">
                    {!anamnesis ? (
                        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-10 text-center text-slate-500">
                            <List className="mx-auto mb-3 text-slate-400 opacity-50" size={48} />
                            <h3 className="font-bold text-slate-700 mb-1">Nenhuma ficha de triagem preenchida</h3>
                            <p className="text-sm">Os responsáveis ainda não enviaram as informações prévias pelo formulário do site.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 bg-sky-50 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-sky-900 text-lg flex items-center gap-2">
                                        <List size={20} className="text-sky-600" />
                                        Respostas da Triagem Digital
                                    </h3>
                                    <p className="text-sm text-sky-700">Preenchido em: {new Date(anamnesis.created_at).toLocaleString('pt-BR')}</p>
                                </div>
                            </div>

                            <div className="p-6 grid gap-6 md:grid-cols-2">
                                {/* GESTAÇÃO */}
                                <div className="space-y-4">
                                    <h4 className="font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs">1</div>
                                        Gestação e Nascimento
                                    </h4>
                                    <div className="grid gap-3">
                                        <div className="bg-slate-50 p-3 items-center rounded-lg border border-slate-100">
                                            <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Como foi a gestação</span>
                                            <span className="font-medium text-slate-700">{anamnesis.answers.pregnancyType || '-'}</span>
                                        </div>
                                        <div className="bg-slate-50 p-3 items-center rounded-lg border border-slate-100">
                                            <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Tipo de Parto</span>
                                            <span className="font-medium text-slate-700">{anamnesis.answers.birthType || '-'}</span>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Complicações</span>
                                            <span className="text-slate-700">{anamnesis.answers.birthComplications || '-'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* DESENVOLVIMENTO */}
                                <div className="space-y-4">
                                    <h4 className="font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">2</div>
                                        Desenvolvimento
                                    </h4>
                                    <div className="grid gap-3">
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Motor (Andou/Engatinhou)</span>
                                            <span className="font-medium text-slate-700">{anamnesis.answers.motorDevelopment || '-'}</span>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Desenvolvimento da Fala</span>
                                            <span className="font-medium text-slate-700">{anamnesis.answers.speechDevelopment || '-'}</span>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Desfralde</span>
                                            <span className="font-medium text-slate-700">{anamnesis.answers.sphincterControl || '-'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* ESCOLA */}
                                <div className="space-y-4 md:col-span-2">
                                    <h4 className="font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs">3</div>
                                        Vida Escolar
                                    </h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="grid gap-3">
                                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Escola Atual</span>
                                                <span className="font-medium text-slate-700">{anamnesis.answers.schoolName || '-'}</span>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Série / Ano</span>
                                                <span className="font-medium text-slate-700">{anamnesis.answers.currentGrade || '-'}</span>
                                            </div>
                                        </div>
                                        <div className="grid gap-3">
                                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Desempenho</span>
                                                <span className="text-slate-700 italic">"{anamnesis.answers.schoolPerformance || '-'}"</span>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Comportamento na Lição C/ Casa</span>
                                                <span className="text-slate-700 italic">"{anamnesis.answers.homeworkBehavior || '-'}"</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* SAÚDE / OUTROS */}
                                <div className="space-y-4 md:col-span-2">
                                    <h4 className="font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">4</div>
                                        Saúde e Observações Livres
                                    </h4>
                                    <div className="grid md:grid-cols-3 gap-4 mb-3">
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Qualidade do Sono</span>
                                            <span className="text-slate-700">{anamnesis.answers.sleepQuality || '-'}</span>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Alimentação</span>
                                            <span className="text-slate-700">{anamnesis.answers.eatingHabits || '-'}</span>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <span className="block text-xs uppercase font-bold text-slate-400 mb-1">Medicamentos / Alergias</span>
                                            <span className="text-slate-700">{anamnesis.answers.allergiesOrMedications || '-'}</span>
                                        </div>
                                    </div>
                                    {anamnesis.answers.additionalNotes && (
                                        <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 text-sky-900">
                                            <span className="block text-xs uppercase font-bold text-sky-700 mb-2">Informações Adicionais Fornecidas</span>
                                            <p className="italic">"{anamnesis.answers.additionalNotes}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Content Docs */}
            {activeTab === 'docs' && (
                <div className="space-y-8">
                    {/* Actions Header */}
                    <div className="flex gap-4 mb-4">
                        {/* Dropdown "Novo Documento" */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="px-6 py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-colors flex items-center gap-2 shadow-sm"
                            >
                                <FilePlus size={20} />
                                Novo Documento
                                <ChevronDown size={16} className={`transition-transformDuration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-10 max-h-96 overflow-y-auto">
                                    <div className="p-2">
                                        <div className="text-xs font-bold text-slate-400 uppercase px-3 py-2">Selecione um Modelo</div>
                                        {templates.map(template => (
                                            <button
                                                key={template.id}
                                                onClick={() => handleOpenEditor(template)}
                                                className="w-full text-left px-3 py-3 hover:bg-sky-50 rounded-lg text-slate-700 text-sm font-medium transition-colors flex flex-col"
                                            >
                                                <span className="text-slate-800">{template.title}</span>
                                                <span className="text-xs text-slate-400 font-normal">{template.category}</span>
                                            </button>
                                        ))}
                                        <div className="border-t border-slate-100 my-1"></div>
                                        <button
                                            onClick={() => handleOpenEditor()}
                                            className="w-full text-left px-3 py-3 hover:bg-slate-50 rounded-lg text-slate-600 text-sm font-medium transition-colors flex items-center gap-2"
                                        >
                                            <Plus size={16} />
                                            Documento em Branco
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Upload Button */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileUpload}
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                        >
                            {isUploading ? <div className="animate-spin w-5 h-5 border-2 border-sky-600 border-t-transparent rounded-full" /> : <Upload size={20} />}
                            {isUploading ? 'Enviando...' : 'Upload de Documento'}
                        </button>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Saved Documents List */}
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-sky-600" />
                            Documentos Salvos
                        </h3>

                        <div className="grid gap-4">
                            {clinicalRecords.length === 0 && documents.length === 0 ? (
                                <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    Nenhum documento encontrado.
                                </div>
                            ) : (
                                <>
                                    {/* Clinical Records (Generated) */}
                                    {clinicalRecords.map(rec => (
                                        <div key={`rec-${rec.id}`} className="bg-white p-5 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                                    <FileText size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800 text-lg">{rec.title}</h4>
                                                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={14} />
                                                            {new Date(rec.created_at).toLocaleString('pt-BR')}
                                                        </span>
                                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                        <span className="text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded text-xs">Documento Digital</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleExportPDF(rec)}
                                                    className="px-3 py-2 text-slate-600 bg-slate-50 font-bold rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-2 text-sm"
                                                    title="Exportar PDF/Imprimir"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                                </button>
                                                <button
                                                    onClick={() => handleViewDocument(rec)}
                                                    className="px-4 py-2 text-sky-600 bg-sky-50 font-bold rounded-lg hover:bg-sky-100 transition-colors flex items-center gap-2 text-sm"
                                                    title="Visualizar"
                                                >
                                                    <Eye size={16} />
                                                    <span className="hidden sm:inline">Visualizar</span>
                                                </button>
                                                <button
                                                    onClick={() => handleEditDocument(rec)}
                                                    className="px-3 py-2 text-slate-600 bg-slate-50 font-bold rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-2 text-sm"
                                                    title="Editar"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteDocument(rec.id)}
                                                    className="px-3 py-2 text-red-500 bg-red-50 font-bold rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2 text-sm"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Uploaded Files (Legacy) */}
                                    {documents.map(doc => (
                                        <div key={`doc-${doc.id}`} className="bg-white p-5 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                                    <Upload size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800 text-lg">{doc.title}</h4>
                                                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={14} />
                                                            {new Date(doc.created_at).toLocaleString('pt-BR')}
                                                        </span>
                                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                        <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded text-xs">Arquivo Anexo</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <a
                                                    href={doc.file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-2 text-sky-600 bg-sky-50 font-bold rounded-lg hover:bg-sky-100 transition-colors flex items-center gap-2 text-sm"
                                                    title="Download"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                                </a>
                                                <button
                                                    onClick={() => handleRenameUploadedDoc(doc.id, doc.title)}
                                                    className="px-3 py-2 text-slate-600 bg-slate-50 font-bold rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-2 text-sm"
                                                    title="Renomear"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUploadedDoc(doc.id, doc.file_url)}
                                                    className="px-3 py-2 text-red-500 bg-red-50 font-bold rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2 text-sm"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Content History */}
            {activeTab === 'history' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        {appointments.length === 0 ? (
                            <div className="text-center py-10 text-slate-400">
                                Nenhum atendimento registrado para este paciente.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 font-bold text-slate-600 text-xs uppercase tracking-wider">Data / Hora</th>
                                            <th className="px-6 py-4 font-bold text-slate-600 text-xs uppercase tracking-wider">Queixa</th>
                                            <th className="px-6 py-4 font-bold text-slate-600 text-xs uppercase tracking-wider text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {appointments.map(app => (
                                            <tr key={app.id} className="hover:bg-sky-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-800 text-sm">
                                                            {(() => {
                                                                // Ensure we only take the date part to avoid UTC shifts
                                                                const datePart = app.preferred_date.substring(0, 10);
                                                                const [year, month, day] = datePart.split('-').map(Number);
                                                                return new Date(year, month - 1, day).toLocaleDateString('pt-BR');
                                                            })()}
                                                        </span>
                                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                                            <Clock size={12} />
                                                            {app.preferred_time}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-slate-600 truncate max-w-[200px]" title={app.concern}>{app.concern}</p>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                                        ${app.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                                            app.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                                app.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {app.status === 'completed' ? 'Concluído' :
                                                            app.status === 'confirmed' ? 'Confirmado' :
                                                                app.status === 'cancelled' ? 'Cancelado' :
                                                                    app.status === 'pending' ? 'Pendente' : app.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
