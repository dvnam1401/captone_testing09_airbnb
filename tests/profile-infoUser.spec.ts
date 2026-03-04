import { test, expect } from "@playwright/test";
import { ProfilePage } from "../pages/ProfilePage";
import { readFileFromCSV } from "../utils/csvReader";
import { loginAuth } from "../utils/loginAuth";

const userDataLogin = readFileFromCSV<any>("userlogin.csv")[0];

test.describe("User Profile - Xem thông tin Profile", () => {

    test.beforeEach(async ({page}) => {

        await loginAuth.login(
            page,
            userDataLogin.email,
            userDataLogin.password,
            userDataLogin.fullName,
        );

    })
    
    test("TC1: Xem thông tin Profile", async ({page}) =>{
        const profilePage = new ProfilePage(page)

        await expect(profilePage.editProfileButton).toBeVisible()
        await expect(profilePage.uppdateAvatarButton).toBeVisible()
        await expect(profilePage.identityVerify).toBeVisible()
        await expect(profilePage.nameUser).toContainText(userDataLogin.fullName)
        await expect(page).toHaveURL(/info-user/);
    })

})

