import type { Page } from 'playwright';
import { expect } from 'playwright/test';
import { qpmnconfig } from '../../config/envConfig';

export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async open() {
        await this.page.goto( qpmnconfig.QPMN_BASEURL + '/app/customize/new-products/all');
        if (this.page.viewportSize()?.width > 767){
            await this.page.locator('a').filter({ hasText: 'Login' }).click();
        }else{
            await this.page.getByRole('button', { name: '' }).click();
            await this.page.getByRole('button', { name: 'SIGN IN' }).click();           
        }

    }
    
    async login(email: string, password: string) {
        await this.page.waitForLoadState('domcontentloaded'),
        await this.page.getByPlaceholder('Please input your email').pressSequentially(email, { delay: 50 });
        await this.page.getByPlaceholder('Please input your password').pressSequentially(password, { delay: 50 });
        await this.page.getByRole('button', { name: 'Sign In' }).click();
    }

    //incorrect user name or password
    async loginFailed(email: string, password: string) {
        await this.login(email,password);
        await expect(this.page.getByText('Your email or password is incorrect')).toBeVisible();
        await this.page.getByRole('button', { name: 'OK' }).click();
        await this.page.close();
    }

    //empty  password
    async loginWithoutPassword(email: string, password: string) {
        await this.login(email,password);
        await expect(this.page.getByPlaceholder('Please input your password')).toBeVisible();
        await this.page.close();
    }

    async waitForLogin(): Promise<void>{
        if (this.page.viewportSize()?.width > 767){
            await this.page.locator('.user-info__menu>.user-menu-down').waitFor({state: "visible"});
        }else{ 
            await this.page.locator('.catalog-products-title').waitFor({state: "visible"});         
        }
    }
   
}
