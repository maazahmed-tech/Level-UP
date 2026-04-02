export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboard() {
  const totalUsers = await prisma.user.count({ where: { role: "USER" } });
  const newThisMonth = await prisma.user.count({
    where: {
      role: "USER",
      createdAt: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    },
  });
  const activeUsers = await prisma.user.count({
    where: {
      lastLoginAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
  });
  const hubUsersCount = await prisma.user.count({
    where: { planStatus: "ACTIVE", plan: "HUB" },
  });
  const revenue = hubUsersCount * 79;
  const pendingApprovals = await prisma.user.count({
    where: { planStatus: "PENDING" },
  });
  const totalRecipes = await prisma.recipe.count();
  const totalMealLogs = await prisma.mealLog.count();
  const totalPosts = await prisma.post.count();

  const recentUsers = await prisma.user.findMany({
    where: { role: "USER" },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      firstName: true,
      lastName: true,
      createdAt: true,
      plan: true,
    },
  });

  return (
    <AdminDashboardClient
      stats={{
        totalUsers,
        newThisMonth,
        activeUsers,
        revenue,
        pendingApprovals,
        totalRecipes,
        totalMealLogs,
        totalPosts,
      }}
      recentUsers={recentUsers.map(
        (u: {
          firstName: string;
          lastName: string;
          createdAt: Date;
          plan: string;
        }) => ({
          firstName: u.firstName,
          lastName: u.lastName,
          createdAt: u.createdAt.toISOString(),
          plan: u.plan,
        })
      )}
    />
  );
}
