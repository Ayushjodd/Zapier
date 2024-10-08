import express from "express";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const app = express();

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
  const userId = req.params.userId;
  const zapId = req.params.zapId;

  await client.$transaction(async (tx) => {
    const run = await client.zapRun.create({
      data: {
        zapId: zapId,
        metadata: {},
      },
    });
    await client.zapRunOutbox.create({
      data: {
        zapRunId: run.id,
      },
    });

    res.json({
      message: "created",
    });
  });
});
