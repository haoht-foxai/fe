# FoxAI eGov Frontend

Giao diện React đơn giản để kiểm tra danh sách file khách hàng đã import thông qua API `quick-analyze`.

## Cấu trúc chính

- `src/App.tsx` - entry component, điều khiển paging và trạng thái tải.
- `src/api/documents.ts` - gọi API `GET /api/v1/documents/quick-analyze`.
- `src/components/DocumentList.tsx` - hiển thị danh sách tài liệu.
- `src/components/DocumentCard.tsx` - hiển thị từng mục tài liệu chi tiết.
- `src/components/Layout.tsx` - layout trang.
- `src/types/document.ts` - kiểu dữ liệu trả về từ API.

## Cài đặt

Từ thư mục `fe`:

```bash
npm install
npm run dev
```

## Cấu hình

Sửa file `.env` nếu cần thay đổi `VITE_API_BASE_URL` hoặc `VITE_APP_TOKEN`.
