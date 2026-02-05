import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface MemberBirthday {
  id: string;
  name: string;
  nickname: string | null;
  birth_date: string;
  photo_url: string | null;
  day: number;
  month: number;
}

interface BirthdaysByMonth {
  [month: number]: MemberBirthday[];
}

export const useMemberBirthdaysFullYear = () => {
  const { user } = useAuth();
  const clubId = user?.activeClub?.id;

  return useQuery({
    queryKey: ['member-birthdays-full-year', clubId],
    queryFn: async (): Promise<BirthdaysByMonth> => {
      if (!clubId) return {};

      const { data, error } = await supabase
        .from('members')
        .select('id, name, nickname, birth_date, photo_url')
        .eq('club_id', clubId)
        .eq('status', 'Ativo')
        .not('birth_date', 'is', null);

      if (error) throw error;

      const birthdaysByMonth: BirthdaysByMonth = {};

      // Initialize all months
      for (let i = 1; i <= 12; i++) {
        birthdaysByMonth[i] = [];
      }

      // Group members by birth month
      data?.forEach((member) => {
        if (member.birth_date) {
          const date = new Date(member.birth_date);
          const month = date.getMonth() + 1; // JavaScript months are 0-indexed
          const day = date.getDate();

          birthdaysByMonth[month].push({
            ...member,
            day,
            month,
          });
        }
      });

      // Sort each month's array by day
      Object.keys(birthdaysByMonth).forEach((month) => {
        birthdaysByMonth[Number(month)].sort((a, b) => a.day - b.day);
      });

      return birthdaysByMonth;
    },
    enabled: !!clubId,
  });
};
