import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface MemberClubAnniversary {
  id: string;
  name: string;
  nickname: string | null;
  registration_date: string;
  photo_url: string | null;
  day: number;
  month: number;
  years: number;
}

interface ClubAnniversariesByMonth {
  [month: number]: MemberClubAnniversary[];
}

export const useMemberClubAnniversariesFullYear = () => {
  const { user } = useAuth();
  const clubId = user?.activeClub?.id;

  return useQuery({
    queryKey: ['member-club-anniversaries-full-year', clubId],
    queryFn: async (): Promise<ClubAnniversariesByMonth> => {
      if (!clubId) return {};

      const { data, error } = await supabase
        .from('members')
        .select('id, name, nickname, registration_date, photo_url')
        .eq('club_id', clubId)
        .eq('status', 'Ativo')
        .not('registration_date', 'is', null);

      if (error) throw error;

      const currentYear = new Date().getFullYear();
      const anniversariesByMonth: ClubAnniversariesByMonth = {};

      // Initialize all months
      for (let i = 1; i <= 12; i++) {
        anniversariesByMonth[i] = [];
      }

      // Group members by registration month
      data?.forEach((member) => {
        if (member.registration_date) {
          const date = new Date(member.registration_date);
          const month = date.getMonth() + 1; // JavaScript months are 0-indexed
          const day = date.getDate();
          const registrationYear = date.getFullYear();
          const years = currentYear - registrationYear;

          anniversariesByMonth[month].push({
            ...member,
            day,
            month,
            years,
          });
        }
      });

      // Sort each month's array by day
      Object.keys(anniversariesByMonth).forEach((month) => {
        anniversariesByMonth[Number(month)].sort((a, b) => a.day - b.day);
      });

      return anniversariesByMonth;
    },
    enabled: !!clubId,
  });
};
