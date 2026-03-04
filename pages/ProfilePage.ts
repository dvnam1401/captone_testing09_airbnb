import { Page, Locator} from "@playwright/test";

export class ProfilePage {
    readonly page: Page;

    // locator
    readonly editProfileButton : Locator;
    readonly updateButton : Locator;
    readonly emailInput : Locator;
    readonly nameInput : Locator;
    readonly phoneInPut : Locator;
    readonly birthdayInput : Locator;
    readonly genderInput : Locator;
    readonly messageNoitceSuccess : Locator

    readonly uppdateAvatarButton: Locator;
    readonly chooseFileBtn: Locator;
    readonly upploadAvatarBtn: Locator;
    readonly messageUpploadAvatarSuccess: Locator;
    readonly messageUpploadAvatarError: Locator;

    readonly identityVerify: Locator;

    readonly bookingItem: Locator;
    readonly emptyMessage: Locator;
    readonly nameUser: Locator;

    readonly iconX: Locator;


    constructor (page: Page) {
        this.page = page

        this.editProfileButton = page.getByRole("button", { name: "Chỉnh sửa hồ sơ" })
        this.updateButton= page.locator("//div[contains(@class,'ant-modal-content')]//button[.//span[text()='Cập nhật']]")
        this.emailInput = page.getByRole('textbox', { name: 'vidu@gmail.com' })
        this.nameInput = page.locator(".ant-modal-content #name")
        this.phoneInPut = page.locator(".ant-modal-content #phone")
        this.birthdayInput = page.locator(".ant-modal-content #birthday")
        this.genderInput = page.locator('.ant-modal-content .ant-select').first()
        this.messageNoitceSuccess = page.locator("//div[@class='ant-message-notice-content']" +
            "//span[contains(text(),'Cập nhật thông tin thành công')]")

        this.uppdateAvatarButton = page.locator("//div[@class='ant-card-body']//button[contains(text(),'Cập nhật')]")
        this.chooseFileBtn = page.locator("input[type='file']")  
        this.upploadAvatarBtn = page.getByRole("button", { name: "Upload Avatar" })  
        this.messageUpploadAvatarSuccess = page.locator("//div[@class='ant-message-notice-content']" +
            "//span[contains(text(),'Cập nhật avatar thành công!')]")
        this.messageUpploadAvatarError = page.locator(".ant-message-error")
        
        this.identityVerify = page.getByText("Xác minh danh tính", { exact: true })

        this.bookingItem = page.locator("//div[@class='ant-card-body']/ancestor::a")
        this.emptyMessage = page.getByText('Bạn chưa đặt phòng nào.')
        this.nameUser = page.locator("span.capitalize")

        this.iconX =  page.locator('svg[data-icon="close-circle"]').nth(3);   

    }

    //Cập nhật thông tin profile
        //Click edit profile
    async clickEditProfileBtn(): Promise<void> {
        await this.editProfileButton.click()
        await this.page.waitForTimeout(2000)
    }

        //Nhập email
    async fillEmail(email:string): Promise<void> {
        await this.emailInput.click()
        await this.emailInput.clear()
        await this.emailInput.fill(email)
        await this.page.waitForTimeout(2000)
    }

        //Nhập name
    async fillName(name:string): Promise<void> {
        await this.nameInput.click()
        await this.nameInput.clear()
        await this.nameInput.fill(name)
        await this.page.waitForTimeout(2000)
    }    
        //Nhập số điện thoại
    async fillPhone(phone:string): Promise<void> {
        await this.phoneInPut.click()
        await this.phoneInPut.clear()
        await this.phoneInPut.fill(phone)
        await this.page.waitForTimeout(2000)
    }
        //Nhập ngày sinh
    async fillBitrh(birth:string): Promise<void> {
        await this.birthdayInput.click()
        await this.iconX.click()
        await this.birthdayInput.pressSequentially(birth);    
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(2000)
    }
        //Chọn giới tính
    async selectGender(gender:string): Promise<void> {
        await this.genderInput.waitFor({state:'visible'})
        await this.genderInput.click()
        await this.page
        .locator('.ant-select-item-option', { hasText: gender })
        .click();
        
    }

        //Click cập nhật Profile
    async clickUpadteProdfileBtn(): Promise<void> {
        await this.updateButton.waitFor({state:'visible', timeout:2000})
        await this.updateButton.click()
    }

    //Upload Avatar
    async uploadAvartar(path:string): Promise<void> {
        // click cập nhật ảnh
        await this.uppdateAvatarButton.waitFor()
        await this.uppdateAvatarButton.click()
        await this.page.waitForTimeout(2000)

        // click choose file
        await this.chooseFileBtn.waitFor({state: 'visible', timeout: 10000}) 
        await this.chooseFileBtn.setInputFiles(path);
        await this.page.waitForTimeout(2000)



        // chọn hình và upload hình
        await this.upploadAvatarBtn.waitFor({state:'visible', timeout: 10000})
        await this.upploadAvatarBtn.click()
        await this.page.waitForTimeout(3000)
    }

  

}