const express = require("express");
const PAYPAY = require("@paypayopa/paypayopa-sdk-node");
const app = express();
const cors = require("cors");

const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'https://paypay-integration.vercel.app',
  methods: ['GET,POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

PAYPAY.Configure({
  clientId: "a_ZyXlznntc3_4oZk",
  clientSecret: "/6UWRDjGEIHURyjk/52oy+1GzdRt719lqNWMOx1xJmU=",
  merchantId: "823219629258997760",
  productionMode: false,
});


app.post("/create-qrcode", (req, res) => {
  const payload = {
    merchantPaymentId: req.body.merchantPaymentId,
    amount: {
      amount: req.body.amount,
      currency: req.body.currency,
    },
    codeType: "ORDER_QR",
    orderDescription: req.body.orderDescription,
    isAuthorization: false,
    redirectUrl: req.body.redirectUrl,
    redirectType: "WEB_LINK",
    userAgent: req.body.userAgent,
  };

  PAYPAY.QRCodeCreate(payload, (response) => {
    if (response && response.BODY.resultInfo.code === "SUCCESS") {
      res.status(200).json({ qrCodeURL: response.BODY.data.url });
    } else {
      res.status(400).json({ error: "Failed to generate QR code" });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
