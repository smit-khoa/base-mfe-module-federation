### Yêu cầu

-   Công nghệ sử dụng: Vue 3, TypeScript, SCSS, Pinia, Vue Router, tailwindcss, shadcn/ui
-   css sẽ được viết dạng module, các class sẽ được viết dạng camelCase, nên sử dụng tailwindcss để thuận tiện hơn, khai báo: s = useCssModule() và sử dụng s.className để thêm class vào element, tránh
    viết $style.className gây dài dòng
-   Riêng trong service "client-gate-shared-dependency" thì sẽ viết class bằng BEM và tailwindcss, vì nó không được hỗ trợ style module
-   Các hình ảnh không được sử dụng trực tiếp thẻ svg, mà phải được tạo trong file `src/assets/images/<tên folder theo chức năng>/<tên file>.svg`, các ảnh đã có thì sẽ không tạo thêm, khi dùng ở
    component thì sử dụng `<img :src="image('<tên file>.svg')" alt="" />` và `const image = (file: string) => require(`<path>/${file}`);`
-   Ưu tiên sử dụng các component có sẵn trong src/components/custom, nếu chưa có thì sử dụng trong src/components/ui của shadcn/ui, nếu chưa có thì tạo thêm, các component trong src/components/custom
    đã được đăng ký global nên sử dụng trực tiếp `<tagname>` không cần khai báo, còn các component trong src/components/ui phải được khai báo mới có thể sử dụng, ví dụ:
    `import { DropdownMenu } from "shared/components/ui"`
    `components: { DropdownMenu: DropdownMenu.DropdownMenu, DropdownMenuTrigger: DropdownMenu.DropdownMenuTrigger, DropdownMenuContent: DropdownMenu.DropdownMenuContent, DropdownMenuItem: DropdownMenu.DropdownMenuItem, DropdownMenuSeparator: DropdownMenu.DropdownMenuSeparator, DropdownMenuRadioGroup: DropdownMenu.DropdownMenuRadioGroup, DropdownMenuRadioItem: DropdownMenu.DropdownMenuRadioItem, DropdownMenuLabel: DropdownMenu.DropdownMenuLabel, Button, },`
    `<DropdownMenu> <DropdownMenuTrigger as-child> <Button variant="outline"> Dropdown custom </Button> </DropdownMenuTrigger> <DropdownMenuContent class="w-56" side="bottom-start"
    >
        <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup v-model="position">
          <DropdownMenuRadioItem value="top"> Top </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom"> Bottom </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="right"> Right </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>`
-   Các phần giống nhau nên sử dụng v-for để tránh trùng lặp code
-   Chỉ viết giao diện dựa trên những gì đã có trong link thiết kế, không tự viết thêm giao diện

### yêu cầu trước khi code thì viết kế hoạch thay đổi vào file planning.md, khi được duyệt thì mới được thay đổi, file planning tôi có thể thay đổi kế hoạch trong đó
