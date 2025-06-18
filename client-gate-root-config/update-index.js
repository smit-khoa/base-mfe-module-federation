const fs = require("fs");
const path = require("path");

function updateIndexHtml() {
  // Đường dẫn đến thư mục build output của root-config
  const buildDir = path.resolve(
    __dirname,
    "..",
    "deployment-app",
    "public",
    "smit-gate-root-config"
  );

  // Đường dẫn file index.html template từ root-config build
  const templatePath = path.resolve(buildDir, "index.html");

  // Đường dẫn file index.html sẽ được tạo
  const outputPath = path.resolve(
    __dirname,
    "..",
    "deployment-app",
    "public",
    "index.html"
  );

  console.log("🔍 Đang tìm các file JS trong:", buildDir);

  try {
    // Kiểm tra thư mục build có tồn tại không
    if (!fs.existsSync(buildDir)) {
      console.error("❌ Thư mục build không tồn tại:", buildDir);
      return;
    }

    // Kiểm tra file template có tồn tại không
    if (!fs.existsSync(templatePath)) {
      console.error("❌ File template index.html không tồn tại:", templatePath);
      return;
    }

    // Đọc file template HTML hoàn chỉnh
    let htmlContent = fs.readFileSync(templatePath, "utf8");
    console.log("📄 Đã đọc template HTML từ:", templatePath);

    // Đọc tất cả file trong thư mục build
    const files = fs.readdirSync(buildDir);

    // Lọc và sắp xếp các file .js
    const jsFiles = files
      .filter((file) => file.endsWith(".bundle.js"))
      .sort((a, b) => {
        // Sắp xếp: main.js cuối cùng, các file khác theo số
        if (a.startsWith("main.")) return 1;
        if (b.startsWith("main.")) return -1;

        const numA = parseInt(a.split(".")[0]) || 0;
        const numB = parseInt(b.split(".")[0]) || 0;
        return numA - numB;
      });

    console.log("📝 Tìm thấy các file JS:", jsFiles);

    // Loại bỏ các script tags cũ (các file .bundle.js)
    htmlContent = htmlContent.replace(
      /<script[^>]*src="[^"]*\.bundle\.js"[^>]*><\/script>/g,
      ""
    );

    // Tạo các thẻ script mới với đường dẫn tương đối
    const scriptTags = jsFiles
      .map(
        (file) =>
          `<script defer="defer" src="./smit-gate-root-config/${file}"></script>`
      )
      .join("");

    // Chèn script tags vào trước tag </head>
    if (htmlContent.includes("</head>")) {
      htmlContent = htmlContent.replace("</head>", `${scriptTags}</head>`);
    } else {
      console.warn("⚠️ Không tìm thấy tag </head>, thêm script vào cuối file");
      htmlContent += scriptTags;
    }

    // Ghi file index.html mới
    fs.writeFileSync(outputPath, htmlContent, "utf8");
    console.log("✅ Đã tạo file index.html tại:", outputPath);
    console.log("📄 Script tags đã thêm:", jsFiles.length);
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật index.html:", error.message);
  }
}

module.exports = updateIndexHtml;
