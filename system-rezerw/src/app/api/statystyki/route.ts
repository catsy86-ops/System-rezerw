// ============================================================
// API — /api/statystyki  (GET)
// ============================================================

import { NextResponse } from 'next/server';
import { getAllReservations, getAllServices, getAllClients } from '@/lib/db';
import { getTodayString, getWeekRange, getMonthRange, getLast7Days } from '@/lib/formatters';
import type { DashboardStats } from '@/types';

export async function GET() {
  try {
    const reservations = getAllReservations();
    const services = getAllServices();

    const today = getTodayString();
    const { start: weekStart, end: weekEnd } = getWeekRange();
    const { start: monthStart, end: monthEnd } = getMonthRange();

    const todayBookings = reservations.filter(r =>
      r.date === today && r.status !== 'anulowana'
    ).length;

    const weekBookings = reservations.filter(r =>
      r.date >= weekStart && r.date <= weekEnd && r.status !== 'anulowana'
    ).length;

    const monthRevenue = reservations
      .filter(r => r.date >= monthStart && r.date <= monthEnd && r.status === 'zakonczona')
      .reduce((sum, r) => sum + r.servicePrice, 0);

    // Nowi klienci w tym miesiącu
    const clients = getAllClients();
    const newClients = clients.filter(c => {
      const created = c.createdAt.slice(0, 10);
      return created >= monthStart && created <= monthEnd;
    }).length;

    const confirmedBookings = reservations.filter(r => r.status === 'potwierdzona').length;
    const cancelledBookings = reservations.filter(r => r.status === 'anulowana').length;
    const completedBookings = reservations.filter(r => r.status === 'zakonczona').length;

    // Ostatnie 6 rezerwacji
    const recentReservations = [...reservations]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 6);

    // Popularne usługi
    const serviceCount: Record<string, number> = {};
    reservations.forEach(r => {
      if (r.status !== 'anulowana') {
        serviceCount[r.serviceId] = (serviceCount[r.serviceId] || 0) + 1;
      }
    });

    const popularServices = Object.entries(serviceCount)
      .map(([sid, count]) => ({
        service: services.find(s => s.id === sid)!,
        count,
      }))
      .filter(e => e.service)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Przychód przez ostatnie 7 dni
    const last7 = getLast7Days();
    const revenueByDay = last7.map(date => ({
      date,
      revenue: reservations
        .filter(r => r.date === date && r.status === 'zakonczona')
        .reduce((sum, r) => sum + r.servicePrice, 0),
    }));

    const stats: DashboardStats = {
      todayBookings,
      weekBookings,
      monthRevenue,
      newClients,
      totalBookings: reservations.length,
      confirmedBookings,
      cancelledBookings,
      completedBookings,
      recentReservations,
      popularServices,
      revenueByDay,
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Błąd pobierania statystyk' }, { status: 500 });
  }
}
