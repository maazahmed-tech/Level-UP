export const dynamic = "force-dynamic";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserDetailClient from "./UserDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminUserDetailPage({ params }: Props) {
  const { id } = await params;
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      mealLogs: { orderBy: { loggedDate: "desc" }, take: 30 },
      weightLogs: { orderBy: { loggedDate: "desc" }, take: 90 },
      progressPhotos: { orderBy: { photoDate: "desc" }, take: 20 },
      macroTarget: true,
      favourites: { include: { recipe: true } },
      stepLogs: { orderBy: { loggedDate: "desc" }, take: 30 },
      bodyMeasurements: { orderBy: { loggedDate: "desc" }, take: 10 },
    },
  });

  if (!user) redirect("/admin/users");

  // Fetch last 20 messages involving this user
  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: id }, { receiverId: id }],
    },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      sender: { select: { firstName: true, lastName: true } },
      receiver: { select: { firstName: true, lastName: true } },
    },
  });

  // Fetch notifications for this user
  const notifications = await prisma.notification.findMany({
    where: { userId: id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Serialize dates for client component
  const serialized = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    country: user.country || "",
    role: user.role,
    plan: user.plan,
    planStatus: user.planStatus,
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
    lastLoginAt: user.lastLoginAt?.toISOString() || null,
    paymentScreenshot: user.paymentScreenshot || null,
    paymentAccountName: user.paymentAccountName || null,
    paymentTransactionRef: user.paymentTransactionRef || null,
    // Health profile
    age: user.age,
    gender: user.gender,
    heightCm: user.heightCm,
    currentWeightKg: user.currentWeightKg,
    bodyFatPercent: user.bodyFatPercent,
    fitnessGoal: user.fitnessGoal,
    activityLevel: user.activityLevel,
    dietaryPrefs: user.dietaryPrefs,
    healthConditions: user.healthConditions,
    targetWeightKg: user.targetWeightKg,
    macroTarget: user.macroTarget
      ? {
          calories: user.macroTarget.calories,
          protein: user.macroTarget.protein,
          carbs: user.macroTarget.carbs,
          fat: user.macroTarget.fat,
          goal: user.macroTarget.goal,
        }
      : null,
    mealLogs: user.mealLogs.map((m) => ({
      id: m.id,
      description: m.description,
      mealType: m.mealType,
      calories: m.calories,
      protein: m.protein,
      carbs: m.carbs,
      fat: m.fat,
      loggedDate: m.loggedDate.toISOString(),
      loggedTime: m.loggedTime,
      imageData: m.imageData || null,
      ingredients: m.ingredients || null,
    })),
    weightLogs: user.weightLogs.map((w) => ({
      id: w.id,
      weightKg: w.weightKg,
      loggedDate: w.loggedDate.toISOString(),
    })),
    progressPhotos: user.progressPhotos.map((p) => ({
      id: p.id,
      imageData: p.imageData,
      photoDate: p.photoDate.toISOString(),
      notes: p.notes || "",
    })),
    favourites: user.favourites.map((f) => ({
      id: f.id,
      recipe: {
        id: f.recipe.id,
        title: f.recipe.title,
        slug: f.recipe.slug,
        calories: f.recipe.calories,
        protein: f.recipe.protein,
      },
    })),
    stepLogs: user.stepLogs.map((s) => ({
      id: s.id,
      steps: s.steps,
      goal: s.goal,
      loggedDate: s.loggedDate.toISOString(),
    })),
    bodyMeasurements: user.bodyMeasurements.map((b) => ({
      id: b.id,
      loggedDate: b.loggedDate.toISOString(),
      weightKg: b.weightKg,
      bellyInches: b.bellyInches,
      chestInches: b.chestInches,
      waistInches: b.waistInches,
      hipsInches: b.hipsInches,
      armsInches: b.armsInches,
    })),
    messages: messages.map((m) => ({
      id: m.id,
      content: m.content,
      isRead: m.isRead,
      createdAt: m.createdAt.toISOString(),
      senderName: `${m.sender.firstName} ${m.sender.lastName}`,
      receiverName: `${m.receiver.firstName} ${m.receiver.lastName}`,
      isSentByUser: m.senderId === id,
    })),
    notifications: notifications.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type,
      isRead: n.isRead,
      createdAt: n.createdAt.toISOString(),
    })),
  };

  return <UserDetailClient user={serialized} />;
}
