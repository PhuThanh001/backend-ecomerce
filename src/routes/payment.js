const express = require("express");
const moment = require("moment");
const qs = require("qs");
const crypto = require("crypto");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const router = express.Router();

// Lấy cấu hình từ .env
const vnp_TmnCode = process.env.VNP_TMN_CODE;
const vnp_HashSecret = process.env.VNP_HASH_SECRET;
const vnp_Url = process.env.VNP_URL;
const vnp_Api = process.env.VNP_API;
const vnp_ReturnUrl = process.env.VNP_RETURN_URL;



/**
 * 🛠 Hàm sort object theo yêu cầu VNPay
 */
// function sortObject(obj) {
//   const sorted = {};
//   Object.keys(obj).sort().forEach(key => {
//     sorted[key] = obj[key];
//   });
//   return sorted;
// }
// Hàm sắp xếp tham số theo thứ tự bảng chữ cái
function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
/**
 * 🛠 Hàm tạo hash
 */
// function createSecureHash(data, secretKey) {
//   return crypto.createHmac("sha512", secretKey).update(data).digest("hex");
// }
// Hàm tạo chữ ký HMAC-SHA512
function createSecureHash(signData, secretKey) {
  return crypto.createHmac('sha512', secretKey)
    .update(Buffer.from(signData, 'utf8'))
    .digest('hex');
}
/**
 * GET /
 */
router.get("/", (req, res) => {
  res.json({ message: "Danh sách đơn hàng" });
});



router.post("/create_payment_url", (req, res) => {
  try {
    // Thiết lập múi giờ
    process.env.TZ = 'Asia/Ho_Chi_Minh';

    // Lấy thời gian hiện tại và định dạng
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const orderId = moment(date).format('DDHHmmss');

    // Lấy địa chỉ IP
    const ipAddr = req.headers['x-forwarded-for'] ||
                   req.connection.remoteAddress ||
                   req.socket.remoteAddress ||
                   req.connection.socket.remoteAddress ||
                   '127.0.0.1';

    // Lấy cấu hình từ process.env
    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_HASH_SECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURN_URL;

    // Lấy dữ liệu từ request body
    const amount = parseFloat(req.body.amount);
    const bankCode = req.body.bankCode || '';
    const locale = req.body.language || 'vn';
    const currCode = 'VND';

    // Kiểm tra đầu vào
    if (!tmnCode || !secretKey || !vnpUrl || !returnUrl) {
      throw new Error("Missing environment variables");
    }
    if (!amount || isNaN(amount) || amount <= 0) {
      throw new Error("Invalid amount");
    }



    // Tạo object vnp_Params
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = Math.round(amount * 100); // Nhân 100 và làm tròn
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode) {
      vnp_Params['vnp_BankCode'] = bankCode;
    }


    // Sắp xếp params
    vnp_Params = sortObject(vnp_Params);

    // Tạo chuỗi ký
    const querystring = require('qs');
    const signData = querystring.stringify(vnp_Params, { encode: false });

    // Tạo chữ ký
    const crypto = require("crypto");
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

    // Thêm chữ ký vào params
    vnp_Params['vnp_SecureHash'] = signed;

    // Tạo URL thanh toán
    const paymentUrl = vnpUrl + '?' + querystring.stringify(vnp_Params, { encode: false });


    // Trả về JSON
    res.json({ code: "00", data: paymentUrl });
  } catch (err) {
    console.error("Error creating payment URL:", err.message);
    res.status(500).json({ code: "99", message: `Lỗi tạo payment URL: ${err.message}` });
  }
});
/**
 * GET /vnpay_return
 */
// router.get('/vnpay_return', function (req, res, next) {
//     const vnp_Params = req.query;

//     const secureHash = vnp_Params['vnp_SecureHash'];

//     delete vnp_Params['vnp_SecureHash'];
//     delete vnp_Params['vnp_SecureHashType'];

//     vnp_Params = sortObject(vnp_Params);

//     const tmnCode = process.env.VNP_TMN_CODE;
//     const secretKey = process.env.VNP_HASH_SECRET;

//     const querystring = require('qs');
//     const signData = querystring.stringify(vnp_Params, { encode: false });
//     const crypto = require("crypto");     
//     const hmac = crypto.createHmac("sha512", secretKey);
//     const signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     

//     if(secureHash === signed){
//         //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

//         res.render('success', {code: vnp_Params['vnp_ResponseCode']})
//     } else{
//         res.render('success', {code: '97'})
//     }
// });
// router.get('/vnpay_return', function (req, res, next) {
    
// let vnp_Params = req.query;


//     const secureHash = vnp_Params['vnp_SecureHash'];


//     delete vnp_Params['vnp_SecureHash'];
//     delete vnp_Params['vnp_SecureHashType'];

//     vnp_Params = sortObject(vnp_Params);


//     const tmnCode = process.env.VNP_TMN_CODE;
//     const secretKey = process.env.VNP_HASH_SECRET;


//     const querystring = require('qs');
//     const signData = querystring.stringify(vnp_Params, { encode: false });


//     const crypto = require("crypto");     
//     const hmac = crypto.createHmac("sha512", secretKey);
//     const signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     

  
//         if (secureHash === signed) {
//         // ✅ Nếu chữ ký hợp lệ
//         if (vnp_Params['vnp_ResponseCode'] === '00') {
//             // thanh toán thành công
//           return res.redirect(
//             `http://localhost:5173/OrderSuccessPage/transaction?status=success&orderId=${vnp_Params['vnp_TxnRef']}`
//           );
//         } else {
//             // thanh toán thất bại
//             return res.redirect(
//                 `http://localhost:5173/OrderSuccessPage?status=fail&orderId=${vnp_Params['vnp_TxnRef']}`
//             );
//         }
//     } else {
//             return res.redirect("http://localhost:5173/OrdrSuccessPage?status=invalid-signature");
//     }

// });
/**
 * 
 * GET /vnpay_ipn
 */
router.get('/vnpay_return', (req, res) => {
  console.log("=== VNPAY RETURN START ===");
  console.log("Raw query:", req.query);

  let vnp_Params = { ...req.query };
  const secureHash = vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHashType;

  vnp_Params = sortObject(vnp_Params);
  console.log("Sorted params:", vnp_Params);

  const secretKey = process.env.VNP_HASH_SECRET || process.env.VNP_HASHSECRET;
  const signData = Object.keys(vnp_Params).map(k => `${k}=${vnp_Params[k]}`).join('&');
  console.log("SignData:", signData);

  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf8')).digest('hex');
  console.log("Computed signed:", signed);
  console.log("Received secureHash:", secureHash);

  if (signed === secureHash) {
    const code = vnp_Params.vnp_ResponseCode;
    console.log("Signature valid, responseCode:", code);
    if (code === '00') {
      return res.redirect(`https://nest-shop-eight.vercel.app//OrderPageSuccess?status=success&orderId=${encodeURIComponent(vnp_Params.vnp_TxnRef)}`);
    } else {
      return res.redirect(`https://nest-shop-eight.vercel.app//OrderPageSuccess?status=fail&orderId=${encodeURIComponent(vnp_Params.vnp_TxnRef)}`);
    }
  } else {
    console.log("Signature mismatch");
    return res.redirect(`https://nest-shop-eight.vercel.app//OrderPageSuccess?status=invalid-signature`);
  }
});

router.get("/vnpay_ipn", (req, res) => {
  let vnp_Params = req.query;
  const secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  const signData = qs.stringify(vnp_Params, { encode: false });
  const signed = createSecureHash(signData, vnp_HashSecret);

  if (secureHash === signed) {
    res.status(200).json({ RspCode: "00", Message: "Success" });
  } else {
    res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
  }
});

/**
 * POST /querydr
 */
router.post("/querydr", async (req, res) => {
  try {
    process.env.TZ = "Asia/Ho_Chi_Minh";
    const date = new Date();

    const vnp_TxnRef = req.body.orderId;
    const vnp_TransactionDate = req.body.transDate;
    const vnp_RequestId = moment(date).format("HHmmss");
    const vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");

    const vnp_Params = {
      vnp_RequestId,
      vnp_Version: "2.1.0",
      vnp_Command: "querydr",
      vnp_TmnCode: vnp_TmnCode,
      vnp_TxnRef,
      vnp_OrderInfo: "Truy vấn GD mã:" + vnp_TxnRef,
      vnp_TransactionDate,
      vnp_CreateDate,
      vnp_IpAddr:
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress,
    };

    const signData = Object.values(vnp_Params).join("|");
    const vnp_SecureHash = createSecureHash(signData, vnp_HashSecret);

    vnp_Params["vnp_SecureHash"] = vnp_SecureHash;

    const response = await axios.post(vnp_Api, vnp_Params);
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: "99", message: "Lỗi server" });
  }
});

/**
 * POST /refund
 */
router.post("/refund", async (req, res) => {
  try {
    process.env.TZ = "Asia/Ho_Chi_Minh";
    const date = new Date();

    const vnp_TxnRef = req.body.orderId;
    const vnp_TransactionDate = req.body.transDate;
    const vnp_Amount = req.body.amount * 100;
    const vnp_TransactionType = req.body.transType;
    const vnp_CreateBy = req.body.user;

    const vnp_RequestId = moment(date).format("HHmmss");
    const vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");

    const vnp_Params = {
      vnp_RequestId,
      vnp_Version: "2.1.0",
      vnp_Command: "refund",
      vnp_TmnCode: vnp_TmnCode,
      vnp_TransactionType,
      vnp_TxnRef,
      vnp_Amount,
      vnp_TransactionNo: "0",
      vnp_TransactionDate,
      vnp_CreateBy,
      vnp_OrderInfo: "Hoàn tiền GD mã:" + vnp_TxnRef,
      vnp_CreateDate,
      vnp_IpAddr:
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress,
    };

    const signData = Object.values(vnp_Params).join("|");
    const vnp_SecureHash = createSecureHash(signData, vnp_HashSecret);

    vnp_Params["vnp_SecureHash"] = vnp_SecureHash;

    const response = await axios.post(vnp_Api, vnp_Params);
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: "99", message: "Lỗi server" });
  }
});

module.exports = router;
