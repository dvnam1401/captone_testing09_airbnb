import { test, expect } from "@playwright/test";
import { ProfilePage } from "../pages/ProfilePage";
import { readFileFromCSV } from "../utils/csvReader";
import { loginAuth } from "../utils/loginAuth";

const userDataLogin = readFileFromCSV<any>("userlogin.csv")[0];

test.describe("User Profile - Upload Avatar", () => {

    test.beforeEach(async ({page}) => {

        await loginAuth.login(
            page,
            userDataLogin.email,
            userDataLogin.password,
            userDataLogin.fullName,
        );

    })
    
    
    test("TC7: Cập nhật Avatar", async ({page}, testInfo) =>{
        const profilePage = new ProfilePage(page)
        await profilePage.uploadAvartar("data/image.png")
        await expect(profilePage.messageUpploadAvatarSuccess).toBeVisible();
    })


    test("TC8: Thông báo lỗi khi up ảnh hơn 1 MB", async ({page}, testInfo) =>{
        const profilePage = new ProfilePage(page)
        await profilePage.uploadAvartar("data/image.jpg")
        await expect(profilePage.messageUpploadAvatarError).toContainText('Dung lượng hình phải dưới 1Mb');
    })

})
  
