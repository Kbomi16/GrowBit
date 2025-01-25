import type { NextApiRequest, NextApiResponse } from 'next'
import admin from 'firebase-admin'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { title, body, token } = req.body

    const message = {
      notification: {
        title: title,
        body: body,
      },
      token: token,
    }

    try {
      const response = await admin.messaging().send(message)
      res.status(200).json({ success: true, response })
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Error sending notification', details: error })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
