import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { ProfilePage } from "../pages/ProfilePage";

test.describe("Profile User Test", () => {

    test.beforeEach(async ({page}) => {
        
        await page.goto("https://demo5.cybersoft.edu.vn/",
            {
                waitUntil: 'domcontentloaded',
                timeout: 30000
            }
        )
        
        const homePage = new HomePage(page)
        const profilePage = new ProfilePage(page)

         
        await homePage.clickUserImage()

        await profilePage.waitFormLogin()

        await profilePage.loginUser("tester123456@gmail.com","anhkietdk19")

        await homePage.clickNameUser()

        await homePage.clickDashBoard()

        await page.waitForTimeout(2000)
    })

    test("TC1: Xem thông tin Profile", async ({page}) =>{
        const profilePage = new ProfilePage(page)

        await expect(profilePage.editProfileButton).toBeVisible()
        await expect(profilePage.uppdateAvatarButton).toBeVisible()
        await expect(profilePage.identityVerify).toBeVisible()
        await expect(page).toHaveURL(/info-user/);
    })

    test("TC2: Cập nhật thông tin Profile", async ({page}) =>{
        const profilePage = new ProfilePage(page)

        await profilePage.clickEditProfileBtn()
        await profilePage.fillEmail("tester123456@gmail.com")
        await profilePage.fillName("Nguyen Van A")
        await profilePage.fillPhone("0123456789")
        await profilePage.fillBitrh("04/03/2002")
        await profilePage.selectGender("Nam")
        
        await profilePage.clickUpadteProdfileBtn()
        await expect(profilePage.messageNoitceSuccess).toBeVisible();

    })

    test("TC3: Cập nhật Avatar", async ({page}) =>{
        const profilePage = new ProfilePage(page)
        await profilePage.uploadAvartar("data/image.png")
        await expect(profilePage.messageUpploadAvatarSuccess).toBeVisible();
    })

    test("TC4: Lịch sử đặt phòng", async ({page}) =>{
        const profilePage = new ProfilePage(page)
        const count = await profilePage.bookingItem.count();

    if (count > 0) {
        await expect(profilePage.bookingItem.first()).toBeVisible();
        } else {
            await expect(profilePage.emptyMessage).toBeVisible();
            }
    })

    test("TC5: Thông báo lỗi khi up ảnh hơn 1 MB", async ({page}) =>{
        const profilePage = new ProfilePage(page)
        await profilePage.uploadAvartar("data/image.jpg")
        await expect(profilePage.messageUpploadAvatarError).toContainText('Dung lượng hình phải dưới 1Mb');
    })



})

