

# Plano: Adicionar Compartilhamento de Aniversariantes via WhatsApp

## Objetivo

Adicionar funcionalidade de gerar e compartilhar mensagem de aniversariantes via WhatsApp na pagina de aniversariantes, seguindo o mesmo padrao visual e comportamento da pagina de alertas de ausencia.

## Modelo de Referencia

A pagina `GameAbsenceAlerts.tsx` (linhas 138-175) possui:
1. Estado `generatedMessage` para armazenar a mensagem
2. Funcao `generateWhatsAppMessage()` para criar o texto
3. Funcao `shareViaWhatsApp()` para abrir o WhatsApp
4. Botao "Gerar Alerta" no cabecalho
5. Card com preview da mensagem e botao "Compartilhar no WhatsApp"

## Arquivo a Modificar

`src/pages/MemberBirthdays.tsx`

## Alteracoes Necessarias

### 1. Adicionar imports necessarios

```typescript
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Share2 } from 'lucide-react';
```

### 2. Adicionar estado e hooks

```typescript
const { toast } = useToast();
const { user } = useAuth();
const [generatedMessage, setGeneratedMessage] = useState('');
```

### 3. Criar funcao para gerar mensagem

```typescript
const generateBirthdayMessage = () => {
  if (selectedMonthBirthdays.length === 0) {
    toast({
      title: "Sem Aniversariantes",
      description: `Nao ha aniversariantes em ${selectedMonthName}.`,
      variant: "destructive"
    });
    return;
  }

  const intro = `🎂 Aniversariantes de ${selectedMonthName} - ${user?.activeClub?.name}\n\n`;
  
  const birthdayList = selectedMonthBirthdays
    .map(member => {
      const displayName = member.nickname || member.name;
      return `🎈 ${String(member.day).padStart(2, '0')}/${selectedMonth.padStart(2, '0')} - ${displayName}`;
    })
    .join('\n');

  const outro = `\n\nParabens a todos! 🎉🥳`;
  
  setGeneratedMessage(`${intro}${birthdayList}${outro}`);
  
  toast({
    title: "Mensagem Gerada!",
    description: "A mensagem esta pronta para ser compartilhada.",
  });
};
```

### 4. Criar funcao para compartilhar no WhatsApp

```typescript
const shareViaWhatsApp = () => {
  if (!generatedMessage) {
    toast({
      title: "Sem mensagem",
      description: "Gere a mensagem primeiro antes de compartilhar.",
      variant: "destructive"
    });
    return;
  }

  const message = encodeURIComponent(generatedMessage);
  window.open(`https://wa.me/?text=${message}`, '_blank');
};
```

### 5. Adicionar botao no cabecalho

Adicionar botao "Gerar Mensagem" ao lado do seletor de mes:

```typescript
<Button
  onClick={generateBirthdayMessage}
  disabled={selectedMonthBirthdays.length === 0}
  variant="outline"
  className="gap-2"
>
  <Share2 className="h-4 w-4" />
  Gerar Mensagem
</Button>
```

### 6. Adicionar card com preview da mensagem

Apos a tabela de aniversariantes, adicionar o card de preview (mesmo padrao do GameAbsenceAlerts):

```typescript
{generatedMessage && (
  <Card className="mt-4">
    <CardHeader>
      <CardTitle>Mensagem Gerada</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="whitespace-pre-wrap p-4 bg-gray-100 dark:bg-gray-800 rounded">
          {generatedMessage}
        </div>
        <Button onClick={shareViaWhatsApp} className="w-full">
          <Share2 className="h-4 w-4 mr-2" />
          Compartilhar no WhatsApp
        </Button>
      </div>
    </CardContent>
  </Card>
)}
```

## Formato da Mensagem

```text
🎂 Aniversariantes de Janeiro - Nome do Clube

🎈 05/01 - Apelido1
🎈 12/01 - Apelido2
🎈 20/01 - Nome3
🎈 28/01 - Apelido4

Parabens a todos! 🎉🥳
```

## Estrutura Visual Final

```text
+-- Cabecalho
|   +-- Titulo "Aniversariantes"
|   +-- Seletor de mes
|   +-- Botao "Gerar Mensagem"
|
+-- Card Aniversariantes
|   +-- Tabela com lista
|
+-- Card Mensagem Gerada (condicional)
    +-- Preview da mensagem
    +-- Botao "Compartilhar no WhatsApp"
```

## Resultado Esperado

O usuario podera:
1. Selecionar o mes desejado
2. Clicar em "Gerar Mensagem" para criar o texto
3. Visualizar o preview da mensagem
4. Clicar em "Compartilhar no WhatsApp" para enviar

