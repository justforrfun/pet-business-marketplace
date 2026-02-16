import { supabase } from '@/lib/supabaseClient';

/**
 * 포인트 적립 후 등급 자동 업데이트
 */
export async function addPointAndUpdateGrade(memberId: number, amount: number) {
  // 1. 현재 포인트 조회
  const { data: member, error: memberError } = await supabase
    .from('member')
    .select('point')
    .eq('id', memberId)
    .single();

  if (memberError || !member) return;

  const newPoint = member.point + amount;

  // 2. 새 포인트에 해당하는 등급 조회 (min_point 이하 중 가장 높은 등급)
  const { data: grade, error: gradeError } = await supabase
    .from('grade')
    .select('id')
    .lte('min_point', newPoint)
    .order('min_point', { ascending: false })
    .limit(1)
    .single();

  if (gradeError || !grade) return;

  // 3. 포인트 + 등급 업데이트
  await supabase
    .from('member')
    .update({ point: newPoint, grade_id: grade.id })
    .eq('id', memberId);
}
