import {Page, Locator} from '@playwright/test'

export class HomePage {
    readonly page: Page;

    //locator
    
    readonly imageUser: Locator;
    readonly dashBoard: Locator;
    readonly userImageLogin: Locator;

    constructor (page:Page) {
        this.page = page;
        
        this.imageUser = page.locator("img.rounded-full")
        this.dashBoard = page.getByRole("link", { name: "Dashboard" })
        this.userImageLogin = page.locator("img[src*='6596121']")   
    }

    //Click User Image
     async clickUserImage(): Promise<void> {
        await this.userImageLogin.click()
        await this.page.waitForTimeout(2000)
    }

    //click nameUser
    async clickNameUser(): Promise<void> {
        await this.imageUser.click()
        await this.page.waitForTimeout(2000)
    }

    
    //Click DashBoard
    async clickDashBoard(): Promise<void> {
        await this.dashBoard.click()
        await this.page.waitForTimeout(2000)
    }

}