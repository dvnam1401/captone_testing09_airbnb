import { test, expect } from "@playwright/test";
import { ProfilePage } from "../pages/ProfilePage";
import { readFileFromCSV } from "../utils/csvReader";
import { loginAuth } from "../utils/loginAuth";
import { expectNoSuccessResponse } from "../utils/assertNoApiCall";

const userDataLogin = readFileFromCSV<any>("userlogin.csv")[0];
const editData = readFileFromCSV<any>("editData.csv")[0];
const invalidData = readFileFromCSV<any>("invalidDataProfile.csv")[0];

test.describe("User Profile - Cập nhật thông tin cá nhân", () => {

    test.beforeEach(async ({page}) => {

        await loginAuth.login(
            page,
            userDataLogin.email,
            userDataLogin.password,
            userDataLogin.fullName,
        );

    })

    test("TC2: Cập nhật thông tin Profile thành công", async ({page}) =>{
        const profilePage = new ProfilePage(page)

        await profilePage.clickEditProfileBtn()
        await profilePage.fillEmail(editData.email)
        await profilePage.fillName(editData.fullName)
        await profilePage.fillPhone(editData.phoneNumber)
        await profilePage.fillBitrh(editData.birthDay)
        await profilePage.selectGender(editData.genDer)
        
        await profilePage.clickUpadteProdfileBtn()
        await expect(profilePage.nameUser).toContainText(editData.fullName)
        await expect(profilePage.messageNoitceSuccess).toBeVisible();

    })

    test("TC3: Cập nhật thông tin Profile với email không hợp lệ", async ({page}) =>{
        const profilePage = new ProfilePage(page)

        await profilePage.clickEditProfileBtn()
        await profilePage.fillEmail(invalidData.email)
        
        await profilePage.clickUpadteProdfileBtn()

        await expect(page.getByText("Email không hợp lệ!")).toBeVisible();

        await expectNoSuccessResponse(page, () => profilePage.clickUpadteProdfileBtn());
    })

    test("TC4: Cập nhật thông tin Profile với tên không hợp lệ", async ({page}) =>{
        const profilePage = new ProfilePage(page)

        await profilePage.clickEditProfileBtn()
        await profilePage.fillName(invalidData.fullName)
        
        await profilePage.clickUpadteProdfileBtn()

        await expect(page.getByText("Họ tên không hợp lệ!")).toBeVisible();

        await expectNoSuccessResponse(page, () => profilePage.clickUpadteProdfileBtn());
    })

    test("TC5: Cập nhật thông tin Profile với số điện thoại không hợp lệ", async ({page}) =>{
        const profilePage = new ProfilePage(page)

        await profilePage.clickEditProfileBtn()
        await profilePage.fillPhone(invalidData.phoneNumber)
        
        await profilePage.clickUpadteProdfileBtn()

        await expect(page.getByText("Sai định dạng số điện thoại!")).toBeVisible();

        await expectNoSuccessResponse(page, () => profilePage.clickUpadteProdfileBtn());
    })

    test("TC6: Cập nhật thông tin Profile khi không chọn ngày sinh", async ({page}) =>{
        const profilePage = new ProfilePage(page)

        await profilePage.clickEditProfileBtn()
        await profilePage.fillBitrh(invalidData.birthDay)
        
        await profilePage.clickUpadteProdfileBtn()

        await expect(page.getByText("Vui lòng chọn ngày sinh!")).toBeVisible();

        await expectNoSuccessResponse(page, () => profilePage.clickUpadteProdfileBtn());
    })


})