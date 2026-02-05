

# Plano: Criar Pagina de Aniversariantes de Tempo de Clube

## Objetivo

Criar uma nova pagina para listar os aniversariantes de tempo de clube, usando a data de cadastro (registration_date) para calcular quantos anos o socio esta completando no clube. A implementacao seguira o mesmo padrao da pagina de aniversariantes de nascimento.

## Estrutura Atual

O projeto possui:
- `MemberBirthdays.tsx` - pagina de aniversariantes (modelo a seguir)
- `useMemberBirthdaysFullYear.ts` - hook que busca aniversarios por mes
- Tabela `members` com campo `registration_date` para data de cadastro

## Arquivos a Criar

### 1. Hook para buscar aniversarios de clube

**Arquivo:** `src/hooks/useMemberClubAnniversariesFullYear.ts`

```text
+-- useMemberClubAnniversariesFullYear.ts
    - Busca todos os membros ativos com registration_date
    - Agrupa por mes (1-12) baseado na data de cadastro
    - Calcula anos de clube (ano atual - ano de cadastro)
    - Ordena por dia dentro de cada mes
    - Retorna: id, name, nickname, registration_date, photo_url, day, month, years
```

### 2. Pagina de aniversariantes de tempo de clube

**Arquivo:** `src/pages/MemberClubAnniversaries.tsx`

Baseada em MemberBirthdays.tsx com as seguintes diferencas:

```text
+-- MemberClubAnniversaries.tsx
    |
    +-- Cabecalho: "Aniversariantes de Clube"
    |   - Descricao: "Socios completando anos de clube"
    |
    +-- Seletor de mes (com opcao "Todos os meses")
    |
    +-- Botao "Gerar Mensagem" para WhatsApp
    |
    +-- Tabela com colunas:
    |   - Foto/Avatar
    |   - Nome
    |   - Apelido
    |   - Anos de Clube (ex: "5 anos")
    |   - Data (DD/MM)
    |
    +-- Badge "Hoje!" para quem completa aniversario hoje
    |
    +-- Icone: Award (trofeu) ao inves de Cake
    |
    +-- Card de mensagem gerada (WhatsApp)
```

### Formato da Mensagem WhatsApp

```text
🏆 Aniversariantes de Clube de Fevereiro - Nome do Clube

🎊 05/02 - Joao Silva (10 anos)
🎊 12/02 - Maria Santos (5 anos)
🎊 20/02 - Pedro Costa (3 anos)

Parabens pelos anos de dedicacao ao clube! 🎉⚽
```

## Arquivos a Modificar

### 1. Menu de Socios

**Arquivo:** `src/components/AdminLayout.tsx`

Adicionar novo item no submenu de "Socios":

```text
Socios (submenu)
├── Novo Socio
├── Lista de Socios
├── Perfil de Socios
├── Estatisticas de Socios
├── Aniversariantes
├── Aniversariantes de Clube  <-- NOVO ITEM
└── Patrocinador
```

Usar icone `Award` para representar tempo de clube.

### 2. Rotas

**Arquivo:** `src/App.tsx`

Adicionar rota protegida:

```text
/members/club-anniversaries --> MemberClubAnniversaries
```

## Detalhes Tecnicos

### Hook useMemberClubAnniversariesFullYear

```typescript
interface MemberClubAnniversary {
  id: string;
  name: string;
  nickname: string | null;
  registration_date: string;
  photo_url: string | null;
  day: number;
  month: number;
  years: number; // Anos de clube
}

// Query Supabase
supabase
  .from('members')
  .select('id, name, nickname, registration_date, photo_url')
  .eq('club_id', clubId)
  .eq('status', 'Ativo')
  .not('registration_date', 'is', null)
```

### Calculo de Anos de Clube

```typescript
const registrationDate = new Date(member.registration_date);
const currentYear = new Date().getFullYear();
const yearsInClub = currentYear - registrationDate.getFullYear();
```

## Fluxo de Dados

```text
MemberClubAnniversaries (pagina)
    |
    +-- useMemberClubAnniversariesFullYear (hook)
        |
        +-- supabase.from('members')
            - Filtra por club_id e status Ativo
            - Exclui membros sem registration_date
            - Agrupa por mes da registration_date
            - Calcula anos de clube
```

## Resumo de Arquivos

| Acao | Arquivo |
|------|---------|
| Criar | `src/hooks/useMemberClubAnniversariesFullYear.ts` |
| Criar | `src/pages/MemberClubAnniversaries.tsx` |
| Modificar | `src/components/AdminLayout.tsx` |
| Modificar | `src/App.tsx` |

## Resultado Final

O usuario podera:
1. Acessar menu Socios > Aniversariantes de Clube
2. Ver lista de socios organizados por mes de cadastro
3. Ver quantos anos cada socio esta completando
4. Navegar entre os meses ou ver todos os meses
5. Identificar quem completa aniversario hoje
6. Gerar mensagem formatada para WhatsApp
7. Compartilhar a mensagem diretamente no WhatsApp

