
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
            </div>
        );
    }

    if (!user) {
        // Se não estiver logado, continua na página (Admin cuidará do Login) 
        // OU redireciona para Home se quisermos ser estritos.
        // Neste caso, como a página Admin TEM o formulário de login, 
        // vamos deixar renderizar, mas o componente Admin vai decidir o que mostrar.
        // ESPERA! O plano original era "Protect Admin Route".
        // Se usarmos ProtectedRoute envolvendo Admin, e o usuário não estiver logado,
        // ele nunca verá o form de login se redirecionarmos.

        // CORREÇÃO DE ESTRATÉGIA:
        // A página Admin.tsx atual TEM o form de login embutido.
        // A melhor abordagem para "auth real" é:
        // Se não logado -> Mostra Login (dentro de Admin ou redireciona pra /login)
        // Se logado -> Mostra Dashboard

        // Vamos manter a lógica dentro de Admin.tsx por enquanto para simplificar a rota,
        // mas vamos usar o AuthContext lá.
        // Então, ProtectedRoute pode não ser estritamente necessário se Admin.tsx gerenciar isso,
        // MAS é boa prática ter.

        // Vamos fazer assim: O ProtectedRoute redireciona para /login se criarmos uma rota separada.
        // Como não temos rota /login separada, o Admin.tsx vai agir como Login + Dashboard.
        // Então, por hora, NÃO usaremos ProtectedRoute no App.tsx, mas sim consumiremos o Auth no Admin.

        return <>{children}</>;
    }

    return <>{children}</>;
};
