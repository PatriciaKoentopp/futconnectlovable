

# Plano: Criar Pagina de Aniversariantes por Mes

## Objetivo

Criar uma nova rotina no menu "Socios" para listar os aniversariantes do clube organizados por mes, permitindo visualizar todos os 12 meses do ano.

## Estrutura Atual

O projeto ja possui:
- Hook `useMemberBirthdays.ts` - busca aniversarios do mes atual ate dezembro
- Componente `BirthdayCard.tsx` - exibe aniversariantes em formato de card compacto
- Menu de Socios em `AdminLayout.tsx` com submenu

## Alteracoes Necessarias

### 1. Criar novo hook para buscar aniversarios do ano completo

**Arquivo:** `src/hooks/useMemberBirthdaysFullYear.ts`

O hook atual (`useMemberBirthdays`) filtra apenas do mes atual ate dezembro. O novo hook buscara aniversariantes de todos os 12 meses para uma visualizacao completa.

```text
+-- useMemberBirthdaysFullYear.ts
    - Busca todos os membros ativos com data de nascimento
    - Agrupa por mes (1-12)
    - Ordena por dia dentro de cada mes
    - Retorna dados com apelido e foto do socio
```

### 2. Criar pagina de listagem de aniversariantes

**Arquivo:** `src/pages/MemberBirthdays.tsx`

Uma pagina completa com:

```text
+-- MemberBirthdays.tsx
    |
    +-- Cabecalho com titulo "Aniversariantes"
    |
    +-- Seletor de mes (dropdown ou abas)
    |
    +-- Tabela com colunas:
    |   - Foto/Avatar
    |   - Nome
    |   - Apelido
    |   - Dia do aniversario
    |
    +-- Indicador visual para aniversariante de hoje
    |
    +-- Contador de aniversariantes por mes
```

### 3. Adicionar item no menu de Socios

**Arquivo:** `src/components/AdminLayout.tsx`

Adicionar novo item no submenu de "Socios":

```text
Socios (submenu atual)
├── Novo Socio
├── Lista de Socios
├── Perfil de Socios
├── Estatisticas de Socios
├── Aniversariantes  <-- NOVO ITEM
└── Patrocinador
```

### 4. Adicionar rota no App.tsx

**Arquivo:** `src/App.tsx`

Nova rota protegida:

```text
/members/birthdays --> MemberBirthdays
```

## Detalhes Tecnicos

### Hook useMemberBirthdaysFullYear

```typescript
// Busca membros ativos com birth_date
// Inclui: id, name, nickname, birth_date, photo_url
// Agrupa por mes (1-12)
// Ordena por dia dentro de cada mes
```

### Componentes utilizados

- `Card` e `Table` do shadcn/ui para layout
- `Avatar` para fotos dos socios
- `Badge` para destacar aniversariante de hoje
- `Select` para selecao de mes

### Fluxo de dados

```text
MemberBirthdays (pagina)
    |
    +-- useMemberBirthdaysFullYear (hook)
        |
        +-- supabase.from('members')
            .select('id, name, nickname, birth_date, photo_url')
            .eq('club_id', clubId)
            .eq('status', 'Ativo')
            .not('birth_date', 'is', null)
```

## Arquivos a Criar

| Arquivo | Descricao |
|---------|-----------|
| `src/hooks/useMemberBirthdaysFullYear.ts` | Hook para buscar aniversarios do ano |
| `src/pages/MemberBirthdays.tsx` | Pagina de listagem de aniversariantes |

## Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/AdminLayout.tsx` | Adicionar item "Aniversariantes" no submenu Socios |
| `src/App.tsx` | Adicionar rota `/members/birthdays` |

## Resultado Final

O usuario podera:
1. Acessar o menu Socios > Aniversariantes
2. Ver lista de todos os aniversariantes organizados por mes
3. Navegar entre os meses do ano
4. Identificar facilmente aniversariantes do dia atual
5. Ver contagem de aniversariantes por mes

