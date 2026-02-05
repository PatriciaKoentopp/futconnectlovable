import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Cake, Calendar } from 'lucide-react';
import { useMemberBirthdaysFullYear } from '@/hooks/useMemberBirthdaysFullYear';

const MONTHS = [
  { value: '1', label: 'Janeiro' },
  { value: '2', label: 'Fevereiro' },
  { value: '3', label: 'Março' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Maio' },
  { value: '6', label: 'Junho' },
  { value: '7', label: 'Julho' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
];

const MemberBirthdays = () => {
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth.toString());
  
  const { data: birthdaysByMonth, isLoading } = useMemberBirthdaysFullYear();

  const selectedMonthBirthdays = birthdaysByMonth?.[Number(selectedMonth)] || [];
  const selectedMonthName = MONTHS.find(m => m.value === selectedMonth)?.label || '';

  const isBirthdayToday = (day: number, month: number) => {
    return day === currentDay && month === currentMonth;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Aniversariantes</h1>
          <p className="text-gray-500">Lista de aniversariantes do clube por mês</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o mês" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((month) => {
                const count = birthdaysByMonth?.[Number(month.value)]?.length || 0;
                return (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label} {count > 0 && `(${count})`}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cake className="h-5 w-5 text-primary" />
            Aniversariantes de {selectedMonthName}
            <Badge variant="secondary" className="ml-2">
              {selectedMonthBirthdays.length} {selectedMonthBirthdays.length === 1 ? 'sócio' : 'sócios'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : selectedMonthBirthdays.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Cake className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum aniversariante em {selectedMonthName}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Foto</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Apelido</TableHead>
                  <TableHead className="text-center w-[100px]">Dia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedMonthBirthdays.map((member) => {
                  const isToday = isBirthdayToday(member.day, member.month);
                  return (
                    <TableRow 
                      key={member.id}
                      className={isToday ? 'bg-primary/5' : ''}
                    >
                      <TableCell>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.photo_url || ''} alt={member.name} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {member.name}
                        {isToday && (
                          <Badge className="ml-2 bg-primary">
                            🎂 Hoje!
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {member.nickname || '-'}
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {String(member.day).padStart(2, '0')}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberBirthdays;
