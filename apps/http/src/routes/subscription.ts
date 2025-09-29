import { Router, type Request, type Response } from "express"
import { z } from "zod"
import prisma from "../lib/prisma"
import { authMiddleware } from "../middleware/auth"
import { prepareTransferTx } from "../lib/solana"
import { SUBSCRIPTION_PLANS, getPlanByTier, getSolPrice, calculateSolAmount } from "../lib/subscription"

const router = Router()
router.use(authMiddleware)

// Get current subscription
router.get("/", async (req: Request, res: Response) => {
  try {
    const pubKey = req.user!.pubKey
    const user = await prisma.user.findUnique({
      where: { pubKey },
      include: {
        subscriptions: {
          where: { active: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const currentSubscription = user.subscriptions[0]
    const tier = currentSubscription?.tier || "free"
    const plan = getPlanByTier(tier)

    // Calculate storage usage
    const files = await prisma.file.findMany({
      where: { userId: user.id, deleted: false },
      select: { size: true },
    })

    const storageUsed = files.reduce((total, file) => total + file.size, BigInt(0))

    res.json({
      subscription: currentSubscription || {
        tier: "free",
        active: true,
        startDate: user.createdAt,
        endDate: null,
      },
      plan: {
        ...plan,
        storageLimit: plan.storageLimit.toString(),
      },
      storageLimit: plan.storageLimit.toString(),
      storageUsed: storageUsed.toString(),
    })
  } catch (error) {
    console.error("Get subscription error:", error)
    res.status(500).json({
      error: "Failed to fetch subscription",
      details: (error as Error).message,
    })
  }
})

// Get all available plans with SOL pricing
router.get("/plans", async (req: Request, res: Response) => {
  try {
    const solPrice = await getSolPrice()

    const plansWithSolPrices = SUBSCRIPTION_PLANS.map((plan) => ({
      ...plan,
      storageLimit: plan.storageLimit.toString(),
      monthlySolPrice: plan.monthlyPriceUSD > 0 ? calculateSolAmount(plan.monthlyPriceUSD, solPrice) : 0,
      yearlySolPrice: plan.yearlyPriceUSD > 0 ? calculateSolAmount(plan.yearlyPriceUSD, solPrice) : 0,
      solPrice,
    }))

    res.json({ plans: plansWithSolPrices, solPrice })
  } catch (error) {
    console.error("Get plans error:", error)
    res.status(500).json({
      error: "Failed to fetch plans",
      details: (error as Error).message,
    })
  }
})

// Subscribe to a plan
const subscribeSchema = z.object({
  tier: z.enum(["basic", "pro", "enterprise"]),
  period: z.enum(["monthly", "yearly"]),
})

router.post("/subscribe", async (req: Request, res: Response) => {
  try {
    const { tier, period } = subscribeSchema.parse(req.body)
    const pubKey = req.user!.pubKey

    const user = await prisma.user.findUnique({ where: { pubKey } })
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const plan = getPlanByTier(tier)
    const solPrice = await getSolPrice()
    const usdAmount = period === "monthly" ? plan.monthlyPriceUSD : plan.yearlyPriceUSD
    const solAmount = calculateSolAmount(usdAmount, solPrice)

    // Calculate end date
    const endDate = new Date()
    if (period === "monthly") {
      endDate.setMonth(endDate.getMonth() + 1)
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1)
    }

    // Prepare Solana transaction
    const tx = await prepareTransferTx(pubKey, solAmount)
    const txSerialized = tx
      .serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      })
      .toString("base64")

    // Create pending subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        tier: tier as any,
        period: period as any,
        endDate,
        active: false,
        amount: solAmount,
      },
    })

    res.json({
      txSerialized,
      subscriptionId: subscription.id,
      amount: solAmount,
      usdAmount,
      solPrice,
    })
  } catch (error) {
    console.error("Subscribe error:", error)
    res.status(500).json({
      error: "Subscription failed",
      details: (error as Error).message,
    })
  }
})

// Confirm subscription payment
const confirmSchema = z.object({
  subscriptionId: z.number(),
  signature: z.string(),
})

router.post("/confirm", async (req: Request, res: Response) => {
  try {
    const { subscriptionId, signature } = confirmSchema.parse(req.body)
    const pubKey = req.user!.pubKey

    const user = await prisma.user.findUnique({ where: { pubKey } })
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    // Deactivate old subscriptions
    await prisma.subscription.updateMany({
      where: { userId: user.id, active: true },
      data: { active: false },
    })

    // Activate new subscription
    const subscription = await prisma.subscription.update({
      where: { id: subscriptionId, userId: user.id },
      data: {
        active: true,
        transactionSignature: signature,
        startDate: new Date(),
      },
    })

    res.json({ success: true, subscription })
  } catch (error) {
    console.error("Confirm subscription error:", error)
    res.status(500).json({
      error: "Confirmation failed",
      details: (error as Error).message,
    })
  }
})

// Get storage usage
router.get("/storage", async (req: Request, res: Response) => {
  try {
    const pubKey = req.user!.pubKey
    const user = await prisma.user.findUnique({
      where: { pubKey },
      include: {
        subscriptions: {
          where: { active: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const currentSubscription = user.subscriptions[0]
    const tier = currentSubscription?.tier || "free"
    const plan = getPlanByTier(tier)

    const files = await prisma.file.findMany({
      where: { userId: user.id, deleted: false },
      select: { size: true },
    })

    const used = files.reduce((total, file) => total + file.size, BigInt(0))

    res.json({
      used: used.toString(),
      limit: plan.storageLimit.toString(),
      tier,
      percentage: Math.min(Number((used * BigInt(100)) / plan.storageLimit), 100),
    })
  } catch (error) {
    console.error("Get storage error:", error)
    res.status(500).json({
      error: "Failed to fetch storage",
      details: (error as Error).message,
    })
  }
})

// Get payment history
router.get("/history", async (req: Request, res: Response) => {
  try {
    const pubKey = req.user!.pubKey
    const user = await prisma.user.findUnique({ where: { pubKey } })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const history = await prisma.subscription.findMany({
      where: {
        userId: user.id,
        transactionSignature: { not: null },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    })

    const formattedHistory = history.map((sub) => ({
      id: sub.id.toString(),
      amount: sub.amount || 0,
      tier: sub.tier,
      period: sub.period,
      transactionId: sub.transactionSignature,
      createdAt: sub.createdAt.toISOString(),
      status: "completed",
    }))

    res.json(formattedHistory)
  } catch (error) {
    console.error("Get payment history error:", error)
    res.status(500).json({
      error: "Failed to get payment history",
      details: (error as Error).message,
    })
  }
})

export default router
